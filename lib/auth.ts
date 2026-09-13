import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";

/**
 * A single shared passphrase guards the private areas — her diary, her
 * letters, and every destructive action. She and the friends helping build the
 * site share it; everyone else gets the public /write page and nothing more.
 *
 * Per SEC-02 this is enforced at each resource, not only at the route table,
 * and per SEC-04 it is enforced server-side. The client is never trusted.
 */

const COOKIE = "rizzu_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function passphrase(): string {
  return process.env.RIZZU_PASSPHRASE ?? "";
}

/**
 * Signing key. Derived from the passphrase plus an optional separate secret so
 * that rotating the passphrase invalidates every existing session.
 */
function key(): Buffer {
  return crypto.createHash("sha256").update(
    `${process.env.RIZZU_SECRET ?? "rizzu"}::${passphrase()}`,
  ).digest();
}

function sign(expiresAt: number): string {
  const mac = crypto
    .createHmac("sha256", key())
    .update(String(expiresAt))
    .digest("hex");
  return `${expiresAt}.${mac}`;
}

function verify(token: string | undefined): boolean {
  if (!token) return false;

  const [expRaw, mac] = token.split(".");
  const expiresAt = Number(expRaw);
  if (!Number.isFinite(expiresAt) || !mac) return false;
  if (Date.now() > expiresAt) return false;

  const expected = crypto
    .createHmac("sha256", key())
    .update(expRaw)
    .digest("hex");

  // Constant-time compare; a length mismatch would make timingSafeEqual throw.
  const a = Buffer.from(mac, "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * True when no passphrase is configured. The site is then fully open, which is
 * correct for local development and explicitly surfaced in the UI so it can
 * never be mistaken for a protected deployment.
 */
export function authDisabled(): boolean {
  return passphrase().length === 0;
}

export async function isAuthed(): Promise<boolean> {
  if (authDisabled()) return true;
  const jar = await cookies();
  return verify(jar.get(COOKIE)?.value);
}

/** Constant-time passphrase check, then issue the session cookie. */
export async function login(attempt: string): Promise<boolean> {
  const expected = passphrase();
  if (!expected) return true;

  const a = Buffer.from(attempt ?? "", "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const jar = await cookies();

  // Secure everywhere except plain-HTTP localhost: a Secure cookie is simply
  // dropped over http://, which would silently break a local production build.
  // Keyed on the host rather than NODE_ENV, since `next start` reports
  // production while still serving http://localhost.
  const host = (await headers()).get("host") ?? "";
  const isLocalhost =
    host.startsWith("localhost") || host.startsWith("127.0.0.1");

  // SEC-20: all three flags set explicitly rather than trusting defaults.
  jar.set(COOKIE, sign(expiresAt), {
    httpOnly: true,
    secure: !isLocalhost,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return true;
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

/**
 * Guard for API routes. Returns a 404 rather than a 401 for read routes so an
 * unauthenticated caller learns nothing about what exists (SEC-09).
 */
export async function requireAuth(): Promise<Response | null> {
  if (await isAuthed()) return null;
  return new Response(JSON.stringify({ error: "Not found." }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}

/**
 * SEC-17: the session cookie is SameSite=Lax, which still permits top-level
 * cross-site POSTs, so state-changing requests also get an origin check.
 */
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // Same-origin fetches may omit it entirely.

  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!host) return false;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

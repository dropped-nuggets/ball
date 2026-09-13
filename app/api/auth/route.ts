import { NextResponse } from "next/server";
import { login, logout, sameOrigin } from "@/lib/auth";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/** Exchange the passphrase for a session cookie. */
export async function POST(req: Request) {
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }

  // Bounds brute-forcing of a short shared passphrase (SEC-22).
  const limit = rateLimit(clientKey(req, "auth"), 8, 10 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  const body = await req.json().catch(() => null);
  const ok = await login(String(body?.passphrase ?? ""));

  if (!ok) {
    // Says nothing about why (SEC-09).
    return NextResponse.json(
      { error: "That's not it." },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await logout();
  return NextResponse.json({ ok: true });
}

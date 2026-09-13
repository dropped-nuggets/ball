import "server-only";

/**
 * A small fixed-window limiter for the public endpoints (SEC-22): the write
 * link is shareable, so without a cap one bored person can fill the database
 * with 20,000-character letters.
 *
 * State is per-instance and in memory. On serverless that means the real limit
 * is looser than the configured one, since each cold instance starts fresh —
 * it raises the cost of abuse rather than making it impossible. A shared store
 * would be the upgrade if this ever needed to hold under real pressure.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
const MAX_KEYS = 5_000;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();

  // Opportunistic cleanup so a long-lived instance can't grow without bound.
  if (windows.size > MAX_KEYS) {
    for (const [k, w] of windows) {
      if (w.resetAt <= now) windows.delete(k);
    }
    if (windows.size > MAX_KEYS) windows.clear();
  }

  const existing = windows.get(key);

  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;

  if (existing.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    };
  }

  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

/** Best-effort client identity behind Vercel's proxy. */
export function clientKey(req: Request, bucket: string): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0]?.trim() || "unknown";
  return `${bucket}:${ip}`;
}

export function tooManyRequests(retryAfterSeconds: number): Response {
  return new Response(
    JSON.stringify({
      error: "That's a lot of writing. Give it a minute and try again.",
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSeconds),
      },
    },
  );
}

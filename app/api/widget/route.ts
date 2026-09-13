import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { isAuthed } from "@/lib/auth";
import { listLockets } from "@/lib/store";
import { PLACES, getWeather, skyFor, SKY_LABEL } from "@/lib/weather";
import { upcomingFestivals, daysUntil } from "@/lib/festivals";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * Compact JSON for a phone home-screen widget (iOS Scriptable, Android KWGT).
 *
 * A widget cannot carry a browser session, so it authenticates with the
 * passphrase in an `x-rijuko-key` HEADER. Never a query parameter — those end
 * up in server logs, proxy logs and browser history (SEC-07).
 */
function keyMatches(req: Request): boolean {
  const expected = process.env.RIJUKO_PASSPHRASE ?? "";
  if (!expected) return true; // No passphrase configured: site is open anyway.

  const given = req.headers.get("x-rijuko-key") ?? "";
  const a = Buffer.from(given, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function GET(req: Request) {
  const limit = rateLimit(clientKey(req, "widget"), 60, 60 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  if (!keyMatches(req) && !(await isAuthed())) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const [lockets, weather] = await Promise.all([
    listLockets(1),
    getWeather(),
  ]);

  const now = new Date();
  const todayISO = now.toISOString().slice(0, 10);
  const next = upcomingFestivals(todayISO, 1)[0];

  const times = Object.fromEntries(
    PLACES.map((p) => [
      p.key,
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: p.timeZone,
      }).format(now),
    ]),
  );

  const latest = lockets[0];

  return NextResponse.json({
    updatedAt: now.toISOString(),
    times,
    weather: weather.map((w) => ({
      key: w.key,
      tempC: w.tempC,
      sky: SKY_LABEL[skyFor(w.code)],
    })),
    nextFestival: next
      ? {
          name: next.name,
          date: next.date,
          inDays: daysUntil(todayISO, next.date),
          approx: next.approx,
        }
      : null,
    locket: latest
      ? {
          url: latest.url,
          note: latest.note,
          sentBy: latest.sentBy,
          createdAt: latest.createdAt,
        }
      : null,
  });
}

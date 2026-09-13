import { NextResponse } from "next/server";
import {
  addDiary,
  deleteDiary,
  listDiary,
  setDiaryStickers,
} from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import type { Sticker } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * The diary is entirely private (SEC-02). Every method here is guarded; there
 * is no public read path.
 */
async function guard(req?: Request): Promise<Response | null> {
  const denied = await requireAuth();
  if (denied) return denied;
  if (req && !sameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }
  return null;
}

export async function GET() {
  const denied = await guard();
  if (denied) return denied;

  return NextResponse.json({ entries: await listDiary() });
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const text = String(body?.body ?? "").trim();

  if (!text) {
    return NextResponse.json(
      { error: "An entry needs some words." },
      { status: 400 },
    );
  }

  const entry = await addDiary({
    title: String(body?.title ?? "").slice(0, 160),
    body: text.slice(0, 20000),
    mood: String(body?.mood ?? "").slice(0, 40),
  });

  return NextResponse.json({ entry }, { status: 201 });
}

const clamp = (n: unknown, min: number, max: number, fallback: number) => {
  const v = Number(n);
  return Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
};

/** Only http(s) and data: images may be pinned to a board (SEC-05). */
function safeImageUrl(raw: unknown): string | null {
  const value = String(raw ?? "");
  if (!value) return null;
  if (value.startsWith("data:image/")) return value.slice(0, 8_000_000);
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Saves a scrapbook layout. Values are clamped so nothing lands off-board. */
export async function PATCH(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");

  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  if (!Array.isArray(body?.stickers)) {
    return NextResponse.json(
      { error: "stickers must be an array." },
      { status: 400 },
    );
  }

  const stickers: Sticker[] = [];
  for (const [i, raw] of (body.stickers as Sticker[]).slice(0, 40).entries()) {
    const url = safeImageUrl(raw?.url);
    if (!url) continue;

    stickers.push({
      id: String(raw.id ?? `s${i}`).slice(0, 60),
      url,
      x: clamp(raw.x, -10, 110, 50),
      y: clamp(raw.y, -10, 110, 50),
      w: clamp(raw.w, 8, 90, 34),
      rotate: clamp(raw.rotate, -180, 180, 0),
      z: clamp(raw.z, 0, 999, i),
      caption: String(raw.caption ?? "").slice(0, 120),
      frame: raw.frame === "plain" ? "plain" : "polaroid",
    });
  }

  await setDiaryStickers(id, stickers);
  return NextResponse.json({ ok: true, count: stickers.length });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await deleteDiary(id);
  return NextResponse.json({ ok: true });
}

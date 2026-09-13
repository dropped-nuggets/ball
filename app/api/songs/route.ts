import { NextResponse } from "next/server";
import { addSong, deleteSong, listSongs } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json({ songs: await listSongs() });
}

/** Public: she and her friends both add to the mixtape. */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "songs"), 10, 10 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim();
  const addedBy = String(body?.addedBy ?? "").trim();

  if (!title) {
    return NextResponse.json(
      { error: "A song needs a title." },
      { status: 400 },
    );
  }
  if (!addedBy) {
    return NextResponse.json(
      { error: "Say who's adding it." },
      { status: 400 },
    );
  }

  const raw = String(body?.url ?? "").trim();
  // Only allow http(s) links — a javascript: url here would render as a
  // clickable anchor for anyone viewing the mixtape.
  let url = "";
  if (raw) {
    try {
      const parsed = new URL(raw);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        url = parsed.toString();
      }
    } catch {
      url = "";
    }
  }

  const song = await addSong({
    title: title.slice(0, 160),
    artist: String(body?.artist ?? "").trim().slice(0, 120),
    note: String(body?.note ?? "").trim().slice(0, 500),
    addedBy: addedBy.slice(0, 80),
    url,
  });

  return NextResponse.json({ song }, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }
  await deleteSong(id);
  return NextResponse.json({ ok: true });
}

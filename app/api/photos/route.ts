import { NextResponse } from "next/server";
import { addPhoto, deletePhoto, listPhotos } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

  return NextResponse.json({ photos: await listPhotos() });
}

/**
 * The stored url is rendered straight into an <img src>, so only real image
 * sources are accepted — never an arbitrary caller-supplied string (SEC-05).
 */
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

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const url = safeImageUrl(body?.url);

  if (!url) {
    return NextResponse.json(
      { error: "That doesn't look like an image." },
      { status: 400 },
    );
  }

  const photo = await addPhoto({
    url,
    caption: String(body?.caption ?? "").slice(0, 300),
    place: String(body?.place ?? "").slice(0, 120),
  });

  return NextResponse.json({ photo }, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await deletePhoto(id);
  return NextResponse.json({ ok: true });
}

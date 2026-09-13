import { NextResponse } from "next/server";
import { addLetter, listLetters, markLetterOpened } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/** Private: only she reads the letters (SEC-02). */
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json({ letters: await listLetters() });
}

/**
 * Public by design — anyone holding the write link can post a letter — so this
 * is the endpoint that needs a cap (SEC-22).
 */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "letters"), 5, 10 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  const body = await req.json().catch(() => null);
  const text = String(body?.body ?? "").trim();
  const author = String(body?.author ?? "").trim();

  if (!text) {
    return NextResponse.json(
      { error: "Write something first." },
      { status: 400 },
    );
  }
  if (!author) {
    return NextResponse.json(
      { error: "Sign your letter so she knows who it's from." },
      { status: 400 },
    );
  }

  const letter = await addLetter({
    author: author.slice(0, 80),
    body: text.slice(0, 20000),
    direction: body?.direction === "from-her" ? "from-her" : "to-her",
    recipient: String(body?.recipient ?? "").slice(0, 80),
  });

  return NextResponse.json({ letter }, { status: 201 });
}

/** Private: marks a letter opened once she breaks the seal. */
export async function PATCH(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;
  if (!sameOrigin(req)) {
    return NextResponse.json({ error: "Bad origin." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const id = String(body?.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await markLetterOpened(id);
  return NextResponse.json({ ok: true });
}

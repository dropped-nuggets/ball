import { NextResponse } from "next/server";
import { addLocket, deleteLocket, listLockets } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";
import { safeImageUrl } from "@/lib/safeUrl";

export const dynamic = "force-dynamic";

/** Private: only she sees what's been sent. */
export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;

  return NextResponse.json({ lockets: await listLockets() });
}

/**
 * Public — the whole point is that friends can send one without an account.
 *
 * Public writes that store bytes are the expensive kind, so this is the
 * tightest limit on the site (SEC-22). Friends without the passphrase send
 * downscaled data URLs rather than getting a Blob upload token, which caps
 * what an anonymous caller can cost.
 */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "locket"), 4, 60 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  const body = await req.json().catch(() => null);
  const url = safeImageUrl(body?.url);
  const sentBy = String(body?.sentBy ?? "").trim();

  if (!url) {
    return NextResponse.json(
      { error: "That doesn't look like a photo." },
      { status: 400 },
    );
  }
  if (!sentBy) {
    return NextResponse.json(
      { error: "Tell her who it's from." },
      { status: 400 },
    );
  }

  const locket = await addLocket({
    url,
    note: String(body?.note ?? "").trim().slice(0, 200),
    sentBy: sentBy.slice(0, 80),
  });

  return NextResponse.json({ locket }, { status: 201 });
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

  await deleteLocket(id);
  return NextResponse.json({ ok: true });
}

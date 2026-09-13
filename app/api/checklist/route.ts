import { NextResponse } from "next/server";
import {
  addChecklistItem,
  deleteChecklistItem,
  listChecklist,
  setChecklistDone,
} from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import { clientKey, rateLimit, tooManyRequests } from "@/lib/rateLimit";
import type { ListName } from "@/lib/types";

export const dynamic = "force-dynamic";

const LISTS: ListName[] = ["bingo", "ours", "hers"];

const asList = (v: unknown): ListName | null =>
  LISTS.includes(v as ListName) ? (v as ListName) : null;

export async function GET(req: Request) {
  const denied = await requireAuth();
  if (denied) return denied;

  const raw = new URL(req.url).searchParams.get("list");
  const list = raw ? asList(raw) : null;
  if (raw && !list) {
    return NextResponse.json({ error: "Unknown list." }, { status: 400 });
  }
  return NextResponse.json({ items: await listChecklist(list ?? undefined) });
}

/** Public: friends add to the "ours" list without a passphrase. */
export async function POST(req: Request) {
  const limit = rateLimit(clientKey(req, "checklist"), 15, 10 * 60 * 1000);
  if (!limit.ok) return tooManyRequests(limit.retryAfterSeconds);

  const body = await req.json().catch(() => null);
  const list = asList(body?.list);
  const text = String(body?.text ?? "").trim();

  if (!list) {
    return NextResponse.json({ error: "Unknown list." }, { status: 400 });
  }
  if (list === "bingo") {
    return NextResponse.json(
      { error: "The bingo card is fixed." },
      { status: 400 },
    );
  }
  if (!text) {
    return NextResponse.json({ error: "Write something." }, { status: 400 });
  }

  const item = await addChecklistItem({
    list,
    text: text.slice(0, 300),
    addedBy: String(body?.addedBy ?? "").trim().slice(0, 80),
  });

  return NextResponse.json({ item }, { status: 201 });
}

/** Private: ticking things off is hers. Creates a bingo row on first tick. */
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

  const list = asList(body?.list);
  const text = String(body?.text ?? "").slice(0, 300);

  await setChecklistDone(
    id,
    Boolean(body?.done),
    list ? { list, text } : undefined,
  );

  return NextResponse.json({ ok: true });
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
  await deleteChecklistItem(id);
  return NextResponse.json({ ok: true });
}

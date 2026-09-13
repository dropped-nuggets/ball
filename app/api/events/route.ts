import { NextResponse } from "next/server";
import { addEvent, deleteEvent, listEvents } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

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

  return NextResponse.json({ events: await listEvents() });
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const date = String(body?.date ?? "");
  const title = String(body?.title ?? "").trim();

  if (!ISO_DATE.test(date)) {
    return NextResponse.json(
      { error: "Pick a date." },
      { status: 400 },
    );
  }
  if (!title) {
    return NextResponse.json(
      { error: "What's happening that day?" },
      { status: 400 },
    );
  }

  const event = await addEvent({
    date,
    title: title.slice(0, 160),
    note: String(body?.note ?? "").trim().slice(0, 500),
    addedBy: String(body?.addedBy ?? "").trim().slice(0, 80),
  });

  return NextResponse.json({ event }, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await deleteEvent(id);
  return NextResponse.json({ ok: true });
}

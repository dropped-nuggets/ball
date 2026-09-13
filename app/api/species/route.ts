import { NextResponse } from "next/server";
import { addSpecies, deleteSpecies, listSpecies } from "@/lib/store";
import { requireAuth, sameOrigin } from "@/lib/auth";
import { safeImageUrl } from "@/lib/safeUrl";
import { SEALS } from "@/lib/types";

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

  return NextResponse.json({ species: await listSpecies() });
}

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const body = await req.json().catch(() => null);
  const name = String(body?.name ?? "").trim();

  if (!name) {
    return NextResponse.json(
      { error: "It needs a name." },
      { status: 400 },
    );
  }

  const tidbits = Array.isArray(body?.tidbits)
    ? body.tidbits
        .map((t: unknown) => String(t).trim().slice(0, 500))
        .filter(Boolean)
        .slice(0, 12)
    : [];

  const seal = SEALS.includes(body?.seal) ? String(body.seal) : "moss";

  const species = await addSpecies({
    name: name.slice(0, 120),
    local: String(body?.local ?? "").trim().slice(0, 120),
    latin: String(body?.latin ?? "").trim().slice(0, 120),
    kind: body?.kind === "flora" ? "flora" : "fauna",
    fact: String(body?.fact ?? "").trim().slice(0, 600),
    tidbits,
    status: String(body?.status ?? "").trim().slice(0, 80),
    where: String(body?.where ?? "").trim().slice(0, 160),
    photoUrl: safeImageUrl(body?.photoUrl) ?? "",
    seal,
    addedBy: String(body?.addedBy ?? "").trim().slice(0, 80),
  });

  return NextResponse.json({ species }, { status: 201 });
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id is required." }, { status: 400 });
  }

  await deleteSpecies(id);
  return NextResponse.json({ ok: true });
}

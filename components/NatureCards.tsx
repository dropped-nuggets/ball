"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Panel } from "./Frame";
import NatureArt from "./NatureArt";
import { SPECIES } from "@/lib/nature";
import { SEALS } from "@/lib/types";
import { resizeToDataUrl } from "@/lib/resizeImage";
import type { CustomSpecies } from "@/lib/store";

type Card = {
  id: string;
  name: string;
  local: string;
  latin: string;
  kind: "fauna" | "flora";
  fact: string;
  seal: string;
  photoUrl?: string;
  custom: boolean;
};

export default function NatureCards({
  initialCustom,
}: {
  initialCustom: CustomSpecies[];
}) {
  const [custom, setCustom] = useState(initialCustom);
  const [filter, setFilter] = useState<"all" | "fauna" | "flora">("all");
  const [adding, setAdding] = useState(false);

  const cards: Card[] = [
    ...SPECIES.map((s) => ({ ...s, custom: false })),
    ...custom.map((s) => ({
      id: s.id,
      name: s.name,
      local: s.local,
      latin: s.latin,
      kind: s.kind,
      fact: s.fact,
      seal: s.seal,
      photoUrl: s.photoUrl,
      custom: true,
    })),
  ];

  const shown = cards.filter((c) => filter === "all" || c.kind === filter);

  return (
    <div>
      <div className="mb-5 flex flex-wrap justify-center gap-2">
        {(["all", "fauna", "flora"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-1.5 text-xs capitalize transition-colors ${
              filter === f
                ? "border-lilac bg-violet/25 text-lilac"
                : "border-gilt/25 text-blossom/60 hover:border-gilt/60"
            }`}
          >
            {f === "all" ? "everything" : f}
          </button>
        ))}
        <button
          onClick={() => setAdding((a) => !a)}
          className="rounded-full border border-moss/50 px-4 py-1.5 text-xs text-moss transition-colors hover:border-moss"
        >
          {adding ? "never mind" : "＋ add your own"}
        </button>
      </div>

      {adding && (
        <AddSpecies
          onAdded={(s) => {
            setCustom((prev) => [s, ...prev]);
            setAdding(false);
          }}
        />
      )}

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((c) => (
          <li key={c.id}>
            <Link href={`/play/species/${c.id}`} className="block h-full">
              <Panel
                dark
                struts
                className="h-full overflow-hidden p-4 pt-6 transition-transform duration-200 hover:-translate-y-1"
              >
                <div
                  className="newari-brick absolute inset-0 opacity-40"
                  aria-hidden
                />

                <div className="relative flex flex-col items-center text-center">
                  <div
                    className="anim-bob grid h-20 w-20 place-items-center overflow-hidden rounded-full"
                    style={{
                      background: `color-mix(in srgb, var(--color-seal-${c.seal}) 16%, transparent)`,
                      border: `1px solid color-mix(in srgb, var(--color-seal-${c.seal}) 55%, transparent)`,
                    }}
                  >
                    {c.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <NatureArt id={c.id} size={62} />
                    )}
                  </div>

                  <p className="mt-3 font-display text-lg leading-tight text-blossom">
                    {c.name}
                  </p>
                  {c.local && (
                    <p className="text-[11px] text-moss/80">{c.local}</p>
                  )}
                  {c.latin && (
                    <p className="mt-0.5 text-[10px] italic text-lilac/35">
                      {c.latin}
                    </p>
                  )}

                  <p className="mt-3 text-[11px] tracking-[0.14em] text-lilac/40">
                    READ MORE →
                  </p>
                </div>
              </Panel>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddSpecies({ onAdded }: { onAdded: (s: CustomSpecies) => void }) {
  const [form, setForm] = useState({
    name: "",
    local: "",
    latin: "",
    kind: "fauna" as "fauna" | "flora",
    fact: "",
    status: "",
    where: "",
    seal: "moss",
    addedBy: "",
  });
  const [tidbits, setTidbits] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhotoUrl(await resizeToDataUrl(file, 700, 0.75));
    } catch {
      setError("Couldn't read that image.");
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("It needs a name.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/species", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          photoUrl,
          // One tidbit per line.
          tidbits: tidbits.split("\n").map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add.");
      onAdded(data.species);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Panel className="anim-rise mb-6 p-5 sm:p-6">
      <h3 className="font-display text-xl text-ink">Add a species</h3>
      <p className="mt-1 text-sm text-ink/60">
        Something you saw, or something you just like. It gets its own page.
      </p>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={form.name}
            onChange={set("name")}
            placeholder="Name *"
            maxLength={120}
            className="field w-full px-3 py-2.5 text-sm"
          />
          <input
            value={form.local}
            onChange={set("local")}
            placeholder="Nepali / Newari name"
            maxLength={120}
            className="field w-full px-3 py-2.5 text-sm"
          />
          <input
            value={form.latin}
            onChange={set("latin")}
            placeholder="Latin name"
            maxLength={120}
            className="field w-full px-3 py-2.5 text-sm"
          />
          <select
            value={form.kind}
            onChange={set("kind")}
            className="field w-full px-3 py-2.5 text-sm"
          >
            <option value="fauna">Fauna</option>
            <option value="flora">Flora</option>
          </select>
          <input
            value={form.status}
            onChange={set("status")}
            placeholder="Status (e.g. Endangered)"
            maxLength={80}
            className="field w-full px-3 py-2.5 text-sm"
          />
          <input
            value={form.where}
            onChange={set("where")}
            placeholder="Where it lives"
            maxLength={160}
            className="field w-full px-3 py-2.5 text-sm"
          />
        </div>

        <textarea
          value={form.fact}
          onChange={set("fact")}
          placeholder="The one-liner for the card"
          rows={2}
          maxLength={600}
          className="field w-full resize-y px-3 py-2.5 text-sm"
        />

        <textarea
          value={tidbits}
          onChange={(e) => setTidbits(e.target.value)}
          placeholder={"Tidbits for its page — one per line"}
          rows={4}
          className="field w-full resize-y px-3 py-2.5 text-sm"
        />

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-ink/60">Colour</span>
          {SEALS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setForm((f) => ({ ...f, seal: s }))}
              aria-label={s}
              className={`h-6 w-6 rounded-full border-2 transition-transform ${
                form.seal === s ? "scale-110 border-ink" : "border-transparent"
              }`}
              style={{ background: `var(--color-seal-${s})` }}
            />
          ))}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onPhoto}
          className="field w-full px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-violet/20 file:px-3 file:py-1.5 file:text-sm file:text-ink"
        />
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            className="h-24 w-24 rounded-full object-cover"
          />
        )}

        <input
          value={form.addedBy}
          onChange={set("addedBy")}
          placeholder="your name"
          maxLength={80}
          className="field w-full px-3 py-2.5 text-sm"
        />

        {error && <p className="text-sm text-seal-brick">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="btn-violet w-full py-2.5 text-sm"
        >
          {busy ? "Adding..." : "Add it"}
        </button>
      </form>
    </Panel>
  );
}

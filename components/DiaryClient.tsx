"use client";

import { useState } from "react";
import { Panel } from "./Frame";
import Scrapbook from "./Scrapbook";
import type { DiaryEntry, Photo } from "@/lib/types";

/** Moods double as the entry's accent colour. */
const MOODS = [
  { key: "soft", label: "soft day", seal: "rose" },
  { key: "homesick", label: "homesick", seal: "plum" },
  { key: "good", label: "actually good", seal: "moss" },
  { key: "tired", label: "so tired", seal: "dusk" },
  { key: "3am", label: "3am thoughts", seal: "sky" },
  { key: "grey", label: "grey", seal: "brick" },
] as const;

const sealOf = (mood: string) =>
  MOODS.find((m) => m.key === mood)?.seal ?? "dusk";

export default function DiaryClient({
  initialEntries,
  albumPhotos,
  blobEnabled,
}: {
  initialEntries: DiaryEntry[];
  albumPhotos: Photo[];
  blobEnabled: boolean;
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<string>("soft");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("An entry needs some words.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/diary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, mood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not save.");

      setEntries((prev) => [data.entry, ...prev]);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    await fetch(`/api/diary?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="space-y-8">
      <Panel className="p-6">
        <h3 className="font-display text-xl text-ink">Write it down</h3>
        <p className="mt-1 text-sm text-ink/60">
          It doesn't have to be good. It has to exist.
        </p>

        <form onSubmit={onSubmit} className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
            maxLength={160}
            className="field w-full px-3 py-2.5 text-sm"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Today was..."
            rows={7}
            maxLength={20000}
            className="field w-full resize-y px-3 py-2.5 text-sm leading-relaxed"
          />

          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMood(m.key)}
                className="rounded-full border px-3 py-1.5 text-xs transition-all"
                style={{
                  borderColor:
                    mood === m.key
                      ? `var(--color-seal-${m.seal})`
                      : "rgba(180,147,90,0.4)",
                  background:
                    mood === m.key
                      ? `color-mix(in srgb, var(--color-seal-${m.seal}) 22%, transparent)`
                      : "transparent",
                  color: "var(--color-ink)",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {error && <p className="text-sm text-seal-brick">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="btn-violet px-6 py-2.5 text-sm"
          >
            {busy ? "Saving..." : "Save entry"}
          </button>
        </form>
      </Panel>

      {entries.length === 0 ? (
        <p className="py-10 text-center text-sm text-blossom/45">
          Nothing written yet. The first one is always the hardest.
        </p>
      ) : (
        <ul className="space-y-4">
          {entries.map((entry) => {
            const open = openId === entry.id;
            const seal = sealOf(entry.mood);
            return (
              <li key={entry.id}>
                <Panel dark className="overflow-hidden">
                  <button
                    onClick={() => setOpenId(open ? null : entry.id)}
                    className="flex w-full items-start gap-4 p-5 text-left"
                    aria-expanded={open}
                  >
                    <span
                      aria-hidden
                      className="mt-1 h-3 w-3 shrink-0 rotate-45 rounded-[3px]"
                      style={{
                        background: `var(--color-seal-${seal})`,
                        boxShadow: `0 0 12px -2px var(--color-seal-${seal})`,
                      }}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg text-blossom">
                        {entry.title || "Untitled"}
                      </span>
                      <span className="mt-0.5 block text-xs tracking-wide text-lilac/50">
                        {new Date(entry.createdAt).toLocaleDateString(
                          undefined,
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                        {entry.mood ? ` · ${entry.mood}` : ""}
                      </span>
                      {!open && (
                        <span className="mt-2 block truncate text-sm text-blossom/55">
                          {entry.body}
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-lilac/40">
                      {open ? "−" : "+"}
                    </span>
                  </button>

                  {open && (
                    <div className="px-5 pb-5">
                      <div className="gilt-rule mb-4" />
                      <p className="letter-body text-blossom/85">
                        {entry.body}
                      </p>

                      <Scrapbook
                        entryId={entry.id}
                        initial={entry.stickers ?? []}
                        albumPhotos={albumPhotos}
                        blobEnabled={blobEnabled}
                      />

                      <button
                        onClick={() => onDelete(entry.id)}
                        className="mt-4 text-xs text-seal-brick/70 transition-colors hover:text-seal-brick"
                      >
                        delete this entry
                      </button>
                    </div>
                  )}
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

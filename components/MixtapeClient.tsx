"use client";

import { useState } from "react";
import { Panel } from "./Frame";
import { sealFor } from "@/lib/types";
import type { Song } from "@/lib/types";

export default function MixtapeClient({
  initialSongs,
}: {
  initialSongs: Song[];
}) {
  const [songs, setSongs] = useState(initialSongs);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    artist: "",
    note: "",
    addedBy: "",
    url: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not add.");

      setSongs((prev) => [data.song, ...prev]);
      setForm({ title: "", artist: "", note: "", addedBy: form.addedBy, url: "" });
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    await fetch(`/api/songs?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    setSongs((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <button
          onClick={() => setOpen((o) => !o)}
          className="btn-violet px-6 py-2.5 text-sm"
        >
          {open ? "Never mind" : "＋ Add a song"}
        </button>
      </div>

      {open && (
        <Panel className="anim-rise p-6">
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.title}
                onChange={set("title")}
                placeholder="Song title"
                maxLength={160}
                className="field w-full px-3 py-2.5 text-sm"
              />
              <input
                value={form.artist}
                onChange={set("artist")}
                placeholder="Artist"
                maxLength={120}
                className="field w-full px-3 py-2.5 text-sm"
              />
            </div>
            <input
              value={form.url}
              onChange={set("url")}
              placeholder="Spotify / YouTube link (optional)"
              className="field w-full px-3 py-2.5 text-sm"
            />
            <textarea
              value={form.note}
              onChange={set("note")}
              placeholder="Why this one? Which line gets you?"
              rows={3}
              maxLength={500}
              className="field w-full resize-y px-3 py-2.5 text-sm"
            />
            <input
              value={form.addedBy}
              onChange={set("addedBy")}
              placeholder="Your name"
              maxLength={80}
              className="field w-full px-3 py-2.5 text-sm"
            />

            {error && <p className="text-sm text-seal-brick">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="btn-violet w-full py-2.5 text-sm"
            >
              {busy ? "Adding..." : "Add to the tape"}
            </button>
          </form>
        </Panel>
      )}

      {songs.length === 0 ? (
        <p className="py-12 text-center text-sm text-blossom/45">
          Empty tape. Somebody put Mitski on it before this gets awkward.
        </p>
      ) : (
        <ul className="space-y-3">
          {songs.map((song, i) => {
            const seal = sealFor(song.artist || song.title);
            return (
              <li key={song.id}>
                <Panel dark className="p-5">
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-display text-sm"
                      style={{
                        background: `color-mix(in srgb, var(--color-seal-${seal}) 25%, transparent)`,
                        border: `1px solid var(--color-seal-${seal})`,
                        color: `var(--color-seal-${seal})`,
                      }}
                    >
                      {String(songs.length - i).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2">
                        <p className="font-display text-lg text-blossom">
                          {song.title}
                        </p>
                        {song.artist && (
                          <p className="text-sm text-lilac/60">
                            — {song.artist}
                          </p>
                        )}
                      </div>

                      {song.note && (
                        <p className="mt-1.5 text-sm leading-relaxed text-blossom/60">
                          {song.note}
                        </p>
                      )}

                      <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-lilac/40">
                        <span>added by {song.addedBy || "someone"}</span>
                        {song.url && (
                          <a
                            href={song.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-moss/80 underline underline-offset-2 transition-colors hover:text-moss"
                          >
                            listen ↗
                          </a>
                        )}
                        <button
                          onClick={() => onDelete(song.id)}
                          className="text-seal-brick/60 transition-colors hover:text-seal-brick"
                        >
                          remove
                        </button>
                      </div>
                    </div>
                  </div>
                </Panel>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

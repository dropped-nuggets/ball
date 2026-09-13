"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { EmptyState, Panel } from "./Frame";
import { resizeToDataUrl } from "@/lib/resizeImage";
import type { Photo } from "@/lib/types";

export default function AlbumClient({
  initialPhotos,
  blobEnabled,
}: {
  initialPhotos: Photo[];
  blobEnabled: boolean;
}) {
  const [photos, setPhotos] = useState(initialPhotos);
  const [index, setIndex] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [caption, setCaption] = useState("");
  const [place, setPlace] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const count = photos.length;
  const current = photos[index];

  const go = useCallback(
    (delta: number) => {
      setIndex((i) => (count ? (i + delta + count) % count : 0));
    },
    [count],
  );

  // Arrow keys move through the carousel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Pick a photo first.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      let url: string;

      if (blobEnabled) {
        // Straight from the browser to Blob storage, bypassing the 4.5 MB
        // serverless request limit.
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/photos/upload",
        });
        url = blob.url;
      } else {
        url = await resizeToDataUrl(file);
      }

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption, place }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed.");

      setPhotos((prev) => [data.photo, ...prev]);
      setIndex(0);
      setCaption("");
      setPlace("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: string) {
    setBusy(true);
    try {
      await fetch(`/api/photos?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      setPhotos((prev) => {
        const next = prev.filter((p) => p.id !== id);
        setIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Carousel */}
      <Panel dark className="overflow-hidden p-4 sm:p-6">
        {count === 0 ? (
          <EmptyState title="No photos yet.">
            Start with the ugliest one on your camera roll. It sets the tone for
            the whole album.
          </EmptyState>
        ) : (
          <>
            <div className="relative overflow-hidden rounded-2xl bg-night/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={current.id}
                src={current.url}
                alt={current.caption || "A photo"}
                className="anim-rise mx-auto max-h-[60vh] w-auto object-contain"
              />

              {count > 1 && (
                <>
                  <button
                    onClick={() => go(-1)}
                    aria-label="Previous photo"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-gilt/60 bg-night/70 px-3 py-2 text-lilac backdrop-blur transition-colors hover:bg-violet/40"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => go(1)}
                    aria-label="Next photo"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-gilt/60 bg-night/70 px-3 py-2 text-lilac backdrop-blur transition-colors hover:bg-violet/40"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-display text-xl text-blossom">
                  {current.caption || "Untitled"}
                </p>
                <p className="mt-1 text-xs tracking-wide text-lilac/50">
                  {current.place ? `${current.place} · ` : ""}
                  {new Date(current.createdAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-blossom/40">
                  {index + 1} / {count}
                </span>
                <button
                  onClick={() => onDelete(current.id)}
                  disabled={busy}
                  className="text-xs text-seal-brick/80 transition-colors hover:text-seal-brick disabled:opacity-40"
                >
                  remove
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {count > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {photos.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setIndex(i)}
                    aria-label={`Go to photo ${i + 1}`}
                    className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition-all ${
                      i === index
                        ? "border-lilac ring-2 ring-violet/50"
                        : "border-gilt/25 opacity-60 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </Panel>

      {/* Upload */}
      <Panel className="p-6">
        <h3 className="font-display text-xl text-ink">Add a photo</h3>
        <p className="mt-1 text-sm text-ink/60">
          {blobEnabled
            ? "Up to 15 MB. Straight from your phone is fine."
            : "Saved on this machine only until the database is connected."}
        </p>

        <form onSubmit={onUpload} className="mt-4 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="field w-full px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-violet/20 file:px-3 file:py-1.5 file:text-sm file:text-ink"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption — be unserious"
              maxLength={300}
              className="field w-full px-3 py-2.5 text-sm"
            />
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder="Where? (Pimbahal, Patan, a Tesco...)"
              maxLength={120}
              className="field w-full px-3 py-2.5 text-sm"
            />
          </div>

          {error && <p className="text-sm text-seal-brick">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="btn-violet px-6 py-2.5 text-sm"
          >
            {busy ? "Adding..." : "Add to album"}
          </button>
        </form>
      </Panel>
    </div>
  );
}

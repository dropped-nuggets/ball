"use client";

import { useState } from "react";
import { Panel } from "./Frame";
import type { Locket } from "@/lib/types";

/**
 * The Locket: the most recent photo someone back home sent, front and centre,
 * with the rest behind it. No asking required — that's the point.
 */
export default function LocketPanel({
  initial,
}: {
  initial: Locket[];
}) {
  const [lockets, setLockets] = useState(initial);
  const [index, setIndex] = useState(0);

  const current = lockets[index];

  async function remove(id: string) {
    setLockets((prev) => {
      const next = prev.filter((l) => l.id !== id);
      setIndex((i) => Math.min(i, Math.max(0, next.length - 1)));
      return next;
    });
    await fetch(`/api/locket?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    }).catch(() => {
      // It's gone from view; a reload would bring it back if this failed.
    });
  }

  if (!current) {
    return (
      <Panel dark className="p-6 text-center">
        <p className="font-display text-xl text-gilt">The Locket</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-blossom/55">
          Nothing yet. Share your link and someone back home can send a photo
          straight here — no account, no asking.
        </p>
      </Panel>
    );
  }

  return (
    <Panel dark className="overflow-hidden p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="font-display text-lg text-gilt">The Locket</p>
        <p className="text-[11px] text-lilac/45">
          {index + 1} / {lockets.length}
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-night/50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current.id}
          src={current.url}
          alt={current.note || `From ${current.sentBy}`}
          className="anim-rise mx-auto max-h-80 w-full object-cover"
        />

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/95 to-transparent p-4 pt-10">
          {current.note && (
            <p className="letter-body text-[15px] leading-snug text-blossom">
              {current.note}
            </p>
          )}
          <p className="mt-1 text-[11px] tracking-wide text-lilac/70">
            {current.sentBy} ·{" "}
            {new Date(current.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
            })}
          </p>
        </div>

        {lockets.length > 1 && (
          <>
            <button
              onClick={() =>
                setIndex((i) => (i - 1 + lockets.length) % lockets.length)
              }
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-gilt/50 bg-night/60 px-2.5 py-1.5 text-lilac backdrop-blur"
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % lockets.length)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-gilt/50 bg-night/60 px-2.5 py-1.5 text-lilac backdrop-blur"
            >
              ›
            </button>
          </>
        )}
      </div>

      <button
        onClick={() => remove(current.id)}
        className="mt-2 text-[11px] text-seal-brick/60 transition-colors hover:text-seal-brick"
      >
        remove this one
      </button>
    </Panel>
  );
}

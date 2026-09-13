"use client";

import { useState } from "react";
import { Panel } from "./Frame";
import { sealFor } from "@/lib/types";
import type { Letter } from "@/lib/types";

export default function LettersClient({
  initialLetters,
  writeUrl,
}: {
  initialLetters: Letter[];
  writeUrl: string;
}) {
  const [letters, setLetters] = useState(initialLetters);
  const [active, setActive] = useState<Letter | null>(null);
  const [cracking, setCracking] = useState(false);
  const [copied, setCopied] = useState(false);

  async function openLetter(letter: Letter) {
    setActive(letter);

    if (!letter.opened) {
      // Play the seal breaking before the text appears.
      setCracking(true);
      setTimeout(() => setCracking(false), 800);

      setLetters((prev) =>
        prev.map((l) => (l.id === letter.id ? { ...l, opened: true } : l)),
      );
      fetch("/api/letters", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: letter.id }),
      }).catch(() => {
        // The letter is open on screen either way; it'll re-mark next time.
      });
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(writeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const unopened = letters.filter((l) => !l.opened).length;

  return (
    <div className="space-y-8">
      {/* Share link */}
      <Panel dark className="p-5">
        <p className="text-sm text-blossom/70">
          Send this link to anyone who wants to write to her — no account, no
          password, they just type and it lands here.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg border border-gilt/30 bg-night/50 px-3 py-2 text-xs text-lilac">
            {writeUrl}
          </code>
          <button onClick={copyLink} className="btn-violet px-4 py-2 text-xs">
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </Panel>

      {letters.length === 0 ? (
        <p className="py-12 text-center text-sm text-blossom/45">
          No letters yet. Send the link around — they'll come.
        </p>
      ) : (
        <>
          <p className="text-center text-xs tracking-[0.18em] text-lilac/50">
            {unopened > 0
              ? `${unopened} STILL SEALED`
              : `${letters.length} LETTER${letters.length === 1 ? "" : "S"}`}
          </p>

          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {letters.map((letter) => {
              const seal = sealFor(letter.author || letter.id);
              return (
                <li key={letter.id}>
                  <button
                    onClick={() => openLetter(letter)}
                    className="group w-full text-left"
                  >
                    <Panel
                      className={`h-full p-5 transition-transform duration-200 group-hover:-translate-y-1 ${
                        letter.opened ? "opacity-80" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-lg text-ink">
                            {letter.author || "Someone"}
                          </p>
                          <p className="mt-0.5 text-xs text-ink/50">
                            {new Date(letter.createdAt).toLocaleDateString(
                              undefined,
                              { day: "numeric", month: "short" },
                            )}
                          </p>
                        </div>

                        {/* Wax seal */}
                        <span
                          aria-hidden
                          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[10px] font-semibold text-white/90"
                          style={{
                            background: `var(--color-seal-${seal})`,
                            boxShadow: `0 0 14px -3px var(--color-seal-${seal})`,
                            opacity: letter.opened ? 0.35 : 1,
                          }}
                        >
                          {(letter.author || "?").slice(0, 1).toUpperCase()}
                        </span>
                      </div>

                      <p className="mt-3 text-sm text-ink/60">
                        {letter.opened
                          ? `${letter.body.slice(0, 70)}${letter.body.length > 70 ? "…" : ""}`
                          : "Sealed. Tap to open."}
                      </p>
                    </Panel>
                  </button>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Reading overlay */}
      {active && (
        <div
          className="fixed inset-0 z-40 grid place-items-center bg-night/85 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Letter from ${active.author}`}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Panel className="anim-rise relative p-7 sm:p-10">
              {cracking && (
                <span
                  aria-hidden
                  className="anim-seal-crack absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: `var(--color-seal-${sealFor(active.author || active.id)})`,
                  }}
                />
              )}

              <div className="text-center">
                <p className="text-[11px] tracking-[0.25em] text-ink/45">
                  A LETTER FROM
                </p>
                <p className="mt-1 font-display text-3xl text-ink">
                  {active.author || "Someone"}
                </p>
                <div className="gilt-rule mx-auto mt-4 w-32" />
              </div>

              <p className="letter-body mt-7 text-ink/90">{active.body}</p>

              <p className="mt-8 text-right text-xs text-ink/40">
                {new Date(active.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>

              <button
                onClick={() => setActive(null)}
                className="btn-violet mt-6 w-full py-2.5 text-sm"
              >
                Close
              </button>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}

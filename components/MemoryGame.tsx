"use client";

import { useEffect, useState } from "react";
import { Panel } from "./Frame";
import NatureArt from "./NatureArt";
import { SPECIES, speciesById } from "@/lib/nature";

type Card = { key: string; id: string };

/** Fisher-Yates, seeded by nothing — a fresh shuffle every round is the point. */
function shuffled(): Card[] {
  const deck: Card[] = SPECIES.flatMap((s) => [
    { key: `${s.id}-a`, id: s.id },
    { key: `${s.id}-b`, id: s.id },
  ]);
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  // Shuffled after mount — a server-rendered random order would not match.
  useEffect(() => {
    setDeck(shuffled());
    try {
      const raw = localStorage.getItem("rijuko:memory-best");
      if (raw) setBest(Number(raw));
    } catch {
      // No stored best; nothing to show.
    }
  }, []);

  // Resolve a pair once two cards are face up.
  useEffect(() => {
    if (flipped.length !== 2) return;

    const [a, b] = flipped;
    const cardA = deck.find((c) => c.key === a);
    const cardB = deck.find((c) => c.key === b);

    if (cardA && cardB && cardA.id === cardB.id) {
      setMatched((prev) => new Set(prev).add(cardA.id));
      setFlipped([]);
      return;
    }

    const t = setTimeout(() => setFlipped([]), 850);
    return () => clearTimeout(t);
  }, [flipped, deck]);

  const won = deck.length > 0 && matched.size === SPECIES.length;

  useEffect(() => {
    if (!won) return;
    setBest((prev) => {
      const next = prev === null ? moves : Math.min(prev, moves);
      try {
        localStorage.setItem("rijuko:memory-best", String(next));
      } catch {
        // Best score just won't persist.
      }
      return next;
    });
  }, [won, moves]);

  function flip(card: Card) {
    if (flipped.length === 2) return;
    if (flipped.includes(card.key)) return;
    if (matched.has(card.id)) return;

    setFlipped((prev) => [...prev, card.key]);
    if (flipped.length === 1) setMoves((m) => m + 1);
  }

  function reset() {
    setDeck(shuffled());
    setFlipped([]);
    setMatched(new Set());
    setMoves(0);
  }

  return (
    <Panel dark className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-xl text-gilt">Match the valley</h3>
          <p className="mt-0.5 text-[11px] text-lilac/45">
            Eight pairs. Find them all.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-lilac/50">
          <span>{moves} moves</span>
          {best !== null && <span className="text-moss/80">best {best}</span>}
          <button
            onClick={reset}
            className="rounded-full border border-gilt/30 px-3 py-1 transition-colors hover:border-gilt hover:text-lilac"
          >
            shuffle
          </button>
        </div>
      </div>

      {won && (
        <p className="anim-rise mb-4 text-center font-display text-2xl text-moss">
          All found — in {moves} moves ✦
        </p>
      )}

      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {deck.map((card) => {
          const isMatched = matched.has(card.id);
          const isUp = isMatched || flipped.includes(card.key);
          const s = speciesById(card.id);

          return (
            <button
              key={card.key}
              onClick={() => flip(card)}
              aria-label={isUp ? s?.name : "Face-down card"}
              className={`grid aspect-square place-items-center rounded-xl border transition-all duration-200 ${
                isUp
                  ? "border-transparent"
                  : "border-gilt/25 bg-plum-2 hover:border-gilt/60"
              } ${isMatched ? "opacity-60" : ""}`}
              style={
                isUp && s
                  ? {
                      background: `color-mix(in srgb, var(--color-seal-${s.seal}) 18%, transparent)`,
                      borderColor: `color-mix(in srgb, var(--color-seal-${s.seal}) 60%, transparent)`,
                    }
                  : undefined
              }
            >
              {isUp ? (
                <NatureArt id={card.id} size={54} />
              ) : (
                <span
                  aria-hidden
                  className="h-4 w-4 rotate-45 border border-gilt/40"
                />
              )}
            </button>
          );
        })}
      </div>
    </Panel>
  );
}

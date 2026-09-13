"use client";

import { useState } from "react";
import { SectionTitle } from "./Frame";
import Wordle from "./Wordle";
import MemoryGame from "./MemoryGame";
import NatureCards from "./NatureCards";
import GeoGame from "./GeoGame";
import type { CustomSpecies } from "@/lib/store";

const GAMES = [
  { key: "wordle", label: "Wordle", sub: "Five letters of home, daily." },
  {
    key: "geo",
    label: "Where in the Valley",
    sub: "Read the clue, drop a pin. Scored on real distance.",
  },
  { key: "memory", label: "Memory", sub: "Eight pairs from the valley." },
  {
    key: "nature",
    label: "Flora & Fauna",
    sub: "Things that live where you're from.",
  },
] as const;

type GameKey = (typeof GAMES)[number]["key"];

export default function PlayClient({
  customSpecies,
}: {
  customSpecies: CustomSpecies[];
}) {
  const [game, setGame] = useState<GameKey>("wordle");
  const active = GAMES.find((g) => g.key === game)!;

  return (
    <div>
      <SectionTitle sub={active.sub}>The Playroom</SectionTitle>

      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {GAMES.map((g) => (
          <button
            key={g.key}
            onClick={() => setGame(g.key)}
            className={`rounded-full border px-4 py-2 text-sm transition-all ${
              game === g.key
                ? "border-lilac bg-violet/25 text-lilac"
                : "border-gilt/25 text-blossom/60 hover:border-gilt/60 hover:text-lilac"
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Remounting on switch is deliberate: each game resets cleanly. */}
      {game === "wordle" && <Wordle />}
      {game === "geo" && <GeoGame />}
      {game === "memory" && <MemoryGame />}
      {game === "nature" && <NatureCards initialCustom={customSpecies} />}
    </div>
  );
}

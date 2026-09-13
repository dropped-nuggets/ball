"use client";

import { useRef, useState } from "react";
import { Panel } from "./Frame";
import {
  haversineKm,
  pickRounds,
  project,
  score,
  unproject,
  type Round,
} from "@/lib/geo";

/** Stylised Kathmandu Valley: the bowl, the rivers, the ring road. */
function ValleyMap() {
  return (
    <g>
      <ellipse cx="48" cy="52" rx="38" ry="30" fill="#2f2545" />
      <ellipse
        cx="48"
        cy="52"
        rx="38"
        ry="30"
        fill="none"
        stroke="#5d7d4a"
        strokeOpacity="0.5"
        strokeWidth="0.6"
      />
      {/* Hills around the rim */}
      {[
        [14, 40], [20, 26], [40, 18], [62, 19], [80, 30], [86, 50],
        [78, 74], [56, 84], [32, 80], [16, 66],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="5" fill="#3d5c33" opacity="0.55" />
      ))}
      {/* Bagmati + Bishnumati */}
      <path
        d="M44 20 Q 40 40 46 54 Q 52 70 50 86"
        stroke="#4a7fa8"
        strokeWidth="1.1"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M34 26 Q 38 42 46 54"
        stroke="#4a7fa8"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      />
      {/* Ring road */}
      <circle
        cx="42"
        cy="45"
        r="13"
        fill="none"
        stroke="#8a7a5a"
        strokeWidth="0.7"
        strokeDasharray="2 2"
        opacity="0.65"
      />
    </g>
  );
}

/** Simplified Nepal outline — recognisable, not survey-accurate. */
function NepalMap() {
  return (
    <g>
      <path
        d="M4 62 L 10 50 L 17 44 L 24 40 L 31 34 L 38 30 L 45 26 L 52 22
           L 60 18 L 68 14 L 76 12 L 86 10 L 94 14 L 96 22 L 92 30 L 86 36
           L 80 42 L 74 48 L 68 52 L 62 58 L 55 64 L 48 70 L 40 74 L 32 76
           L 24 76 L 16 72 L 9 68 Z"
        fill="#2f2545"
        stroke="#5d7d4a"
        strokeOpacity="0.6"
        strokeWidth="0.7"
      />
      {/* Himalaya along the north edge */}
      {[
        [30, 30], [42, 25], [54, 21], [66, 17], [78, 14],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x - 4} ${y + 5} L ${x} ${y - 3} L ${x + 4} ${y + 5} Z`}
          fill="#c9d4e2"
          opacity="0.5"
        />
      ))}
    </g>
  );
}

type Result = { distanceKm: number; points: number; guess: { lat: number; lon: number } };

export default function GeoGame() {
  const [rounds, setRounds] = useState<Round[]>([]);
  const [i, setI] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [total, setTotal] = useState(0);
  const [finished, setFinished] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const round = rounds[i];

  function start() {
    setRounds(pickRounds(5));
    setI(0);
    setResult(null);
    setTotal(0);
    setFinished(false);
  }

  function guessAt(e: React.MouseEvent<SVGSVGElement>) {
    if (!round || result) return;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Click position as a percentage of the map, then back to lat/lon.
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const guess = unproject(x, y, round.scope);

    const distanceKm = haversineKm(
      guess.lat,
      guess.lon,
      round.lat,
      round.lon,
    );
    const points = score(distanceKm, round.scope);

    setResult({ distanceKm, points, guess });
    setTotal((t) => t + points);
  }

  function next() {
    if (i + 1 >= rounds.length) {
      setFinished(true);
      return;
    }
    setI((n) => n + 1);
    setResult(null);
  }

  if (!round) {
    return (
      <Panel dark className="p-8 text-center">
        <h3 className="font-display text-2xl text-gilt">Where in the Valley</h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-blossom/60">
          Five rounds. Read the clue, drop a pin on the map, get scored on how
          close you actually were. Mostly Kathmandu, Lalitpur and Bhaktapur —
          with the occasional trip further out.
        </p>
        <button onClick={start} className="btn-violet mt-6 px-7 py-2.5 text-sm">
          Start
        </button>
      </Panel>
    );
  }

  if (finished) {
    const max = rounds.length * 5000;
    const pct = Math.round((total / max) * 100);
    return (
      <Panel dark className="p-8 text-center">
        <h3 className="font-display text-2xl text-gilt">
          {total.toLocaleString()} / {max.toLocaleString()}
        </h3>
        <p className="mt-2 text-sm text-blossom/60">
          {pct >= 80
            ? "You could still walk it blindfolded."
            : pct >= 50
              ? "Home is still in there somewhere."
              : "Riju. Come home and revise."}
        </p>
        <button onClick={start} className="btn-violet mt-6 px-7 py-2.5 text-sm">
          Again
        </button>
      </Panel>
    );
  }

  const truth = project(round.lon, round.lat, round.scope);
  const guessPt = result
    ? project(result.guess.lon, result.guess.lat, round.scope)
    : null;

  return (
    <Panel dark className="p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[11px] tracking-[0.16em] text-lilac/45">
          ROUND {i + 1} / {rounds.length}
          {round.scope === "nepal" && " · ALL NEPAL"}
        </p>
        <p className="text-[11px] text-moss/70">{total.toLocaleString()} pts</p>
      </div>

      <p className="mb-4 text-sm leading-relaxed text-blossom/85">
        {round.clue}
      </p>

      <svg
        ref={svgRef}
        viewBox="0 0 100 100"
        onClick={guessAt}
        className={`w-full rounded-xl border border-gilt/20 bg-night/40 ${
          result ? "" : "cursor-crosshair"
        }`}
        style={{ aspectRatio: "1 / 1", maxHeight: "58vh" }}
        role="img"
        aria-label="Map — click to place your guess"
      >
        {round.scope === "valley" ? <ValleyMap /> : <NepalMap />}

        {result && guessPt && (
          <>
            <line
              x1={guessPt.x}
              y1={guessPt.y}
              x2={truth.x}
              y2={truth.y}
              stroke="var(--color-lilac)"
              strokeWidth="0.6"
              strokeDasharray="1.5 1.5"
            />
            <circle
              cx={guessPt.x}
              cy={guessPt.y}
              r="2"
              fill="var(--color-lilac)"
            />
            <circle
              cx={truth.x}
              cy={truth.y}
              r="2.4"
              fill="var(--color-moss)"
            />
            <circle
              cx={truth.x}
              cy={truth.y}
              r="4.5"
              fill="none"
              stroke="var(--color-moss)"
              strokeWidth="0.5"
            />
          </>
        )}
      </svg>

      {result ? (
        <div className="mt-4 text-center">
          <p className="font-display text-2xl text-gilt">
            {result.points.toLocaleString()} pts
          </p>
          <p className="mt-1 text-sm text-blossom/70">
            {result.distanceKm < 1
              ? `${Math.round(result.distanceKm * 1000)} m from ${round.name}`
              : `${result.distanceKm.toFixed(1)} km from ${round.name}`}
          </p>
          {round.local && (
            <p className="text-[11px] text-moss/70">{round.local}</p>
          )}
          <button onClick={next} className="btn-violet mt-4 px-6 py-2 text-sm">
            {i + 1 >= rounds.length ? "See score" : "Next round"}
          </button>
        </div>
      ) : (
        <p className="mt-3 text-center text-[11px] text-lilac/40">
          Tap the map where you think it is
        </p>
      )}
    </Panel>
  );
}

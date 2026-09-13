"use client";

import { useEffect, useState } from "react";
import { Panel } from "./Frame";
import { Cloud, DurbarSquare, JungleCanopy, LondonSkyline, PLANE_PATH } from "./Scenery";

/**
 * The route, as a scene rather than a diagram: Patan on the left under its
 * temple roofs, London on the right under Big Ben, cloud drifting between
 * them, and the plane crossing on a long arc.
 *
 * The previous version drew a "globe" as an ellipse centred at cy=330 with
 * ry=230 inside a 170-tall viewBox — almost all of it off-canvas, so what
 * actually rendered was a stray curve cutting across the card.
 */

/**
 * The flight path. Both ends sit in open sky ABOVE the rooflines — anchored
 * down at the buildings, the city labels landed on top of the skyline and
 * became unreadable.
 */
const ARC = "M 74 104 Q 250 14 424 84";

/** Roughly Kathmandu -> London, in kilometres. */
const DISTANCE_KM = 7_280;

function useClock(timeZone: string) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const render = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
        }).format(new Date()),
      );

    render();
    const id = setInterval(render, 30_000);
    return () => clearInterval(id);
  }, [timeZone]);

  // Null until mounted — the server's clock and hers would not agree.
  return time;
}

export default function FlightPath() {
  const ktm = useClock("Asia/Kathmandu");
  const uk = useClock("Europe/London");

  return (
    <Panel dark className="relative overflow-hidden p-6 sm:p-7">
      <div className="ankhi-jhyal pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl text-gilt">
            {DISTANCE_KM.toLocaleString()} km, give or take
          </h3>
          <p className="text-[11px] tracking-[0.16em] text-lilac/45">KTM → UK</p>
        </div>

        {/* The scene. Fixed 500x190 stage: the cities are drawn as HTML layers
            so they can reuse the shared scenery, and the flight arc rides in an
            SVG on top so animateMotion keeps the plane locked to the path at
            any width. */}
        <div className="relative mt-4 aspect-[500/190] w-full overflow-hidden rounded-2xl border border-gilt/15 bg-gradient-to-b from-night/70 via-plum/50 to-plum-2/60">
          {/* Patan, left */}
          <div className="absolute bottom-0 left-0 h-[52%] w-[42%] opacity-90">
            <DurbarSquare className="h-full" />
          </div>
          <div className="absolute bottom-0 left-0 h-[22%] w-[40%] opacity-45">
            <JungleCanopy layer={2} className="h-full" />
          </div>

          {/* London, right */}
          <div className="absolute bottom-0 right-0 h-[50%] w-[42%] opacity-90">
            <LondonSkyline className="h-full" />
          </div>

          {/* Cloud drifting through the middle */}
          {[
            { top: "10%", w: 150, dur: 22, op: 0.08 },
            { top: "30%", w: 110, dur: 31, op: 0.06 },
          ].map((c) => (
            <div
              key={c.top}
              className="anim-cloud-drift absolute"
              style={{ top: c.top, animationDuration: `${c.dur}s` }}
            >
              <svg viewBox="0 0 200 80" width={c.w} height={(c.w * 80) / 200} aria-hidden>
                <Cloud x={100} y={40} w={190} opacity={c.op} />
              </svg>
            </div>
          ))}

          <svg
            viewBox="0 0 500 190"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full"
            role="img"
            aria-label="A plane flying from Pimbahal in Lalitpur to the United Kingdom"
          >
            <defs>
              <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-moss)" />
                <stop offset="50%" stopColor="var(--color-lilac)" />
                <stop offset="100%" stopColor="var(--color-seal-sky)" />
              </linearGradient>
            </defs>

            {/* Route: a solid ghost under a travelling dash, so the line itself
                reads as moving rather than just carrying a plane along it. */}
            <path d={ARC} fill="none" stroke="url(#arcGrad)" strokeWidth="1" opacity="0.25" />
            <path
              d={ARC}
              fill="none"
              stroke="url(#arcGrad)"
              strokeWidth="1.8"
              strokeDasharray="4 10"
              strokeLinecap="round"
              opacity="0.9"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="28"
                to="0"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </path>

            {/* Endpoints */}
            <g>
              <circle cx="74" cy="104" r="4" fill="var(--color-moss)" />
              <circle cx="74" cy="104" r="9" fill="none" stroke="var(--color-moss)" strokeOpacity="0.4">
                <animate attributeName="r" values="5;13;5" dur="3.2s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.55;0;0.55" dur="3.2s" repeatCount="indefinite" />
              </circle>
              <text x="74" y="90" textAnchor="middle" fontSize="11" fill="var(--color-moss)" opacity="0.95">
                Pimbahal
              </text>
            </g>

            <g>
              <circle cx="424" cy="84" r="4" fill="var(--color-seal-sky)" />
              <circle cx="424" cy="84" r="9" fill="none" stroke="var(--color-seal-sky)" strokeOpacity="0.4">
                <animate attributeName="r" values="5;13;5" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" values="0.55;0;0.55" dur="3.2s" begin="1.6s" repeatCount="indefinite" />
              </circle>
              <text x="424" y="70" textAnchor="middle" fontSize="11" fill="var(--color-seal-sky)" opacity="0.95">
                UK :(
              </text>
            </g>

            {/* Vapour trail, fading behind the plane */}
            <g opacity="0.5">
              <circle r="2.5" fill="var(--color-blossom)" opacity="0.35">
                <animateMotion dur="11s" repeatCount="indefinite" path={ARC} begin="-0.35s" />
                <animate attributeName="opacity" values="0.35;0" dur="11s" repeatCount="indefinite" />
              </circle>
              <circle r="1.8" fill="var(--color-blossom)" opacity="0.25">
                <animateMotion dur="11s" repeatCount="indefinite" path={ARC} begin="-0.7s" />
              </circle>
            </g>

            {/* The plane */}
            <g fill="var(--color-gilt)">
              <path d={PLANE_PATH} transform="scale(0.95)" />
              <animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path={ARC} />
            </g>
          </svg>
        </div>

        <div className="gilt-rule my-4" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-moss/70">KATHMANDU</p>
              <p className="font-display text-2xl text-blossom tabular-nums">
                {ktm ?? "--:--"}
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] text-seal-sky/70">UK</p>
              <p className="font-display text-2xl text-blossom tabular-nums">
                {uk ?? "--:--"}
              </p>
            </div>
          </div>

          <p className="max-w-[15rem] text-right text-xs leading-relaxed text-lilac/55">
            naurr not our diva to the colonizers 😭
          </p>
        </div>
      </div>
    </Panel>
  );
}

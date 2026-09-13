"use client";

import { useEffect, useState } from "react";
import { Panel } from "./Frame";

/** Great-circle-ish arc from Kathmandu to the UK, drawn across a stylised globe. */
const ARC = "M 78 128 Q 250 14 424 78";

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
      <div className="ankhi-jhyal pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-display text-xl text-gilt">
            {DISTANCE_KM.toLocaleString()} km, give or take
          </h3>
          <p className="text-[11px] tracking-[0.16em] text-lilac/45">
            KTM → UK
          </p>
        </div>

        <svg
          viewBox="0 0 500 170"
          className="mt-4 w-full"
          role="img"
          aria-label="A plane flying along an arc from Kathmandu to the United Kingdom"
        >
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-moss)" />
              <stop offset="50%" stopColor="var(--color-lilac)" />
              <stop offset="100%" stopColor="var(--color-seal-sky)" />
            </linearGradient>
            <radialGradient id="globeGrad" cx="50%" cy="35%">
              <stop offset="0%" stopColor="var(--color-violet)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--color-plum)" stopOpacity="0.1" />
            </radialGradient>
          </defs>

          {/* Globe curvature */}
          <ellipse
            cx="250"
            cy="330"
            rx="330"
            ry="230"
            fill="url(#globeGrad)"
            stroke="var(--color-lilac)"
            strokeOpacity="0.25"
            strokeWidth="1"
          />
          {/* Latitude lines */}
          {[250, 290, 340].map((cy, i) => (
            <ellipse
              key={cy}
              cx="250"
              cy={cy + 60}
              rx={330 - i * 18}
              ry={230 - i * 26}
              fill="none"
              stroke="var(--color-lilac)"
              strokeOpacity="0.1"
              strokeWidth="0.7"
            />
          ))}

          {/* The route */}
          <path
            d={ARC}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="1.6"
            strokeDasharray="5 6"
            strokeLinecap="round"
            opacity="0.85"
          />

          {/* Kathmandu */}
          <g>
            <circle cx="78" cy="128" r="5" fill="var(--color-moss)" />
            <circle
              cx="78"
              cy="128"
              r="10"
              fill="none"
              stroke="var(--color-moss)"
              strokeOpacity="0.45"
            />
            <text
              x="78"
              y="152"
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-moss)"
              opacity="0.9"
            >
              Pimbahal
            </text>
          </g>

          {/* UK */}
          <g>
            <circle cx="424" cy="78" r="5" fill="var(--color-seal-sky)" />
            <circle
              cx="424"
              cy="78"
              r="10"
              fill="none"
              stroke="var(--color-seal-sky)"
              strokeOpacity="0.45"
            />
            <text
              x="424"
              y="58"
              textAnchor="middle"
              fontSize="11"
              fill="var(--color-seal-sky)"
              opacity="0.9"
            >
              UK :(
            </text>
          </g>

          {/* The plane. animateMotion keeps it locked to the path at any width. */}
          <g fill="var(--color-gilt)">
            <path
              d="M 0,-1.4 L 9,-1.4 L 12,0 L 9,1.4 L 0,1.4 L -4,5.5 L -6.5,5.5 L -4.6,1.4 L -8.5,1.4 L -10.5,3.6 L -12,3.6 L -11,0 L -12,-3.6 L -10.5,-3.6 L -8.5,-1.4 L -4.6,-1.4 L -6.5,-5.5 L -4,-5.5 Z"
              transform="scale(0.95)"
            />
            <animateMotion
              dur="9s"
              repeatCount="indefinite"
              rotate="auto"
              path={ARC}
            />
          </g>
        </svg>

        <div className="gilt-rule my-4" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] tracking-[0.18em] text-moss/70">
                KATHMANDU
              </p>
              <p className="font-display text-2xl text-blossom tabular-nums">
                {ktm ?? "--:--"}
              </p>
            </div>
            <div>
              <p className="text-[10px] tracking-[0.18em] text-seal-sky/70">
                UK
              </p>
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

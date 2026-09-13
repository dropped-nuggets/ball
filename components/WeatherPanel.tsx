"use client";

import { useEffect, useState } from "react";
import { Panel } from "./Frame";

export type WeatherView = {
  key: string;
  label: string;
  sub: string;
  timeZone: string;
  tempC: number | null;
  sky: string;
  isDay: boolean;
};

/** Small weather scenes, drawn rather than icon-fonted. */
function SkyArt({ sky, isDay }: { sky: string; isDay: boolean }) {
  const sun = isDay ? "#f0c24f" : "#dfe7f5";

  return (
    <svg viewBox="0 0 64 48" className="h-14 w-20" aria-hidden>
      {/* Sun or moon */}
      {(sky === "clear" || sky === "some cloud") && (
        <>
          {isDay ? (
            <>
              <circle cx="24" cy="20" r="9" fill={sun} />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
                <rect
                  key={a}
                  x="23.2"
                  y="4"
                  width="1.6"
                  height="4.5"
                  rx="0.8"
                  fill={sun}
                  opacity="0.8"
                  transform={`rotate(${a} 24 20)`}
                />
              ))}
            </>
          ) : (
            <path
              d="M30 20 a 9 9 0 1 1 -9 -9 a 7 7 0 0 0 9 9 Z"
              fill={sun}
            />
          )}
        </>
      )}

      {/* Cloud */}
      {sky !== "clear" && (
        <g
          fill={
            sky === "grey" || sky === "rain" || sky === "storm"
              ? "#7d8598"
              : "#b9c2d4"
          }
        >
          <ellipse cx="30" cy="28" rx="12" ry="8" />
          <ellipse cx="40" cy="29" rx="9" ry="7" />
          <ellipse cx="22" cy="30" rx="8" ry="6" />
        </g>
      )}

      {/* Rain */}
      {sky === "rain" &&
        [22, 30, 38].map((x, i) => (
          <line
            key={x}
            x1={x}
            y1="37"
            x2={x - 2}
            y2={43}
            stroke="#6fb8d9"
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.85 - i * 0.1}
          />
        ))}

      {/* Snow */}
      {sky === "snow" &&
        [22, 31, 40].map((x) => (
          <circle key={x} cx={x} cy="40" r="2" fill="#dfe7f5" />
        ))}

      {/* Storm */}
      {sky === "storm" && (
        <path d="M32 36 l -5 8 h 4 l -3 6 l 9 -9 h -4 l 3 -5 Z" fill="#f0c24f" />
      )}

      {/* Fog */}
      {sky === "fog" &&
        [36, 40, 44].map((y, i) => (
          <rect
            key={y}
            x={14 + i * 2}
            y={y}
            width={34 - i * 4}
            height="2"
            rx="1"
            fill="#b9c2d4"
            opacity="0.6"
          />
        ))}
    </svg>
  );
}

function Clock({ timeZone }: { timeZone: string }) {
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
    const id = setInterval(render, 20_000);
    return () => clearInterval(id);
  }, [timeZone]);

  // Null until mounted: the server's clock is not hers.
  return (
    <span className="font-display text-3xl tabular-nums text-blossom sm:text-4xl">
      {time ?? "--:--"}
    </span>
  );
}

export default function WeatherPanel({ places }: { places: WeatherView[] }) {
  return (
    <Panel dark className="relative overflow-hidden p-5 sm:p-6">
      <div className="ankhi-jhyal pointer-events-none absolute inset-0 opacity-50" />

      <div className="relative grid gap-4 sm:grid-cols-2">
        {places.map((p, i) => (
          <div
            key={p.key}
            className={
              i === 0
                ? "sm:border-r sm:border-gilt/15 sm:pr-4"
                : "border-t border-gilt/15 pt-4 sm:border-t-0 sm:pt-0 sm:pl-2"
            }
          >
            <p className="text-[10px] tracking-[0.2em] text-lilac/45">
              {p.label.toUpperCase()}
            </p>
            <p className="text-[11px] text-moss/70">{p.sub}</p>

            <div className="mt-2 flex items-center justify-between gap-2">
              <div>
                <Clock timeZone={p.timeZone} />
                <p className="mt-0.5 text-xs text-blossom/55">
                  {p.tempC === null
                    ? "weather unavailable"
                    : `${Math.round(p.tempC)}°C · ${p.sky}`}
                </p>
              </div>
              <SkyArt sky={p.sky} isDay={p.isDay} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

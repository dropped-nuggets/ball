"use client";

import { Cloud, DurbarSquare, JungleCanopy, LondonSkyline, Plane } from "./Scenery";
import { Leaves, Stars } from "./Motes";

/**
 * The three shots of the post-login sequence, each a full-bleed scene.
 *
 * Split out of the gate itself so the gate only has to own timing and the
 * skip/replay rules, and so each shot can be reasoned about as a picture.
 *
 * Scene components take no props beyond the caption they show: everything
 * moves on CSS animations that start when the element mounts, which is what
 * makes the cut land — the gate swaps which scene is mounted, and the new one
 * begins its motion from frame zero.
 */

/**
 * Darkens the foot of a scene so the caption stays legible over whatever
 * happens to be behind it — a palace wall, a skyline, a bright cloud.
 */
function Scrim() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38%] bg-gradient-to-t from-night/80 via-night/40 to-transparent"
    />
  );
}

function Caption({
  script,
  title,
  sub,
  delay = 0,
}: {
  /** Devanagari line, set above the roman one. */
  script?: string;
  title: string;
  sub?: string;
  delay?: number;
}) {
  return (
    <div
      className="anim-caption absolute inset-x-0 bottom-[14%] z-20 px-6 text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      {script && (
        <p className="mb-2 text-[11px] tracking-[0.3em] text-moss/80">{script}</p>
      )}
      <h2 className="font-display text-3xl tracking-[0.22em] text-gilt sm:text-5xl">
        {title}
      </h2>
      {sub && (
        <p className="mt-2 text-[10px] tracking-[0.22em] text-blossom/55 sm:text-xs">
          {sub}
        </p>
      )}
    </div>
  );
}

/** Shot 1 — Patan Durbar Square at dawn, and the plane leaving it. */
export function ScenePatan() {
  return (
    <div className="sky-patan anim-scene-in absolute inset-0 overflow-hidden">
      <Stars count={26} />

      {/* Hills far behind the square */}
      <div className="anim-pan-slow absolute inset-x-[-10%] bottom-[38%] h-[34%] opacity-60">
        <JungleCanopy layer={0} className="h-full" />
      </div>

      {/* The square itself. "meet" keeps the whole skyline in frame — filling
          the width crops it to a couple of giant unreadable roof fragments. */}
      <div className="anim-pan-slow absolute inset-x-0 bottom-[22%] h-[46%]">
        <DurbarSquare fit="meet" className="h-full" />
      </div>

      {/* Canopy closing in over the foreground */}
      <div className="anim-canopy absolute inset-x-0 bottom-0 h-[40%]">
        <JungleCanopy layer={1} className="h-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[30%]">
        <JungleCanopy layer={2} className="h-full" />
      </div>

      <Scrim />
      <Leaves count={12} />

      {/* Take-off */}
      <div className="anim-plane-climb absolute left-[12%] top-[46%] z-10">
        <Plane size={52} />
      </div>

      <Caption
        script="पिम्बहाल"
        title="Pimbahal"
        sub="LALITPUR · 27.67°N"
        delay={250}
      />
    </div>
  );
}

/** Shot 2 — cruising altitude, cloud streaming past. */
export function SceneClouds() {
  // Staggered lanes so the cloud field never pulses in lockstep.
  const lanes = [
    { top: "14%", w: 220, dur: 7, delay: 0, op: 0.16 },
    { top: "30%", w: 340, dur: 9, delay: -3, op: 0.22 },
    { top: "52%", w: 280, dur: 6.2, delay: -1.4, op: 0.3 },
    { top: "68%", w: 420, dur: 8, delay: -5, op: 0.2 },
    { top: "82%", w: 300, dur: 5.4, delay: -2.2, op: 0.34 },
  ];

  return (
    <div className="sky-cloud anim-scene-in absolute inset-0 overflow-hidden">
      <Stars count={34} />

      {lanes.map((l, i) => (
        <div
          key={i}
          className="anim-cloud-drift absolute"
          style={{
            top: l.top,
            animationDuration: `${l.dur}s`,
            animationDelay: `${l.delay}s`,
          }}
        >
          <svg viewBox="0 0 200 80" width={l.w} height={(l.w * 80) / 200} aria-hidden>
            <Cloud x={100} y={40} w={190} opacity={l.op} />
          </svg>
        </div>
      ))}

      {/* Plane held near centre — the camera flies with her, not past her. */}
      <div className="anim-plane-cruise absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
        <Plane size={64} />
      </div>

      <Scrim />
      <Caption title="7,280 km" sub="SOMEWHERE OVER EVERYTHING" delay={200} />
    </div>
  );
}

/** Shot 3 — the descent into London. */
export function SceneLondon() {
  return (
    <div className="sky-london anim-scene-in absolute inset-0 overflow-hidden">
      <Stars count={30} />

      {/* Cloud breaking up as she drops through it */}
      {[
        { top: "18%", w: 300, dur: 6, op: 0.14 },
        { top: "36%", w: 240, dur: 7.5, op: 0.1 },
      ].map((l, i) => (
        <div
          key={i}
          className="anim-cloud-drift absolute"
          style={{ top: l.top, animationDuration: `${l.dur}s` }}
        >
          <svg viewBox="0 0 200 80" width={l.w} height={(l.w * 80) / 200} aria-hidden>
            <Cloud x={100} y={40} w={190} opacity={l.op} />
          </svg>
        </div>
      ))}

      {/* The city coming up to meet her */}
      <div
        className="anim-skyline-rise absolute inset-x-[-4%] bottom-0 h-[52%]"
        style={{ animationDelay: "300ms" }}
      >
        <LondonSkyline fit="meet" className="h-full" />
      </div>

      {/* Rain over the Thames, because of course */}
      {Array.from({ length: 18 }, (_, i) => (
        <span
          key={i}
          aria-hidden
          className="anim-float absolute h-6 w-px bg-seal-sky/25"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${20 + ((i * 23) % 50)}%`,
            animationDuration: `${2 + (i % 4) * 0.4}s`,
            animationDelay: `${(i % 6) * 0.35}s`,
          }}
        />
      ))}

      <div className="anim-plane-descend absolute left-1/2 top-[34%] z-10">
        <Plane size={52} />
      </div>

      <Scrim />
      <Caption title="London" sub="AND STILL ON THE SAME MAP AS US" delay={900} />
    </div>
  );
}


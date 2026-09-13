/**
 * Ambient background layers.
 *
 * Positions come from index arithmetic rather than Math.random() so the server
 * and client render identical markup — random values here cause hydration
 * mismatches.
 */

/** Drifting pollen and light motes. */
export default function Motes({ count = 26 }: { count?: number }) {
  const motes = Array.from({ length: count }, (_, i) => {
    const tint =
      i % 4 === 0
        ? "var(--color-fern)"
        : i % 3 === 0
          ? "var(--color-gilt)"
          : "var(--color-lilac)";
    return {
      left: ((i * 37) % 100) + ((i % 3) - 1) * 0.7,
      top: 100 - ((i * 13) % 60),
      delay: (i * 0.41) % 6,
      duration: 5 + ((i * 1.7) % 5),
      size: 2 + ((i * 3) % 4),
      tint,
    };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {motes.map((m, i) => (
        <span
          key={i}
          className="anim-float absolute rounded-full"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            background: m.tint,
            boxShadow: `0 0 ${m.size * 3}px ${m.tint}`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  );
}

/** Falling leaves — for the environmental science student. */
export function Leaves({ count = 10 }: { count?: number }) {
  const leaves = Array.from({ length: count }, (_, i) => ({
    left: (i * 53) % 96,
    delay: (i * 1.3) % 11,
    duration: 9 + ((i * 2.1) % 7),
    size: 7 + ((i * 3) % 6),
    tint: i % 3 === 0 ? "var(--color-moss)" : "var(--color-fern)",
    rotate: (i * 47) % 360,
  }));

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {leaves.map((l, i) => (
        <span
          key={i}
          className="anim-leaf absolute block"
          style={{
            left: `${l.left}%`,
            top: 0,
            width: l.size,
            height: l.size * 1.7,
            background: l.tint,
            opacity: 0.4,
            // Leaf shape: pointed at both ends.
            borderRadius: "0 100% 0 100%",
            transform: `rotate(${l.rotate}deg)`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

/** Static starfield for the night sky. */
export function Stars({ count = 60 }: { count?: number }) {
  const stars = Array.from({ length: count }, (_, i) => ({
    left: (i * 61) % 100,
    top: (i * 29) % 70,
    size: i % 7 === 0 ? 2.5 : 1.5,
    delay: (i * 0.23) % 3,
  }));

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {stars.map((s, i) => (
        <span
          key={i}
          className="anim-twinkle absolute rounded-full bg-blossom"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * The Patan skyline: tiered pagoda roofs along the bottom edge, the way they
 * sit around Pimbahal pond at dusk.
 */
export function Skyline() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1200 160"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full opacity-30 sm:h-32"
    >
      <defs>
        <linearGradient id="patan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-teak)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-night)" stopOpacity="1" />
        </linearGradient>
      </defs>

      {/* Three tiered temples of decreasing height */}
      {[
        { x: 180, s: 1 },
        { x: 600, s: 1.25 },
        { x: 960, s: 0.85 },
      ].map((t, i) => (
        <g key={i} transform={`translate(${t.x} 160) scale(${t.s}) translate(0 -160)`}>
          {/* Tier roofs, widest at the bottom */}
          {[0, 1, 2].map((tier) => {
            const w = 110 - tier * 26;
            const y = 90 + tier * 24;
            return (
              <polygon
                key={tier}
                points={`${-w},${y + 16} 0,${y - 14} ${w},${y + 16}`}
                fill="url(#patan)"
              />
            );
          })}
          {/* Spire */}
          <rect x="-3" y="62" width="6" height="22" fill="url(#patan)" />
          <circle cx="0" cy="60" r="5" fill="url(#patan)" />
          {/* Body */}
          <rect x="-52" y="132" width="104" height="28" fill="url(#patan)" />
        </g>
      ))}

      {/* Ground line */}
      <rect x="0" y="150" width="1200" height="10" fill="url(#patan)" />
    </svg>
  );
}

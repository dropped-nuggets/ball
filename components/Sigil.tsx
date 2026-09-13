/**
 * The loading mandala.
 *
 * Counter-rotating rings in the shape of a Newari mandala — the kind carved
 * into the toranas around Pimbahal — with leaf-tipped ticks for the forest,
 * a lotus at the centre, and a drifting spore of light.
 */
export default function Sigil({ size = 120 }: { size?: number }) {
  const ticks = Array.from({ length: 24 });
  const petals = Array.from({ length: 8 });

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      {/* Outer ring, slow clockwise */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 anim-spin-slow"
        fill="none"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="var(--color-gilt)"
          strokeWidth="0.8"
          opacity="0.75"
        />
        <circle
          cx="50"
          cy="50"
          r="43"
          stroke="var(--color-lilac)"
          strokeWidth="0.4"
          opacity="0.45"
          strokeDasharray="3 7"
        />
        {[0, 90, 180, 270].map((deg) => (
          <rect
            key={deg}
            x="48"
            y="1.6"
            width="4"
            height="4"
            fill="var(--color-gilt)"
            transform={`rotate(${deg} 50 50) rotate(45 50 3.6)`}
          />
        ))}
      </svg>

      {/* Leaf-tipped tick ring, counter-clockwise */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 anim-spin-rev"
        fill="none"
      >
        {ticks.map((_, i) => {
          const major = i % 3 === 0;
          return (
            <g
              key={i}
              transform={`rotate(${(360 / ticks.length) * i} 50 50)`}
            >
              <line
                x1="50"
                y1="12"
                x2="50"
                y2={major ? 18 : 15.5}
                stroke={major ? "var(--color-gilt)" : "var(--color-lilac)"}
                strokeWidth={major ? 1.2 : 0.6}
                opacity={major ? 0.95 : 0.45}
              />
              {major && (
                <ellipse
                  cx="50"
                  cy="10"
                  rx="1.4"
                  ry="2.6"
                  fill="var(--color-moss)"
                  opacity="0.85"
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Lotus ring, fast clockwise, with one orbiting spore */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 anim-spin-fast"
        fill="none"
      >
        {petals.map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="32"
            rx="3.2"
            ry="7"
            fill="var(--color-violet)"
            opacity="0.4"
            stroke="var(--color-lilac)"
            strokeWidth="0.4"
            transform={`rotate(${(360 / petals.length) * i} 50 50)`}
          />
        ))}
        <circle
          cx="50"
          cy="22"
          r="2.2"
          fill="var(--color-fern)"
          opacity="0.95"
        />
      </svg>

      {/* Breathing core */}
      <div className="absolute inset-0 grid place-items-center">
        <div
          className="anim-pulse-soft rounded-full"
          style={{
            width: size * 0.24,
            height: size * 0.24,
            background:
              "radial-gradient(circle, rgba(248,240,255,0.95) 0%, rgba(201,179,240,0.6) 45%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

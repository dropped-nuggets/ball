/**
 * Newari architectural ornament.
 *
 * A torana is the carved semicircular tympanum set above a temple doorway —
 * the single most recognisable piece of Newari woodwork, and on every shrine
 * around Pimbahal. Used here as a crown for cards and section headers.
 */

/**
 * Kirtimukha — the guardian face over a Newari doorway, abstracted to a
 * rosette. Drawn at its own aspect ratio and centred, never stretched.
 */
export function Kirtimukha({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={`pointer-events-none ${className}`} aria-hidden>
      {/* Rays */}
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <rect
          key={a}
          x="13.3"
          y="2"
          width="1.4"
          height="24"
          rx="0.7"
          fill="var(--color-gilt)"
          opacity="0.35"
          transform={`rotate(${a} 14 14)`}
        />
      ))}
      <circle cx="14" cy="14" r="7" fill="var(--color-teak)" />
      <circle cx="14" cy="14" r="7" fill="none" stroke="var(--color-gilt)" strokeWidth="1.2" />
      <circle cx="14" cy="14" r="3.2" fill="var(--color-gilt)" opacity="0.9" />
      <circle cx="14" cy="14" r="1.4" fill="var(--color-plum)" />
    </svg>
  );
}

/**
 * The carved lintel that crowns a card.
 *
 * Replaces a full-width stretched `<Torana>`: that art is authored at 200x46
 * and was being squashed to roughly 300x32 with `preserveAspectRatio="none"`,
 * which flattened the arch into a thin eyebrow and drew its hanging finials as
 * whiskers. A lintel is horizontal by nature, so stretching it is harmless —
 * and the one element that must not distort, the kirtimukha, is laid over the
 * top at its own aspect ratio.
 */
export function ToranaCrown() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden rounded-t-[20px]">
      <div className="newari-lintel h-7 w-full" />
      <Kirtimukha className="absolute left-1/2 top-0.5 h-6 w-6 -translate-x-1/2" />
    </div>
  );
}

export function Torana({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 46"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      {/* Arch body */}
      <path
        d="M8 46 Q 8 10 100 6 Q 192 10 192 46 Z"
        fill="var(--color-teak)"
        opacity="0.55"
      />
      <path
        d="M8 46 Q 8 10 100 6 Q 192 10 192 46"
        fill="none"
        stroke="var(--color-gilt)"
        strokeWidth="1.1"
        opacity="0.85"
      />
      {/* Inner arch */}
      <path
        d="M24 46 Q 24 20 100 16 Q 176 20 176 46"
        fill="none"
        stroke="var(--color-gilt)"
        strokeWidth="0.7"
        opacity="0.5"
      />

      {/* Kirtimukha — the guardian face at the apex, abstracted to a rosette */}
      <circle cx="100" cy="13" r="6.5" fill="var(--color-gilt)" opacity="0.9" />
      <circle cx="100" cy="13" r="3" fill="var(--color-plum)" />
      {[0, 45, 90, 135].map((a) => (
        <rect
          key={a}
          x="99.2"
          y="3"
          width="1.6"
          height="20"
          fill="var(--color-gilt)"
          opacity="0.45"
          transform={`rotate(${a} 100 13)`}
        />
      ))}

      {/* Hanging finials along the arch */}
      {[36, 60, 140, 164].map((x, i) => (
        <g key={x}>
          <line
            x1={x}
            y1={i < 2 ? 34 - i * 6 : 22 + (i - 2) * 6}
            x2={x}
            y2={46}
            stroke="var(--color-gilt)"
            strokeWidth="0.6"
            opacity="0.4"
          />
          <circle
            cx={x}
            cy={i < 2 ? 34 - i * 6 : 22 + (i - 2) * 6}
            r="2"
            fill="var(--color-brick)"
            opacity="0.85"
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * Tiered pagoda roofline — the Newari temple silhouette, used as a divider.
 */
export function Roofline({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 24"
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      <path
        d="M0 24 L 30 12 L 60 24 L 100 6 L 140 24 L 170 12 L 200 24 Z"
        fill="var(--color-teak)"
        opacity="0.35"
      />
      <path
        d="M0 24 L 30 12 L 60 24 L 100 6 L 140 24 L 170 12 L 200 24"
        fill="none"
        stroke="var(--color-gilt)"
        strokeWidth="0.8"
        opacity="0.55"
      />
    </svg>
  );
}

/**
 * Struts (tunala) — the carved diagonal braces under Newari temple eaves.
 * Rendered as small corner brackets inside a card.
 */
export function Strut({ corner }: { corner: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute top-0 h-5 w-5 ${
        corner === "left" ? "left-0" : "right-0 -scale-x-100"
      }`}
      aria-hidden
    >
      <path
        d="M1 1 L 23 1 L 1 23 Z"
        fill="var(--color-brick)"
        opacity="0.18"
      />
      <path
        d="M23 1 L 1 23"
        stroke="var(--color-gilt)"
        strokeWidth="0.8"
        opacity="0.45"
      />
      <circle cx="7" cy="7" r="1.6" fill="var(--color-gilt)" opacity="0.6" />
    </svg>
  );
}

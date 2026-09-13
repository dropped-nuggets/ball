/**
 * Purple tulips: a loading bracelet, and the botanical ornament that dresses
 * the letters.
 *
 * All of it is static SVG driven by CSS and SMIL, so these stay server
 * components — a loading screen that needed client JS to animate would be
 * exactly the wrong thing, since it has to be painted before that JS arrives.
 *
 * Positions around the ring are rounded to 3dp: `Math.sin`/`Math.cos` are not
 * required to be correctly rounded, and Node and the browser can disagree in
 * the last digit, which React reports as a hydration mismatch.
 */

const PETAL_DARK = "#6b4aa8";
const PETAL = "#8c67cf";
const PETAL_LIGHT = "#b79ae6";
const STEM = "#5d7f52";

/** One tulip, upright, its base at (0,0) and flower above it. */
export function Tulip({
  size = 28,
  tone = 0,
}: {
  size?: number;
  /** Shifts the purple, so a row of tulips is not one flat colour. */
  tone?: number;
}) {
  const petals = [
    [PETAL_DARK, PETAL, PETAL_LIGHT],
    [PETAL, PETAL_LIGHT, PETAL_DARK],
    [PETAL_LIGHT, PETAL_DARK, PETAL],
  ][tone % 3];

  const u = size / 28;

  return (
    <g transform={`scale(${u})`}>
      {/* Stem */}
      <path d="M 0 0 L 0 -12.5" stroke={STEM} strokeWidth="1.5" strokeLinecap="round" />

      {/* Strap leaves — long, broad and curving, the way tulip leaves are */}
      <path d="M 0 -2 C -5 -4 -8.6 -8.4 -9.8 -15 C -6 -12.4 -2.2 -7.6 -0.7 -3 Z" fill={STEM} opacity="0.85" />
      <path d="M 0 -4.5 C 4.6 -6.4 7.8 -10 9 -15.6 C 5.6 -13.6 2 -9.6 0.7 -5.4 Z" fill={STEM} opacity="0.68" />

      {/*
       * The cup, built from three overlapping petals rather than one outline.
       * A tulip is read from its silhouette: a rounded goblet with a pointed
       * centre petal and a notch down to each outer one. A single almond shape
       * has neither, which is why it looked like a leaf.
       */}
      <g transform="translate(0 -12.5)">
        {/* Outer petals, behind */}
        <path
          d="M 0 0 C -4.6 -0.8 -6.3 -4 -6 -7.8 C -5.7 -11 -4.5 -12.9 -3.6 -13.8
             C -3 -11 -2.4 -7 -1.1 -3 Z"
          fill={petals[0]}
        />
        <path
          d="M 0 0 C 4.6 -0.8 6.3 -4 6 -7.8 C 5.7 -11 4.5 -12.9 3.6 -13.8
             C 3 -11 2.4 -7 1.1 -3 Z"
          fill={petals[2]}
        />
        {/* Centre petal, in front and tallest */}
        <path
          d="M 0 0.4 C -3 -0.8 -3.5 -5 -2.9 -8.2 C -2.1 -11.4 -1 -13.4 0 -15
             C 1 -13.4 2.1 -11.4 2.9 -8.2 C 3.5 -5 3 -0.8 0 0.4 Z"
          fill={petals[1]}
        />
        {/* Seams where the petals meet, and a highlight down the middle */}
        <path d="M -2.6 -2.6 C -3.2 -6 -3 -9.4 -2 -12" fill="none" stroke="#4a3568" strokeWidth="0.35" opacity="0.35" />
        <path d="M 2.6 -2.6 C 3.2 -6 3 -9.4 2 -12" fill="none" stroke="#4a3568" strokeWidth="0.35" opacity="0.35" />
        <path d="M 0 -13.4 C 0.7 -10.6 1 -7.6 0.8 -4.6" fill="none" stroke="#e3d6f7" strokeWidth="0.6" opacity="0.5" />
      </g>
    </g>
  );
}

/** Ring positions, precomputed once and rounded so SSR and the client agree. */
function ring(count: number, radius: number) {
  return Array.from({ length: count }, (_, i) => {
    const deg = (i / count) * 360;
    const a = (deg * Math.PI) / 180;
    return {
      x: Number((Math.sin(a) * radius).toFixed(3)),
      y: Number((-Math.cos(a) * radius).toFixed(3)),
      deg: Number(deg.toFixed(3)),
      i,
    };
  });
}

/** Radius of the cord. The flowers and beads both sit on it. */
const CORD_R = 44;

/**
 * Eight flowers rather than ten, and larger. Packed tighter they overlapped
 * into a band of petals and stopped reading as individual tulips.
 */
const TULIPS = ring(8, CORD_R);
const BEADS = ring(16, CORD_R);

/**
 * The loading bracelet: a circlet of purple tulips threaded on a gilt cord,
 * turning slowly while each flower opens in turn.
 *
 * The bloom is staggered around the ring rather than synchronised, so the
 * motion reads as something growing rather than something pulsing.
 */
export function TulipBracelet({ size = 180 }: { size?: number }) {
  return (
    <svg
      /*
       * A flower stands about 37 units proud of the cord, so the box has to
       * reach CORD_R + 37 or the outermost petals clip at the corners.
       */
      viewBox="-84 -84 168 168"
      width={size}
      height={size}
      className="anim-bracelet block"
      role="img"
      aria-label="A bracelet of purple tulips, loading"
    >
      {/* The cord */}
      <circle r={CORD_R} fill="none" stroke="var(--color-gilt)" strokeWidth="1" opacity="0.35" />
      <circle r={CORD_R} fill="none" stroke="var(--color-gilt)" strokeWidth="3" opacity="0.12" />

      {/* Seed beads between the flowers */}
      {BEADS.map((b) => (
        <circle key={`b${b.i}`} cx={b.x} cy={b.y} r="1.6" fill="var(--color-gilt)" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.2;0.8;0.2"
            dur="3.2s"
            begin={`${(b.i % 10) * 0.18}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* The tulips, each facing outward from the centre */}
      {TULIPS.map((t) => (
        <g key={t.i} transform={`translate(${t.x} ${t.y}) rotate(${t.deg})`}>
          {/* 0.09s stagger — see HOLD_MS in PageTransition.tsx */}
          <g className="anim-bloom" style={{ animationDelay: `${t.i * 0.09}s` }}>
            <Tulip size={38} tone={t.i} />
          </g>
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Letter ornament
 * ------------------------------------------------------------------ */

/**
 * A corner spray of tulips and foliage, for the corners of a letter.
 * Drawn for the top-left corner; flip it with a transform for the others.
 */
export function CornerSpray({
  size = 96,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      {/* Sweeping stems */}
      <path d="M 4 4 q 34 10 52 44" fill="none" stroke={STEM} strokeWidth="1.3" opacity="0.75" />
      <path d="M 4 4 q 12 30 8 56" fill="none" stroke={STEM} strokeWidth="1.1" opacity="0.6" />
      <path d="M 4 4 q 30 4 44 14" fill="none" stroke={STEM} strokeWidth="0.9" opacity="0.5" />

      {/* Leaves along them */}
      {[
        "M 20 12 q 10 -6 18 -2 q -8 6 -18 2 Z",
        "M 30 26 q 12 -4 19 2 q -10 5 -19 -2 Z",
        "M 12 30 q 6 10 3 19 q -7 -8 -3 -19 Z",
        "M 16 48 q 7 9 5 18 q -8 -7 -5 -18 Z",
      ].map((d) => (
        <path key={d} d={d} fill={STEM} opacity="0.55" />
      ))}

      {/* Tulips at the ends of the stems */}
      <g transform="translate(56 48) rotate(24)">
        <Tulip size={26} tone={0} />
      </g>
      <g transform="translate(12 60) rotate(-14)">
        <Tulip size={20} tone={2} />
      </g>
      <g transform="translate(48 18) rotate(52)">
        <Tulip size={17} tone={1} />
      </g>

      {/* Scattered buds */}
      {[
        [38, 38],
        [26, 54],
        [58, 30],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="2" fill={PETAL_LIGHT} opacity="0.6" />
      ))}
    </svg>
  );
}

/**
 * A botanical divider — a stem of tulips running out to either side of a
 * centre bloom, the way a Victorian letterhead rules off a heading.
 */
export function BotanicalRule({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 28" className={`block w-full ${className}`} aria-hidden>
      <path d="M 10 18 L 96 18 M 144 18 L 230 18" stroke="var(--color-gilt-deep)" strokeWidth="0.8" opacity="0.65" />
      {[
        "M 74 18 q 9 -6 17 -3 q -8 6 -17 3 Z",
        "M 166 18 q -9 -6 -17 -3 q 8 6 17 3 Z",
      ].map((d) => (
        <path key={d} d={d} fill={STEM} opacity="0.5" />
      ))}
      <circle cx="10" cy="18" r="1.8" fill="var(--color-gilt-deep)" opacity="0.7" />
      <circle cx="230" cy="18" r="1.8" fill="var(--color-gilt-deep)" opacity="0.7" />
      <g transform="translate(120 26)">
        <Tulip size={26} tone={0} />
      </g>
    </svg>
  );
}

/**
 * The journey, drawn as scenery: Patan on one end, London on the other, jungle
 * and cloud in between.
 *
 * Everything here is a pure silhouette in the site's palette — teak and brick
 * massing, gilt hairline on top, no external assets. Both the home-page flight
 * panel and the post-login sequence draw from this file, so the two tell the
 * same story with the same buildings rather than drifting apart.
 *
 * Each scene is authored in its own viewBox and stretched by the caller. They
 * are decorative, so every root carries aria-hidden and nothing here is
 * interactive.
 */

const TEAK = "var(--color-teak)";
const GILT = "var(--color-gilt)";
const BRICK = "var(--color-brick)";

/* ------------------------------------------------------------------ *
 * Newari temple
 * ------------------------------------------------------------------ */

/**
 * A tiered Newari pagoda — the temple form that fills Patan Durbar Square.
 * Tiers step inward as they rise, each with the deep upturned eave and the
 * hanging struts (tunala) underneath; a gilt gajur finial caps the top.
 */
export function Pagoda({
  x,
  base,
  w,
  tiers = 3,
  fill = TEAK,
  opacity = 1,
}: {
  /** Centre line. */
  x: number;
  /** Ground line — the building rises from here. */
  base: number;
  /** Width of the lowest eave. */
  w: number;
  tiers?: number;
  fill?: string;
  opacity?: number;
}) {
  const step = w * 0.42;
  const bodyH = w * 0.3;

  const parts = [];

  // Plinth: Newari temples sit on a stepped stone base.
  for (let s = 0; s < 2; s++) {
    const pw = w * (0.62 - s * 0.1);
    parts.push(
      <rect
        key={`plinth-${s}`}
        x={x - pw / 2}
        y={base - (s + 1) * (w * 0.07)}
        width={pw}
        height={w * 0.08}
        fill={fill}
      />,
    );
  }

  for (let i = 0; i < tiers; i++) {
    const rw = (w * (1 - i * 0.2)) / 2;
    const y = base - w * 0.14 - i * step;
    const bw = rw * 0.62;

    parts.push(
      // Storey wall
      <rect
        key={`body-${i}`}
        x={x - bw}
        y={y - bodyH}
        width={bw * 2}
        height={bodyH}
        fill={fill}
      />,
      // Eave: flat run, then a lift at each corner the way a real roof turns up
      <path
        key={`roof-${i}`}
        d={`M ${x - rw - rw * 0.16} ${y - bodyH + rw * 0.1}
            Q ${x - rw * 0.5} ${y - bodyH - rw * 0.2} ${x} ${y - bodyH - rw * 0.24}
            Q ${x + rw * 0.5} ${y - bodyH - rw * 0.2} ${x + rw + rw * 0.16} ${y - bodyH + rw * 0.1}
            L ${x + rw * 0.8} ${y - bodyH + rw * 0.02}
            L ${x - rw * 0.8} ${y - bodyH + rw * 0.02} Z`}
        fill={fill}
      />,
      <path
        key={`eave-${i}`}
        d={`M ${x - rw - rw * 0.16} ${y - bodyH + rw * 0.1}
            Q ${x - rw * 0.5} ${y - bodyH - rw * 0.2} ${x} ${y - bodyH - rw * 0.24}
            Q ${x + rw * 0.5} ${y - bodyH - rw * 0.2} ${x + rw + rw * 0.16} ${y - bodyH + rw * 0.1}`}
        fill="none"
        stroke={GILT}
        strokeWidth="0.9"
        opacity="0.55"
      />,
      // Struts under the eave
      <g key={`struts-${i}`} opacity="0.45">
        {[-0.62, 0, 0.62].map((f) => (
          <line
            key={f}
            x1={x + rw * f * 1.1}
            y1={y - bodyH + rw * 0.06}
            x2={x + rw * f * 0.72}
            y2={y - bodyH * 0.15}
            stroke={GILT}
            strokeWidth="0.5"
          />
        ))}
      </g>,
    );
  }

  const topY = base - w * 0.14 - (tiers - 1) * step - bodyH - w * 0.12;

  return (
    <g opacity={opacity}>
      {parts}
      {/* Gajur — the gilt bell finial */}
      <circle cx={x} cy={topY - w * 0.05} r={w * 0.045} fill={GILT} opacity="0.9" />
      <line
        x1={x}
        y1={topY}
        x2={x}
        y2={topY - w * 0.14}
        stroke={GILT}
        strokeWidth="1"
        opacity="0.8"
      />
      <circle cx={x} cy={topY - w * 0.15} r={w * 0.022} fill={GILT} />
    </g>
  );
}

/**
 * A shikhara — the stone spire of Krishna Mandir, the one building in Patan
 * Durbar Square that is not a pagoda. Included so the skyline reads as *that*
 * square rather than a generic temple row.
 */
export function Shikhara({
  x,
  base,
  w,
  fill = TEAK,
}: {
  x: number;
  base: number;
  w: number;
  fill?: string;
}) {
  const h = w * 2.1;
  return (
    <g>
      {/* Stepped stone arcade at the base */}
      {[0, 1].map((s) => (
        <rect
          key={s}
          x={x - (w / 2) * (1 - s * 0.18)}
          y={base - (s + 1) * (h * 0.14)}
          width={w * (1 - s * 0.18)}
          height={h * 0.14}
          fill={fill}
        />
      ))}
      {/* Curved spire */}
      <path
        d={`M ${x - w * 0.34} ${base - h * 0.28}
            Q ${x - w * 0.26} ${base - h * 0.78} ${x} ${base - h}
            Q ${x + w * 0.26} ${base - h * 0.78} ${x + w * 0.34} ${base - h * 0.28} Z`}
        fill={fill}
      />
      <path
        d={`M ${x - w * 0.34} ${base - h * 0.28}
            Q ${x - w * 0.26} ${base - h * 0.78} ${x} ${base - h}`}
        fill="none"
        stroke={GILT}
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle cx={x} cy={base - h - w * 0.06} r={w * 0.05} fill={GILT} opacity="0.9" />
    </g>
  );
}

/**
 * Patan Durbar Square: the temple row, the stone column with its guardian bird,
 * and the brick palace wall behind.
 */
export function DurbarSquare({
  className = "",
  /**
   * "slice" fills the box and crops (right for a full-bleed backdrop); "meet"
   * fits the whole square inside it (right for a short wide strip, where slice
   * crops the temples away and leaves only unreadable roof fragments).
   */
  fit = "slice",
}: {
  className?: string;
  fit?: "slice" | "meet";
}) {
  return (
    <svg
      viewBox="0 0 400 150"
      preserveAspectRatio={`xMidYMax ${fit}`}
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      {/* Palace wall behind, with the lattice windows lit from inside */}
      <rect x="0" y="96" width="400" height="54" fill={TEAK} opacity="0.5" />
      {Array.from({ length: 13 }, (_, i) => (
        <rect
          key={i}
          x={10 + i * 30}
          y={104}
          width={11}
          height={15}
          rx="1.5"
          fill={GILT}
          opacity={0.16 + (i % 3) * 0.07}
        />
      ))}
      <rect x="0" y="94" width="400" height="2" fill={GILT} opacity="0.35" />

      <Pagoda x={70} base={150} w={62} tiers={3} opacity={0.95} />
      <Shikhara x={165} base={150} w={38} />
      <Pagoda x={248} base={150} w={46} tiers={2} opacity={0.9} />
      <Pagoda x={340} base={150} w={70} tiers={3} opacity={1} />

      {/* Yoganarendra Malla's column — the king on a pillar, watching the square */}
      <g>
        <rect x="117" y="104" width="5" height="46" fill={TEAK} />
        <circle cx="119.5" cy="100" r="5" fill={TEAK} />
        <circle cx="119.5" cy="100" r="5" fill="none" stroke={GILT} strokeWidth="0.7" opacity="0.6" />
        <path d="M 119.5 95 L 117 89 L 122 89 Z" fill={GILT} opacity="0.75" />
      </g>

      {/* Ground */}
      <rect x="0" y="146" width="400" height="4" fill={BRICK} opacity="0.45" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Jungle
 * ------------------------------------------------------------------ */

/**
 * Layered canopy for the foreground — her subject, and the hills the valley
 * sits in. Three depths, darkest in front, so a pan across it parallaxes.
 */
export function JungleCanopy({
  className = "",
  layer = 0,
}: {
  className?: string;
  /** 0 furthest / palest, 2 nearest / darkest. */
  layer?: 0 | 1 | 2;
}) {
  const tone = ["var(--color-moss)", "#5c8a52", "#2f4a33"][layer];
  const op = [0.35, 0.6, 0.95][layer];
  const lift = [26, 14, 0][layer];

  // Deterministic crowns — no Math.random, so server and client agree.
  const crowns = Array.from({ length: 11 }, (_, i) => ({
    x: i * 40 + ((i * 37) % 23),
    r: 26 + ((i * 53) % 18) + layer * 5,
  }));

  return (
    <svg
      viewBox="0 0 400 120"
      /*
       * Stretched, not cropped. "slice" on a short wide strip cuts the crowns
       * off entirely and leaves a flat green rectangle; foliage is the one
       * thing that survives non-uniform scaling, since a wider tree still
       * reads as a tree.
       */
      preserveAspectRatio="none"
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      <g fill={tone} opacity={op}>
        {crowns.map((c, i) => (
          <ellipse key={i} cx={c.x} cy={78 + lift} rx={c.r} ry={c.r * 0.72} />
        ))}
        <rect x="0" y={76 + lift} width="400" height={120 - lift} />
      </g>

      {/* A few trunks and fronds in the nearest layer only */}
      {layer === 2 && (
        <g opacity="0.9">
          {[40, 150, 268, 366].map((x, i) => (
            <path
              key={x}
              d={`M ${x} 120 L ${x + (i % 2 ? 3 : -3)} 74`}
              stroke="#22351f"
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
          {[
            "M 40 76 q -26 -10 -34 -26 q 20 4 34 18",
            "M 40 76 q 26 -10 34 -26 q -20 4 -34 18",
            "M 268 76 q -24 -12 -30 -28 q 18 6 30 20",
            "M 268 76 q 24 -12 30 -28 q -18 6 -30 20",
          ].map((d) => (
            <path key={d} d={d} fill="#2f4a33" />
          ))}
        </g>
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Cloud
 * ------------------------------------------------------------------ */

/** One soft cloud, built from overlapping lobes. */
export function Cloud({
  x,
  y,
  w,
  opacity = 0.5,
  fill = "var(--color-lilac)",
}: {
  x: number;
  y: number;
  w: number;
  opacity?: number;
  fill?: string;
}) {
  const u = w / 100;
  return (
    <g opacity={opacity} fill={fill}>
      <ellipse cx={x} cy={y} rx={34 * u} ry={15 * u} />
      <ellipse cx={x - 22 * u} cy={y + 4 * u} rx={22 * u} ry={11 * u} />
      <ellipse cx={x + 24 * u} cy={y + 3 * u} rx={24 * u} ry={12 * u} />
      <ellipse cx={x - 6 * u} cy={y - 10 * u} rx={20 * u} ry={13 * u} />
      <ellipse cx={x + 12 * u} cy={y - 8 * u} rx={16 * u} ry={11 * u} />
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * London
 * ------------------------------------------------------------------ */

/**
 * Capsule positions around the London Eye.
 *
 * Rounded to 3dp, and that rounding is load-bearing. `Math.sin`/`Math.cos` are
 * not required by the spec to be correctly rounded, so Node and the browser
 * can disagree in the last digit — enough for React to report a hydration
 * mismatch on the coordinate attributes. Rounding makes the two agree.
 *
 * Hoisted to a module constant so the trigonometry runs once, not per render.
 */
const EYE_SPOKES = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2;
  return {
    x: Number((318 + Math.cos(a) * 34).toFixed(3)),
    y: Number((86 + Math.sin(a) * 34).toFixed(3)),
  };
});

/**
 * The other end: Big Ben and the Palace of Westminster, the Eye behind, a
 * double-decker crossing the bridge. Drawn in the same teak-and-gilt language
 * as Patan rather than in a different style, because the point of the site is
 * that the two places belong to one person.
 */
export function LondonSkyline({
  className = "",
  /** As with DurbarSquare: "meet" to keep the whole skyline in frame. */
  fit = "slice",
}: {
  className?: string;
  fit?: "slice" | "meet";
}) {
  return (
    <svg
      viewBox="0 0 400 150"
      preserveAspectRatio={`xMidYMax ${fit}`}
      className={`pointer-events-none block w-full ${className}`}
      aria-hidden
    >
      {/* London Eye */}
      <g opacity="0.55">
        <circle cx="318" cy="86" r="34" fill="none" stroke={GILT} strokeWidth="1.1" />
        <circle cx="318" cy="86" r="4" fill={GILT} opacity="0.7" />
        {EYE_SPOKES.map((p, i) => (
          <line
            key={i}
            x1="318"
            y1="86"
            x2={p.x}
            y2={p.y}
            stroke={GILT}
            strokeWidth="0.4"
          />
        ))}
        {EYE_SPOKES.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="2" fill={GILT} opacity="0.8" />
        ))}
        <path d="M 306 118 L 318 90 L 330 118" stroke={TEAK} strokeWidth="2.5" fill="none" />
      </g>

      {/* Palace of Westminster */}
      <rect x="118" y="104" width="150" height="46" fill={TEAK} opacity="0.85" />
      {Array.from({ length: 15 }, (_, i) => (
        <rect
          key={i}
          x={123 + i * 10}
          y="110"
          width="5"
          height="13"
          rx="2.5"
          fill={GILT}
          opacity={0.2 + (i % 4) * 0.06}
        />
      ))}
      {/* Perpendicular gothic crenellation */}
      {Array.from({ length: 19 }, (_, i) => (
        <rect key={i} x={118 + i * 8} y="100" width="4" height="5" fill={TEAK} opacity="0.85" />
      ))}
      {/* Victoria Tower */}
      <rect x="240" y="66" width="26" height="40" fill={TEAK} opacity="0.9" />
      <path d="M 238 66 L 253 54 L 268 66 Z" fill={TEAK} opacity="0.9" />

      {/* Big Ben — the Elizabeth Tower */}
      <g>
        <rect x="74" y="52" width="30" height="98" fill={TEAK} />
        <rect x="72" y="48" width="34" height="6" fill={TEAK} />
        {/* Clock face, lit */}
        <circle cx="89" cy="68" r="11" fill="var(--color-parchment)" opacity="0.92" />
        <circle cx="89" cy="68" r="11" fill="none" stroke={GILT} strokeWidth="1.2" />
        <line x1="89" y1="68" x2="89" y2="61" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
        <line x1="89" y1="68" x2="94" y2="70" stroke="var(--color-ink)" strokeWidth="1.2" strokeLinecap="round" />
        {/* Spire */}
        <path d="M 74 48 L 89 14 L 104 48 Z" fill={TEAK} />
        <path d="M 74 48 L 89 14 L 104 48" fill="none" stroke={GILT} strokeWidth="0.8" opacity="0.6" />
        <line x1="89" y1="14" x2="89" y2="5" stroke={GILT} strokeWidth="1" />
        <circle cx="89" cy="4" r="2.2" fill={GILT} />
        {/* Lattice band, echoing the ankhi jhyal at home */}
        <rect x="76" y="84" width="26" height="18" fill="none" stroke={GILT} strokeWidth="0.5" opacity="0.4" />
      </g>

      {/* Bridge and river */}
      <rect x="0" y="132" width="400" height="18" fill="var(--color-plum-2)" opacity="0.8" />
      <rect x="0" y="130" width="400" height="3" fill={GILT} opacity="0.3" />

      {/* Routemaster */}
      <g>
        <rect x="22" y="116" width="40" height="15" rx="3" fill={BRICK} />
        <rect x="26" y="119" width="9" height="6" rx="1" fill={GILT} opacity="0.55" />
        <rect x="38" y="119" width="9" height="6" rx="1" fill={GILT} opacity="0.55" />
        <rect x="50" y="119" width="8" height="6" rx="1" fill={GILT} opacity="0.55" />
        <circle cx="32" cy="132" r="3.4" fill="var(--color-night)" />
        <circle cx="54" cy="132" r="3.4" fill="var(--color-night)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * The valley, at street level
 * ------------------------------------------------------------------ */

/** Dachi appa — the deep wedge-brick facing of a Newari facade. */
const BRICK_DEEP = "#8e4a35";
/** Carved woodwork, darker than the structural teak. */
const CARVE = "#3a2a22";

/**
 * A latticed window pane — tiki jhya. Warm light behind a dark wooden grid.
 */
function Jhya({
  x,
  y,
  w,
  h,
  cols = 3,
  rows = 3,
  glow = 0.32,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  cols?: number;
  rows?: number;
  glow?: number;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={GILT} opacity={glow} />
      {Array.from({ length: cols - 1 }, (_, i) => (
        <line
          key={`c${i}`}
          x1={x + ((i + 1) * w) / cols}
          y1={y}
          x2={x + ((i + 1) * w) / cols}
          y2={y + h}
          stroke={CARVE}
          strokeWidth={w * 0.055}
        />
      ))}
      {Array.from({ length: rows - 1 }, (_, i) => (
        <line
          key={`r${i}`}
          x1={x}
          y1={y + ((i + 1) * h) / rows}
          x2={x + w}
          y2={y + ((i + 1) * h) / rows}
          stroke={CARVE}
          strokeWidth={h * 0.055}
        />
      ))}
      <rect x={x} y={y} width={w} height={h} fill="none" stroke={CARVE} strokeWidth={w * 0.07} />
    </g>
  );
}

/**
 * A Newari town house, as they stand in the lanes around Pimbahal.
 *
 * Built floor by floor the way the real thing is, because the proportions are
 * what make it Newari rather than generically old:
 *
 * - a stone plinth at street level, with the pikha lakhu step at the door;
 * - a low ground floor (chhedi), shop or store, with a carved door frame
 *   under a torana;
 * - dachi appa brickwork — wedge bricks laid with joints so fine the courses
 *   read as texture, not as masonry;
 * - carved timber cornice bands dividing every storey;
 * - the sanjhya on the middle floor: the projecting bay window, corbelled out
 *   on brackets, the most recognisable thing on the whole facade;
 * - tiki jhya lattice windows above;
 * - and a jhingati-tiled roof with a deep overhang carried on tunala struts.
 *
 * Drawn small in the frieze, so every element is sized to still read at about
 * forty units wide.
 */
/** Brick tones, so a row of houses is not one colour repeated. */
const BRICK_TONES = ["#8e4a35", "#7d4230", "#9c5540", "#864631"];

export function NewariHouse({
  x,
  base,
  w,
  storeys = 3,
  /** Which brick tone to use — indexes BRICK_TONES, wrapping. */
  tone = 0,
  /** The projecting carved bay. Some houses have one, some are flat-fronted. */
  bay = true,
  /** Ground floor: a house door, or an open shopfront onto the lane. */
  ground = "door",
  /** Pitched tiled roof, or a flat roof behind a brick parapet. */
  roof = "tiled",
}: {
  x: number;
  base: number;
  w: number;
  storeys?: number;
  tone?: number;
  bay?: boolean;
  ground?: "door" | "shop";
  roof?: "tiled" | "parapet";
}) {
  const plinthH = w * 0.1;
  const groundH = w * 0.42;
  const upperH = w * 0.46;
  const uppers = Math.max(1, storeys - 1);
  const bodyH = groundH + uppers * upperH;
  const wallTop = base - plinthH - bodyH;
  const groundTop = base - plinthH - groundH;

  /** y of the floor line under upper storey i (0 = the sanjhya floor). */
  const floorY = (i: number) => groundTop - i * upperH;

  return (
    <g>
      {/* --- Stone plinth, and the pikha lakhu step at the threshold --- */}
      <rect x={x - w * 0.05} y={base - plinthH} width={w * 1.1} height={plinthH} fill="#5d5148" />
      <rect x={x - w * 0.05} y={base - plinthH} width={w * 1.1} height={plinthH * 0.22} fill="#6e6157" />
      <rect x={x + w * 0.3} y={base - plinthH * 0.5} width={w * 0.4} height={plinthH * 0.5} fill="#6e6157" />

      {/* --- Brick body --- */}
      <rect
        x={x}
        y={wallTop}
        width={w}
        height={bodyH}
        fill={BRICK_TONES[tone % BRICK_TONES.length]}
      />
      {/* Ground floor sits in shadow under the upper overhangs */}
      <rect x={x} y={groundTop} width={w} height={groundH} fill={CARVE} opacity="0.28" />

      {/* Dachi appa courses. Fine and low-contrast — Newari joints are almost
          invisible, so heavy mortar lines would read as the wrong brickwork. */}
      {Array.from({ length: Math.round(bodyH / (w * 0.075)) }, (_, i) => (
        <line
          key={i}
          x1={x}
          y1={wallTop + (i + 1) * (w * 0.075)}
          x2={x + w}
          y2={wallTop + (i + 1) * (w * 0.075)}
          stroke={BRICK}
          strokeWidth="0.35"
          opacity="0.5"
        />
      ))}

      {/* --- Ground floor --- */}
      {ground === "door" ? (
        // A house door: carved frame under a torana.
        <g>
          <rect x={x + w * 0.34} y={groundTop + groundH * 0.26} width={w * 0.32} height={groundH * 0.74} fill="#171018" />
          <rect
            x={x + w * 0.3}
            y={groundTop + groundH * 0.22}
            width={w * 0.4}
            height={groundH * 0.78}
            fill="none"
            stroke={TEAK}
            strokeWidth={w * 0.045}
          />
          <path
            d={`M ${x + w * 0.28} ${groundTop + groundH * 0.24}
                q ${w * 0.22} ${-groundH * 0.3} ${w * 0.44} 0 Z`}
            fill={TEAK}
          />
          <circle cx={x + w * 0.5} cy={groundTop + groundH * 0.14} r={w * 0.035} fill={GILT} opacity="0.75" />
        </g>
      ) : (
        // A shopfront open onto the lane: shutter box, lit interior, goods out
        // front on the step. Half the ground floors in Patan are one of these.
        <g>
          <rect x={x + w * 0.08} y={groundTop + groundH * 0.3} width={w * 0.84} height={groundH * 0.7} fill="#120d16" />
          <rect x={x + w * 0.08} y={groundTop + groundH * 0.36} width={w * 0.84} height={groundH * 0.4} fill={GILT} opacity="0.22" />
          {/* Rolled-up shutter above the opening */}
          <rect x={x + w * 0.06} y={groundTop + groundH * 0.2} width={w * 0.88} height={groundH * 0.12} fill="#4a4048" />
          {Array.from({ length: 4 }, (_, i) => (
            <line
              key={i}
              x1={x + w * 0.06}
              y1={groundTop + groundH * (0.22 + i * 0.025)}
              x2={x + w * 0.94}
              y2={groundTop + groundH * (0.22 + i * 0.025)}
              stroke="#2e272f"
              strokeWidth="0.4"
            />
          ))}
          {/* Stacked goods on the step */}
          {[0.2, 0.36, 0.66].map((f, i) => (
            <rect
              key={f}
              x={x + w * f}
              y={base - plinthH - groundH * (0.16 + i * 0.04)}
              width={w * 0.12}
              height={groundH * (0.16 + i * 0.04)}
              fill={[BRICK, "var(--color-moss)", "var(--color-seal-marigold)"][i]}
              opacity="0.75"
            />
          ))}
        </g>
      )}

      {/* --- Cornice band at every floor division --- */}
      {Array.from({ length: uppers + 1 }, (_, i) => {
        const cy = floorY(i);
        return (
          <g key={i}>
            <rect x={x - w * 0.035} y={cy - w * 0.035} width={w * 1.07} height={w * 0.05} fill={TEAK} />
            {/* Dentils along the band */}
            {Array.from({ length: 6 }, (_, d) => (
              <rect
                key={d}
                x={x + w * 0.04 + d * (w * 0.155)}
                y={cy + w * 0.015}
                width={w * 0.055}
                height={w * 0.03}
                fill={CARVE}
                opacity="0.85"
              />
            ))}
          </g>
        );
      })}

      {/* --- The sanjhya: projecting carved bay on the first upper floor --- */}
      <g>
        {!bay ? (
          // Flat-fronted: a row of three lattice windows instead of a bay.
          <g>
            {[0.1, 0.38, 0.66].map((f) => (
              <Jhya
                key={f}
                x={x + w * f}
                y={floorY(1) + upperH * 0.24}
                w={w * 0.24}
                h={upperH * 0.44}
                cols={2}
                rows={2}
                glow={f === 0.38 ? 0.4 : 0.24}
              />
            ))}
          </g>
        ) : (() => {
          const topY = floorY(1) + upperH * 0.16;
          const bayH = upperH * 0.56;
          const bayX = x - w * 0.07;
          const bayW = w * 1.14;
          return (
            <>
              {/* Corbel brackets carrying the bay */}
              {[0.16, 0.5, 0.84].map((f) => (
                <path
                  key={f}
                  d={`M ${x + w * f - w * 0.05} ${topY + bayH}
                      L ${x + w * f + w * 0.05} ${topY + bayH}
                      L ${x + w * f} ${topY + bayH + upperH * 0.16} Z`}
                  fill={TEAK}
                />
              ))}
              {/* Bay body */}
              <rect x={bayX} y={topY} width={bayW} height={bayH} fill={TEAK} />
              {/* Three lattice panels */}
              {[0, 1, 2].map((p) => (
                <Jhya
                  key={p}
                  x={bayX + bayW * (0.08 + p * 0.29)}
                  y={topY + bayH * 0.16}
                  w={bayW * 0.22}
                  h={bayH * 0.66}
                  cols={2}
                  rows={3}
                  glow={p === 1 ? 0.42 : 0.26}
                />
              ))}
              {/* Carved cornice over the bay */}
              <rect x={bayX - w * 0.02} y={topY - w * 0.04} width={bayW + w * 0.04} height={w * 0.05} fill={CARVE} />
              <rect x={bayX} y={topY - w * 0.02} width={bayW} height={w * 0.02} fill={GILT} opacity="0.35" />
            </>
          );
        })()}
      </g>

      {/* --- Tiki jhya on the remaining upper floors --- */}
      {Array.from({ length: Math.max(0, uppers - 1) }, (_, i) => {
        const topY = floorY(i + 2) + upperH * 0.2;
        return (
          <g key={i}>
            <Jhya
              x={x + w * 0.12}
              y={topY}
              w={w * 0.3}
              h={upperH * 0.46}
              cols={2}
              rows={2}
              glow={0.24}
            />
            <Jhya
              x={x + w * 0.58}
              y={topY}
              w={w * 0.3}
              h={upperH * 0.46}
              cols={2}
              rows={2}
              glow={0.3}
            />
          </g>
        );
      })}

      {/* --- Roof --- */}
      {roof === "parapet" ? (
        // Flat roof behind a low brick parapet, with a water tank on top —
        // how an old house looks once a floor has been added in concrete.
        <g>
          <rect x={x - w * 0.04} y={wallTop - w * 0.14} width={w * 1.08} height={w * 0.16} fill={BRICK_TONES[tone % BRICK_TONES.length]} />
          {Array.from({ length: 7 }, (_, i) => (
            <rect key={i} x={x + w * (0.02 + i * 0.145)} y={wallTop - w * 0.22} width={w * 0.07} height={w * 0.09} fill={BRICK_TONES[tone % BRICK_TONES.length]} />
          ))}
          <rect x={x + w * 0.58} y={wallTop - w * 0.42} width={w * 0.3} height={w * 0.22} rx={w * 0.04} fill="#3f6f8e" />
          <rect x={x + w * 0.6} y={wallTop - w * 0.46} width={w * 0.26} height={w * 0.05} rx={w * 0.02} fill="#2f5468" />
        </g>
      ) : (
        <>
          {/* Tunala: carved struts under the eaves */}
          {[0.1, 0.5, 0.9].map((f) => (
            <path
              key={f}
              d={`M ${x + w * f} ${wallTop} L ${x + w * f - w * 0.06} ${wallTop + w * 0.2} Z`}
              stroke={TEAK}
              strokeWidth={w * 0.035}
            />
          ))}

          {/* Jhingati-tiled roof, deep overhang */}
          <path
            d={`M ${x - w * 0.26} ${wallTop + w * 0.08}
                L ${x + w * 0.5} ${wallTop - w * 0.26}
                L ${x + w * 1.26} ${wallTop + w * 0.08} Z`}
            fill="#6b3b2c"
          />
          {/* Tile courses running down the pitch */}
          {Array.from({ length: 11 }, (_, i) => {
            const t = (i + 1) / 12;
            return (
              <line
                key={i}
                x1={x + w * (0.5 - 0.76 * t)}
                y1={wallTop - w * 0.26 + w * 0.34 * t}
                x2={x + w * (0.5 + 0.76 * t)}
                y2={wallTop - w * 0.26 + w * 0.34 * t}
                stroke={CARVE}
                strokeWidth="0.4"
                opacity="0.35"
              />
            );
          })}
          {/* Eave board and ridge */}
          <path
            d={`M ${x - w * 0.26} ${wallTop + w * 0.08} L ${x + w * 0.5} ${wallTop - w * 0.26}
                L ${x + w * 1.26} ${wallTop + w * 0.08}`}
            fill="none"
            stroke={GILT}
            strokeWidth="0.7"
            opacity="0.45"
          />
          <circle cx={x + w * 0.5} cy={wallTop - w * 0.28} r={w * 0.035} fill={GILT} opacity="0.6" />
        </>
      )}
    </g>
  );
}

/**
 * A pati (sattal) — the open public rest house on the edge of a square.
 * No walls at the front, just a brick back and a row of carved timber posts
 * under a tiled roof. Somewhere to sit out of the sun; there is one on almost
 * every corner in Patan.
 */
export function Pati({ x, base, w }: { x: number; base: number; w: number }) {
  const h = w * 0.46;
  const plinth = w * 0.12;
  const top = base - plinth - h;

  return (
    <g>
      {/* Raised plinth you step up onto */}
      <rect x={x - w * 0.04} y={base - plinth} width={w * 1.08} height={plinth} fill="#5d5148" />
      <rect x={x - w * 0.04} y={base - plinth} width={w * 1.08} height={plinth * 0.25} fill="#6e6157" />

      {/* Shaded interior */}
      <rect x={x} y={top} width={w} height={h} fill="#150f19" opacity="0.9" />
      {/* Brick back wall visible between posts */}
      <rect x={x} y={top} width={w} height={h * 0.35} fill={BRICK_DEEP} opacity="0.55" />

      {/* Timber posts */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <g key={f}>
          <rect x={x + w * f - w * 0.022} y={top} width={w * 0.044} height={h} fill={TEAK} />
          {/* Bracket capital */}
          <path
            d={`M ${x + w * f - w * 0.07} ${top} L ${x + w * f + w * 0.07} ${top}
                L ${x + w * f + w * 0.03} ${top + h * 0.14} L ${x + w * f - w * 0.03} ${top + h * 0.14} Z`}
            fill={TEAK}
          />
        </g>
      ))}

      {/* Beam and tiled roof */}
      <rect x={x - w * 0.06} y={top - w * 0.05} width={w * 1.12} height={w * 0.06} fill={CARVE} />
      <path
        d={`M ${x - w * 0.2} ${top - w * 0.04} L ${x + w * 0.5} ${top - w * 0.28}
            L ${x + w * 1.2} ${top - w * 0.04} Z`}
        fill="#6b3b2c"
      />
      <path
        d={`M ${x - w * 0.2} ${top - w * 0.04} L ${x + w * 0.5} ${top - w * 0.28}
            L ${x + w * 1.2} ${top - w * 0.04}`}
        fill="none"
        stroke={GILT}
        strokeWidth="0.6"
        opacity="0.4"
      />
    </g>
  );
}

/**
 * A chaitya — the small votive stupa that sits in the middle of a courtyard,
 * often centuries older than everything around it.
 */
export function Chaitya({ x, base, w }: { x: number; base: number; w: number }) {
  const domeR = w * 0.5;
  const domeY = base - w * 0.2;
  return (
    <g>
      {[0, 1].map((s) => {
        const pw = w * (1.3 - s * 0.22);
        return (
          <rect key={s} x={x - pw / 2} y={base - (s + 1) * (w * 0.1)} width={pw} height={w * 0.11} fill="#8a8177" opacity={0.6 + s * 0.15} />
        );
      })}
      <path d={`M ${x - domeR} ${domeY} a ${domeR} ${domeR * 0.86} 0 0 1 ${domeR * 2} 0 Z`} fill="#d6cfc2" />
      <rect x={x - w * 0.16} y={domeY - domeR * 0.86 - w * 0.18} width={w * 0.32} height={w * 0.18} fill="#e4ddd0" />
      {[-1, 1].map((s) => (
        <circle key={s} cx={x + s * w * 0.07} cy={domeY - domeR * 0.86 - w * 0.1} r={w * 0.022} fill="#1d1524" />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const sw = w * (0.26 - i * 0.03);
        return (
          <rect key={i} x={x - sw / 2} y={domeY - domeR * 0.86 - w * 0.18 - (i + 1) * (w * 0.045)} width={sw} height={w * 0.035} fill={GILT} opacity={0.9 - i * 0.06} />
        );
      })}
      <circle cx={x} cy={domeY - domeR * 0.86 - w * 0.48} r={w * 0.035} fill={GILT} />
    </g>
  );
}

/**
 * The other half of modern Kathmandu: a concrete-frame house, flat roof,
 * painted a colour, rebar left sticking out of the pillars for the storey
 * that gets added whenever there is money for it, plastic water tanks on top.
 */
export function ConcreteHouse({
  x,
  base,
  w,
  storeys = 3,
  tone = 0,
}: {
  x: number;
  base: number;
  w: number;
  storeys?: number;
  tone?: number;
}) {
  const paint = ["#b8956a", "#7f9ba8", "#a8757f", "#9aa87f"];
  const body = paint[tone % paint.length];
  const storeyH = w * 0.44;
  const h = storeyH * storeys;
  const top = base - h;

  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={body} />
      {/* Floor slabs, expressed as they are in a concrete frame */}
      {Array.from({ length: storeys }, (_, i) => (
        <rect key={i} x={x - w * 0.03} y={top + i * storeyH} width={w * 1.06} height={w * 0.045} fill="#cfc7ba" opacity="0.55" />
      ))}

      {/* Windows with security grilles */}
      {Array.from({ length: storeys }, (_, s) =>
        [0.12, 0.56].map((f) => (
          <g key={`${s}-${f}`}>
            <rect x={x + w * f} y={top + s * storeyH + storeyH * 0.26} width={w * 0.32} height={storeyH * 0.42} fill={GILT} opacity={0.22 + (s % 2) * 0.1} />
            <rect x={x + w * f} y={top + s * storeyH + storeyH * 0.26} width={w * 0.32} height={storeyH * 0.42} fill="none" stroke="#e8e2d6" strokeWidth={w * 0.022} />
            {[0.33, 0.66].map((g) => (
              <line
                key={g}
                x1={x + w * (f + 0.32 * g)}
                y1={top + s * storeyH + storeyH * 0.26}
                x2={x + w * (f + 0.32 * g)}
                y2={top + s * storeyH + storeyH * 0.68}
                stroke="#3a3a3a"
                strokeWidth="0.4"
                opacity="0.6"
              />
            ))}
          </g>
        )),
      )}

      {/* Balcony rail on the middle floor */}
      <rect x={x - w * 0.06} y={top + storeyH * 0.86} width={w * 1.12} height={w * 0.035} fill="#cfc7ba" opacity="0.6" />

      {/* Parapet, rebar, water tanks */}
      <rect x={x - w * 0.03} y={top - w * 0.12} width={w * 1.06} height={w * 0.13} fill={body} />
      {[0.06, 0.44, 0.9].map((f) => (
        <line key={f} x1={x + w * f} y1={top - w * 0.12} x2={x + w * f} y2={top - w * 0.3} stroke="#8a8177" strokeWidth={w * 0.02} />
      ))}
      <rect x={x + w * 0.5} y={top - w * 0.36} width={w * 0.3} height={w * 0.24} rx={w * 0.05} fill="#3f6f8e" />
      <rect x={x + w * 0.18} y={top - w * 0.3} width={w * 0.22} height={w * 0.18} rx={w * 0.04} fill="#2f5468" />
    </g>
  );
}

/** A broadleaf tree. The valley's, and her subject. */
export function Tree({
  x,
  base,
  h,
  tint = "#3f6b42",
}: {
  x: number;
  base: number;
  h: number;
  tint?: string;
}) {
  const cw = h * 0.46;
  return (
    <g>
      <path
        d={`M ${x} ${base} L ${x} ${base - h * 0.55}`}
        stroke="#3a2a22"
        strokeWidth={h * 0.07}
        strokeLinecap="round"
      />
      <ellipse cx={x} cy={base - h * 0.72} rx={cw} ry={h * 0.32} fill={tint} />
      <ellipse cx={x - cw * 0.55} cy={base - h * 0.56} rx={cw * 0.6} ry={h * 0.2} fill={tint} opacity="0.9" />
      <ellipse cx={x + cw * 0.55} cy={base - h * 0.58} rx={cw * 0.6} ry={h * 0.2} fill={tint} opacity="0.9" />
    </g>
  );
}

/**
 * Kathmandu University, up the hill at Dhulikhel: the long academic block with
 * its pitched roofs, set against the ridge.
 */
export function KathmanduUniversity({
  x,
  base,
  w,
}: {
  x: number;
  base: number;
  w: number;
}) {
  const h = w * 0.38;
  const wingW = w * 0.3;

  return (
    <g>
      {/* Ridge behind */}
      <path
        d={`M ${x - w * 0.2} ${base} Q ${x + w * 0.3} ${base - h * 1.9} ${x + w * 0.8} ${base - h * 0.7}
            Q ${x + w * 1.1} ${base - h * 0.2} ${x + w * 1.3} ${base} Z`}
        fill="#3a4a3c"
        opacity="0.45"
      />

      {/* Main block */}
      <rect x={x} y={base - h} width={w} height={h} fill={TEAK} opacity="0.9" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x={x + w * 0.06 + i * (w * 0.1)}
          y={base - h * 0.72}
          width={w * 0.055}
          height={h * 0.3}
          fill={GILT}
          opacity={0.2 + (i % 3) * 0.08}
        />
      ))}
      {/* Pitched roof */}
      <path d={`M ${x - w * 0.04} ${base - h} L ${x + w * 0.5} ${base - h * 1.34} L ${x + w * 1.04} ${base - h} Z`} fill={TEAK} />

      {/* Central portico and flagpole */}
      <rect x={x + w * 0.42} y={base - h * 0.5} width={w * 0.16} height={h * 0.5} fill="#2c1f19" />
      <line x1={x + w * 0.5} y1={base - h * 1.34} x2={x + w * 0.5} y2={base - h * 1.72} stroke={GILT} strokeWidth="1" />
      <path d={`M ${x + w * 0.5} ${base - h * 1.72} l ${w * 0.1} ${h * 0.1} l ${-w * 0.1} ${h * 0.1} Z`} fill={BRICK} />

      {/* Wings */}
      {[-1, 1].map((s) => (
        <rect
          key={s}
          x={s < 0 ? x - wingW : x + w}
          y={base - h * 0.7}
          width={wingW}
          height={h * 0.7}
          fill={TEAK}
          opacity="0.75"
        />
      ))}

      <text
        x={x + w * 0.5}
        y={base - h * 0.16}
        textAnchor="middle"
        fontSize={h * 0.26}
        fill={GILT}
        opacity="0.8"
        letterSpacing="2"
      >
        KU
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ *
 * Stupa and prayer flags
 * ------------------------------------------------------------------ */

/**
 * The five colours of a lungta prayer flag string, in their fixed ritual
 * order: sky, air, fire, water, earth. The order is not decorative and is not
 * ours to shuffle, so it is written once here and cycled.
 */
export const LUNGTA = ["#2f6fd0", "#f4f2ec", "#d8332a", "#1f9c4a", "#f0c020"];

/**
 * One strung line of prayer flags, drawn INSIDE a scene's own SVG so it scales
 * with the buildings instead of being stretched on its own.
 *
 * The line is a shallow V: it leaves both edges at the same height, so when
 * the panel repeats, the rope continues across the seam. Several of these at
 * different heights and depths cross each other the way they do over a real
 * street, where every rooftop has three or four tied off to it.
 */
export function FlagLine({
  w,
  /** Rope height at both edges — equal, or the loop would show a step. */
  yEdge,
  /** Rope height at mid-span; below yEdge for a sag, above it for a peak. */
  yMid,
  count = 26,
  flagW = 13,
  flagH = 17,
  /** Colour to start the cycle on, so stacked lines do not align. */
  offset = 0,
  opacity = 1,
}: {
  w: number;
  yEdge: number;
  yMid: number;
  count?: number;
  flagW?: number;
  flagH?: number;
  offset?: number;
  opacity?: number;
}) {
  // Triangular interpolation: peaks/sags at mid-span, equal at both ends.
  const yAt = (t: number) => yEdge + (yMid - yEdge) * (1 - Math.abs(2 * t - 1));

  // Rope, sampled rather than curved so it visibly kinks at the tie point.
  const rope = Array.from({ length: 25 }, (_, i) => {
    const t = i / 24;
    return `${i === 0 ? "M" : "L"} ${(t * w).toFixed(2)} ${yAt(t).toFixed(2)}`;
  }).join(" ");

  const flags = Array.from({ length: count }, (_, i) => {
    const t = (i + 0.5) / count;
    return {
      x: Number((t * w).toFixed(2)),
      y: Number(yAt(t).toFixed(2)),
      fill: LUNGTA[(i + offset) % LUNGTA.length],
      delay: (i % 6) * 0.37,
    };
  });

  return (
    <g opacity={opacity}>
      <path d={rope} fill="none" stroke="#d8cfc0" strokeWidth="0.7" opacity="0.5" />

      {flags.map((f, i) => (
        <g key={i} transform={`translate(${f.x} ${f.y})`}>
          <g>
            {/*
             * Hung from the top edge, hanging straight down, with the free
             * corner lifted — cotton that has been out in the weather, not a
             * rigid rectangle.
             */}
            <path
              d={`M ${-flagW / 2} 0 L ${flagW / 2} 0 L ${flagW / 2} ${flagH * 0.88}
                  q ${-flagW * 0.5} ${flagH * 0.2} ${-flagW} 0 Z`}
              fill={f.fill}
            />
            {/* Woodblock printing, suggested rather than legible at this size */}
            <rect x={-flagW * 0.26} y={flagH * 0.26} width={flagW * 0.52} height={flagH * 0.07} fill="#2a2233" opacity="0.28" />
            <rect x={-flagW * 0.2} y={flagH * 0.46} width={flagW * 0.4} height={flagH * 0.06} fill="#2a2233" opacity="0.22" />

            <animateTransform
              attributeName="transform"
              type="rotate"
              values="-4;4;-4"
              dur="4.6s"
              begin={`${f.delay}s`}
              repeatCount="indefinite"
            />
          </g>
        </g>
      ))}
    </g>
  );
}

/**
 * Boudha / Swayambhu: the whitewashed dome, the harmika carrying the Buddha
 * eyes on each face, and the thirteen gilt steps to enlightenment above it.
 *
 * The "nose" between the eyes is the Devanagari ek — the numeral one — for
 * unity; it is drawn as that character, not as a nose.
 */
export function Stupa({
  x,
  base,
  w,
}: {
  /** Centre line. */
  x: number;
  base: number;
  /** Width of the dome. */
  w: number;
}) {
  const domeR = w * 0.5;
  const domeY = base - w * 0.22;
  // Wide harmika. Narrower, the white block with two dark eyes stops reading
  // as a face at small sizes and starts reading as a skull.
  const harmikaW = w * 0.46;
  const harmikaY = domeY - domeR * 0.92;
  const harmikaH = w * 0.26;
  /** Top of the harmika — the steps rise directly from here, with no gap. */
  const spireTop = harmikaY - harmikaH;
  const stepH = w * 0.032;

  return (
    <g>
      {/* Stepped terraces */}
      {[0, 1, 2].map((s) => {
        const tw = w * (1.25 - s * 0.16);
        return (
          <rect
            key={s}
            x={x - tw / 2}
            y={base - (s + 1) * (w * 0.075)}
            width={tw}
            height={w * 0.08}
            fill="#d8d2c6"
            opacity={0.5 + s * 0.12}
          />
        );
      })}

      {/* Dome */}
      <path
        d={`M ${x - domeR} ${domeY} a ${domeR} ${domeR * 0.92} 0 0 1 ${domeR * 2} 0 Z`}
        fill="#ece7dc"
      />
      {/* Saffron wash — the paint thrown up the dome in petals */}
      <path
        d={`M ${x - domeR} ${domeY} a ${domeR} ${domeR * 0.92} 0 0 1 ${domeR * 2} 0 Z`}
        fill="var(--color-seal-marigold)"
        opacity="0.18"
      />

      {/* Harmika, with the eyes */}
      <rect x={x - harmikaW / 2} y={harmikaY - harmikaH} width={harmikaW} height={harmikaH} fill="#e6e0d3" />
      <rect
        x={x - harmikaW / 2}
        y={harmikaY - harmikaH}
        width={harmikaW}
        height={harmikaH}
        fill="none"
        stroke={GILT}
        strokeWidth="0.6"
        opacity="0.7"
      />
      <g fill="#1d1524">
        {/* Eyes: half-lidded almonds, heavy line on the upper lid — the shape
            is what makes them read as the Buddha's rather than as sockets. */}
        {[-1, 1].map((s) => {
          const ex = x + s * harmikaW * 0.24;
          const ey = harmikaY - harmikaH * 0.6;
          const er = harmikaW * 0.115;
          return (
            <g key={s}>
              <path
                d={`M ${ex - er} ${ey} q ${er} ${-harmikaW * 0.085} ${er * 2} 0
                    q ${-er} ${harmikaW * 0.055} ${-er * 2} 0 Z`}
              />
              <path
                d={`M ${ex - er * 1.15} ${ey - harmikaW * 0.012} q ${er * 1.15} ${-harmikaW * 0.075} ${er * 2.3} 0`}
                fill="none"
                stroke="#1d1524"
                strokeWidth={harmikaW * 0.035}
                strokeLinecap="round"
              />
            </g>
          );
        })}
        {/* The ek, and the urna above it */}
        <path
          d={`M ${x - harmikaW * 0.05} ${harmikaY - harmikaH * 0.42}
              q ${harmikaW * 0.09} ${-harmikaW * 0.04} ${harmikaW * 0.1} ${harmikaW * 0.02}
              l ${-harmikaW * 0.03} ${harmikaW * 0.14}`}
          fill="none"
          stroke="#1d1524"
          strokeWidth={harmikaW * 0.05}
          strokeLinecap="round"
        />
      </g>
      <circle cx={x} cy={harmikaY - harmikaH * 0.82} r={harmikaW * 0.035} fill="var(--color-seal-marigold)" />

      {/* Thirteen gilt steps, rising straight off the harmika */}
      {Array.from({ length: 13 }, (_, i) => {
        const sw = harmikaW * (0.78 - i * 0.045);
        return (
          <rect
            key={i}
            x={x - sw / 2}
            y={spireTop - (i + 1) * stepH}
            width={sw}
            height={stepH * 0.82}
            fill={GILT}
            opacity={0.9 - i * 0.022}
          />
        );
      })}

      {/* Parasol and finial */}
      <ellipse cx={x} cy={spireTop - 13 * stepH - w * 0.01} rx={harmikaW * 0.26} ry={w * 0.026} fill={GILT} opacity="0.85" />
      <circle cx={x} cy={spireTop - 13 * stepH - w * 0.06} r={w * 0.026} fill={GILT} />
    </g>
  );
}

/**
 * Pimbahal pond, with someone sat on the bank fishing.
 *
 * The fieldwork half of an environmental science degree, and the pond the
 * neighbourhood is named for. Animated with SMIL rather than CSS because the
 * moving parts are SVG geometry inside a shared symbol — the float bobs, the
 * ripples spread, and a fish breaks the surface every few seconds.
 */
export function PimbahalPond({
  x,
  base,
  w,
}: {
  x: number;
  base: number;
  w: number;
}) {
  const waterY = base - w * 0.06;
  const rodTipX = x + w * 0.46;
  const rodTipY = base - w * 0.34;
  const floatX = x + w * 0.66;

  return (
    <g>
      {/* Water. Kept well lighter than the ground around it — at frieze scale a
          dark pond just reads as a hole in the strip. */}
      <ellipse cx={x + w * 0.5} cy={waterY} rx={w * 0.5} ry={w * 0.11} fill="#4a7f9e" opacity="0.9" />
      <ellipse cx={x + w * 0.42} cy={waterY - w * 0.02} rx={w * 0.3} ry={w * 0.04} fill="#79b3ca" opacity="0.4" />
      <ellipse cx={x + w * 0.5} cy={waterY} rx={w * 0.5} ry={w * 0.11} fill="none" stroke={GILT} strokeWidth="0.7" opacity="0.45" />

      {/* Stone bank */}
      <rect x={x - w * 0.04} y={base - w * 0.04} width={w * 1.08} height={w * 0.04} fill={BRICK} opacity="0.5" />

      {/* Ripples spreading from the float */}
      {[0, 1.6, 3.2].map((delay) => (
        <ellipse
          key={delay}
          cx={floatX}
          cy={waterY + w * 0.02}
          rx="1"
          ry="0.4"
          fill="none"
          stroke={GILT}
          strokeWidth="0.4"
        >
          <animate attributeName="rx" values="1;14;1" dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="ry" values="0.4;5;0.4" dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" values="0.5;0;0.5" dur="4.8s" begin={`${delay}s`} repeatCount="indefinite" />
        </ellipse>
      ))}

      {/* Her, sat on the bank */}
      <g fill="var(--color-plum-2)">
        {/* legs out toward the water */}
        <rect x={x + w * 0.2} y={base - w * 0.1} width={w * 0.16} height={w * 0.05} rx={w * 0.02} />
        {/* body */}
        <path
          d={`M ${x + w * 0.16} ${base - w * 0.09} L ${x + w * 0.19} ${base - w * 0.26}
              L ${x + w * 0.26} ${base - w * 0.26} L ${x + w * 0.25} ${base - w * 0.09} Z`}
        />
        {/* head */}
        <circle cx={x + w * 0.225} cy={base - w * 0.3} r={w * 0.042} />
        {/* hair, tied back */}
        <path
          d={`M ${x + w * 0.19} ${base - w * 0.32} q ${w * 0.035} ${-w * 0.05} ${w * 0.07} 0
              q ${-w * 0.01} ${w * 0.05} ${-w * 0.035} ${w * 0.03} Z`}
          fill="#1d1524"
        />
        {/* arm holding the rod */}
        <path
          d={`M ${x + w * 0.25} ${base - w * 0.23} L ${x + w * 0.33} ${base - w * 0.27}`}
          stroke="var(--color-plum-2)"
          strokeWidth={w * 0.028}
          strokeLinecap="round"
        />
      </g>

      {/* Rod and line */}
      <path
        d={`M ${x + w * 0.3} ${base - w * 0.24} L ${rodTipX} ${rodTipY}`}
        stroke={TEAK}
        strokeWidth={w * 0.016}
        strokeLinecap="round"
      />
      <path
        d={`M ${rodTipX} ${rodTipY} Q ${(rodTipX + floatX) / 2} ${rodTipY - w * 0.02} ${floatX} ${waterY + w * 0.01}`}
        fill="none"
        stroke={GILT}
        strokeWidth="0.4"
        opacity="0.55"
      />

      {/* Float, bobbing */}
      <g>
        <circle cx={floatX} cy={waterY + w * 0.01} r={w * 0.018} fill={BRICK} />
        <animateTransform
          attributeName="transform"
          type="translate"
          values={`0 0; 0 ${w * 0.018}; 0 0`}
          dur="2.4s"
          repeatCount="indefinite"
        />
      </g>

      {/* A fish, breaking the surface now and then */}
      <g opacity="0">
        <path
          d={`M 0 0 q ${w * 0.03} ${-w * 0.02} ${w * 0.06} 0 q ${-w * 0.03} ${w * 0.02} ${-w * 0.06} 0 Z`}
          fill="var(--color-seal-sky)"
        />
        <animateMotion
          dur="7s"
          repeatCount="indefinite"
          keyPoints="0;0;1;1"
          keyTimes="0;0.62;0.82;1"
          calcMode="linear"
          path={`M ${x + w * 0.78} ${waterY} q ${w * 0.06} ${-w * 0.12} ${w * 0.12} 0`}
        />
        <animate
          attributeName="opacity"
          values="0;0;1;1;0;0"
          keyTimes="0;0.62;0.66;0.78;0.82;1"
          dur="7s"
          repeatCount="indefinite"
        />
      </g>
    </g>
  );
}

/**
 * A Mayur — the long-distance bus, painted to within an inch of its life,
 * luggage piled on the roof rack. Faces right, so it drives left to right.
 */
export function MayurBus({
  className = "",
  width = 132,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 96"
      width={width}
      height={(width * 96) / 200}
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      {/* Roof rack and luggage */}
      <rect x="34" y="22" width="120" height="4" rx="1.5" fill="#2c1f19" />
      <rect x="44" y="10" width="26" height="12" rx="2" fill={BRICK} opacity="0.9" />
      <rect x="76" y="13" width="20" height="9" rx="2" fill="var(--color-moss)" opacity="0.85" />
      <rect x="104" y="8" width="30" height="14" rx="2" fill="var(--color-seal-marigold)" opacity="0.8" />

      {/* Body */}
      <path
        d="M 20 26 L 176 26 Q 186 26 186 38 L 186 68 Q 186 74 180 74 L 22 74 Q 16 74 16 66 L 16 34 Q 16 26 20 26 Z"
        fill="var(--color-seal-sky)"
      />
      {/* Painted bands — the livery */}
      <rect x="16" y="44" width="170" height="6" fill="var(--color-seal-marigold)" opacity="0.95" />
      <rect x="16" y="50" width="170" height="4" fill={BRICK} opacity="0.9" />

      {/* Peacock tail sweep on the flank — mayur means peacock */}
      <path
        d="M 40 70 Q 62 52 96 48 Q 74 60 66 70 Z"
        fill="var(--color-moss)"
        opacity="0.75"
      />
      {[52, 64, 76].map((cx, i) => (
        <circle key={cx} cx={cx} cy={64 - i * 4} r="2.4" fill={GILT} opacity="0.85" />
      ))}

      {/* Windows */}
      {[30, 56, 82, 108, 134].map((x) => (
        <rect key={x} x={x} y={31} width={22} height={11} rx="2" fill="var(--color-night)" opacity="0.55" />
      ))}
      {/* Windscreen */}
      <path d="M 162 31 L 180 31 Q 184 31 184 38 L 184 42 L 162 42 Z" fill="var(--color-night)" opacity="0.6" />

      {/* Destination board */}
      <rect x="60" y="56" width="72" height="12" rx="2" fill="var(--color-parchment)" opacity="0.9" />
      <text x="96" y="65.5" textAnchor="middle" fontSize="9" fill="var(--color-ink)" letterSpacing="1.5">
        MAYUR
      </text>

      {/* Wheels */}
      {[52, 152].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="76" r="11" fill="var(--color-night)" />
          <circle cx={cx} cy="76" r="4.5" fill={GILT} opacity="0.5" />
        </g>
      ))}

      {/* Headlamp */}
      <circle cx="182" cy="62" r="3.4" fill={GILT} opacity="0.9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * The other street: where she is now
 * ------------------------------------------------------------------ */

/** A British terraced house — sash windows, bay front, chimney pots. */
export function TerraceHouse({
  x,
  base,
  w,
  tone = "#7c4a3e",
}: {
  x: number;
  base: number;
  w: number;
  tone?: string;
}) {
  const h = w * 1.34;
  const top = base - h;

  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={tone} />
      {/* Brick courses */}
      {Array.from({ length: Math.round(h / (w * 0.11)) }, (_, i) => (
        <line
          key={i}
          x1={x}
          y1={top + (i + 1) * (w * 0.11)}
          x2={x + w}
          y2={top + (i + 1) * (w * 0.11)}
          stroke="#000"
          strokeWidth="0.3"
          opacity="0.18"
        />
      ))}

      {/* Slate roof and parapet */}
      <rect x={x - w * 0.05} y={top - w * 0.07} width={w * 1.1} height={w * 0.09} fill="#38303a" />
      {/* Chimney and pots */}
      <rect x={x + w * 0.66} y={top - w * 0.34} width={w * 0.2} height={w * 0.3} fill="#6a4035" />
      {[0.7, 0.79].map((f) => (
        <rect key={f} x={x + w * f} y={top - w * 0.44} width={w * 0.055} height={w * 0.11} fill="#4a3a33" />
      ))}

      {/* Upstairs sash windows */}
      {[0.14, 0.56].map((f) => (
        <g key={f}>
          <rect x={x + w * f} y={top + h * 0.16} width={w * 0.3} height={h * 0.2} fill={GILT} opacity="0.3" />
          <rect
            x={x + w * f}
            y={top + h * 0.16}
            width={w * 0.3}
            height={h * 0.2}
            fill="none"
            stroke="#efeae2"
            strokeWidth={w * 0.035}
          />
          <line
            x1={x + w * f}
            y1={top + h * 0.26}
            x2={x + w * f + w * 0.3}
            y2={top + h * 0.26}
            stroke="#efeae2"
            strokeWidth={w * 0.03}
          />
        </g>
      ))}

      {/* Bay window below */}
      <rect x={x + w * 0.08} y={top + h * 0.5} width={w * 0.46} height={h * 0.32} fill={GILT} opacity="0.34" />
      <rect
        x={x + w * 0.08}
        y={top + h * 0.5}
        width={w * 0.46}
        height={h * 0.32}
        fill="none"
        stroke="#efeae2"
        strokeWidth={w * 0.04}
      />

      {/* Front door with fanlight */}
      <rect x={x + w * 0.64} y={top + h * 0.56} width={w * 0.24} height={h * 0.44} fill="#2c4a3a" />
      <rect x={x + w * 0.64} y={top + h * 0.56} width={w * 0.24} height={h * 0.07} fill={GILT} opacity="0.45" />
      <circle cx={x + w * 0.85} cy={top + h * 0.78} r={w * 0.022} fill={GILT} opacity="0.8" />
    </g>
  );
}

/** A K6 telephone box. */
export function PhoneBox({ x, base, h }: { x: number; base: number; h: number }) {
  const w = h * 0.42;
  return (
    <g>
      <rect x={x - w / 2} y={base - h} width={w} height={h} rx={w * 0.06} fill="#b8332b" />
      <rect x={x - w / 2} y={base - h} width={w} height={h * 0.1} rx={w * 0.06} fill="#9c2a23" />
      <path d={`M ${x - w * 0.56} ${base - h} q ${w * 0.56} ${-h * 0.1} ${w * 1.12} 0 Z`} fill="#9c2a23" />
      {/* Glazing */}
      {[0.16, 0.38, 0.6].map((f) => (
        <rect key={f} x={x - w * 0.3} y={base - h * (1 - f)} width={w * 0.6} height={h * 0.17} fill={GILT} opacity="0.28" />
      ))}
      <circle cx={x} cy={base - h - h * 0.05} r={w * 0.09} fill={GILT} opacity="0.8" />
    </g>
  );
}

/** A Victorian cast-iron street lamp, lit. */
export function Streetlamp({ x, base, h }: { x: number; base: number; h: number }) {
  return (
    <g>
      <rect x={x - h * 0.02} y={base - h} width={h * 0.04} height={h} fill="#2f2a33" />
      <rect x={x - h * 0.05} y={base - h * 0.06} width={h * 0.1} height={h * 0.06} fill="#2f2a33" />
      <path d={`M ${x - h * 0.07} ${base - h} L ${x} ${base - h * 1.1} L ${x + h * 0.07} ${base - h} Z`} fill="#2f2a33" />
      <circle cx={x} cy={base - h * 0.99} r={h * 0.05} fill={GILT} opacity="0.9" />
      <circle cx={x} cy={base - h * 0.99} r={h * 0.11} fill={GILT} opacity="0.18" />
    </g>
  );
}

/** A compact Elizabeth Tower, for the street-level strip. */
export function ClockTower({ x, base, w }: { x: number; base: number; w: number }) {
  const h = w * 3.6;
  return (
    <g>
      <rect x={x - w / 2} y={base - h} width={w} height={h} fill="#7a5a3c" />
      {Array.from({ length: 5 }, (_, i) => (
        <rect key={i} x={x - w * 0.3} y={base - h * (0.2 + i * 0.12)} width={w * 0.6} height={h * 0.05} fill={GILT} opacity="0.16" />
      ))}
      <rect x={x - w * 0.58} y={base - h * 0.78} width={w * 1.16} height={w * 0.16} fill="#6a4c33" />
      {/* Clock face */}
      <circle cx={x} cy={base - h * 0.86} r={w * 0.36} fill="var(--color-parchment)" opacity="0.95" />
      <circle cx={x} cy={base - h * 0.86} r={w * 0.36} fill="none" stroke={GILT} strokeWidth={w * 0.06} />
      <line x1={x} y1={base - h * 0.86} x2={x} y2={base - h * 0.86 - w * 0.24} stroke="var(--color-ink)" strokeWidth={w * 0.05} strokeLinecap="round" />
      <line x1={x} y1={base - h * 0.86} x2={x + w * 0.18} y2={base - h * 0.86 + w * 0.08} stroke="var(--color-ink)" strokeWidth={w * 0.045} strokeLinecap="round" />
      {/* Spire */}
      <path d={`M ${x - w * 0.5} ${base - h} L ${x} ${base - h * 1.3} L ${x + w * 0.5} ${base - h} Z`} fill="#6a4c33" />
      <line x1={x} y1={base - h * 1.3} x2={x} y2={base - h * 1.4} stroke={GILT} strokeWidth={w * 0.05} />
      <circle cx={x} cy={base - h * 1.41} r={w * 0.08} fill={GILT} />
    </g>
  );
}

/** The other bus, for the other street. */
export function Routemaster({
  className = "",
  width = 112,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <svg
      viewBox="0 0 200 110"
      width={width}
      height={(width * 110) / 200}
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      <path
        d="M 14 14 L 174 14 Q 186 14 186 28 L 186 84 Q 186 90 180 90 L 20 90 Q 14 90 14 82 Z"
        fill="#b8332b"
      />
      {/* Upper deck windows */}
      {[24, 52, 80, 108, 136].map((wx) => (
        <rect key={wx} x={wx} y={22} width={24} height={18} rx="2" fill="var(--color-night)" opacity="0.5" />
      ))}
      {/* Lower deck windows */}
      {[24, 52, 80, 108].map((wx) => (
        <rect key={`l${wx}`} x={wx} y={54} width={24} height={16} rx="2" fill="var(--color-night)" opacity="0.5" />
      ))}
      {/* Open rear platform */}
      <rect x={150} y={52} width={30} height={30} fill="var(--color-night)" opacity="0.35" />
      {/* Route blind */}
      <rect x={20} y={17} width={54} height={9} rx="1.5" fill="var(--color-parchment)" opacity="0.9" />
      <text x={47} y={24.5} textAnchor="middle" fontSize="7" fill="var(--color-ink)">
        88 PIMBAHAL
      </text>
      <rect x={14} y={44} width={172} height="4" fill={GILT} opacity="0.35" />
      {[46, 156].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="92" r="11" fill="var(--color-night)" />
          <circle cx={cx} cy="92" r="4.5" fill={GILT} opacity="0.45" />
        </g>
      ))}
      <circle cx="182" cy="78" r="3.2" fill={GILT} opacity="0.9" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * The plane
 * ------------------------------------------------------------------ */

/** Top-down airliner, nose pointing along +x so `rotate="auto"` aims it. */
export const PLANE_PATH =
  "M 0,-1.4 L 9,-1.4 L 12,0 L 9,1.4 L 0,1.4 L -4,5.5 L -6.5,5.5 L -4.6,1.4 L -8.5,1.4 L -10.5,3.6 L -12,3.6 L -11,0 L -12,-3.6 L -10.5,-3.6 L -8.5,-1.4 L -4.6,-1.4 L -6.5,-5.5 L -4,-5.5 Z";

export function Plane({
  className = "",
  size = 34,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      viewBox="-14 -8 28 16"
      width={size}
      height={(size * 16) / 28}
      className={`pointer-events-none ${className}`}
      aria-hidden
    >
      <path d={PLANE_PATH} fill={GILT} />
    </svg>
  );
}

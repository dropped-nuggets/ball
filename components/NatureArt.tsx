/**
 * Hand-drawn species art — flat, rounded, deliberately cute.
 *
 * All inline SVG on a 100x100 grid so they scale anywhere and need no image
 * requests, and so they inherit the page's colour tokens.
 */

type ArtProps = { size?: number; className?: string };

const wrap = (size: number, className: string, children: React.ReactNode) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-hidden
  >
    {children}
  </svg>
);

/** Himalayan Monal — iridescent crest, round body. */
function Monal({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <ellipse cx="52" cy="62" rx="26" ry="22" fill="#3f7fa8" />
      <ellipse cx="52" cy="66" rx="18" ry="15" fill="#e8a33d" opacity="0.9" />
      <circle cx="36" cy="42" r="15" fill="#4a9d7a" />
      {/* Crest feathers */}
      {[-28, -14, 0].map((a, i) => (
        <g key={i} transform={`rotate(${a} 34 30)`}>
          <rect x="32.5" y="16" width="2.4" height="14" rx="1.2" fill="#6fb8d9" />
          <circle cx="33.7" cy="15" r="2.6" fill="#9b6fd4" />
        </g>
      ))}
      {/* Tail */}
      <path d="M76 60 Q 94 54 96 70 Q 88 72 76 70 Z" fill="#b5654a" />
      {/* Beak + eye */}
      <path d="M22 42 L 12 46 L 22 49 Z" fill="#e8c07a" />
      <circle cx="30" cy="39" r="2.6" fill="#17111f" />
      <circle cx="31" cy="38.2" r="0.9" fill="#fff" />
      {/* Feet */}
      <rect x="44" y="82" width="3" height="8" rx="1.5" fill="#e8c07a" />
      <rect x="58" y="82" width="3" height="8" rx="1.5" fill="#e8c07a" />
    </>,
  );
}

/** Red Panda — round face, ringed tail. */
function RedPanda({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      {/* Tail with rings */}
      <path
        d="M74 68 Q 96 66 92 84 Q 84 92 72 82 Z"
        fill="#b5654a"
      />
      <path d="M84 70 q 6 3 5 9" stroke="#5e3a2a" strokeWidth="3.5" fill="none" />
      <ellipse cx="48" cy="66" rx="24" ry="20" fill="#c9704f" />
      {/* Ears */}
      <circle cx="30" cy="34" r="9" fill="#c9704f" />
      <circle cx="66" cy="34" r="9" fill="#c9704f" />
      <circle cx="30" cy="35" r="5" fill="#f4ece2" />
      <circle cx="66" cy="35" r="5" fill="#f4ece2" />
      {/* Face */}
      <circle cx="48" cy="44" r="20" fill="#d4835f" />
      <path d="M32 44 a 16 16 0 0 1 32 0 a 16 16 0 0 1 -32 0" fill="#f4ece2" opacity="0.55" />
      {/* Cheek patches */}
      <circle cx="36" cy="50" r="7" fill="#f7f1e8" />
      <circle cx="60" cy="50" r="7" fill="#f7f1e8" />
      {/* Eyes + nose */}
      <circle cx="40" cy="43" r="3.2" fill="#17111f" />
      <circle cx="56" cy="43" r="3.2" fill="#17111f" />
      <circle cx="41" cy="42" r="1.1" fill="#fff" />
      <circle cx="57" cy="42" r="1.1" fill="#fff" />
      <path d="M45 51 h 6 l -3 3.5 Z" fill="#17111f" />
    </>,
  );
}

/** Laligurans — clustered rhododendron bloom. */
function Laligurans({ size = 72, className = "" }: ArtProps) {
  const petals = [0, 72, 144, 216, 288];
  return wrap(
    size,
    className,
    <>
      <path d="M50 96 L 50 58" stroke="#5d7d4a" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 78 q -14 -4 -18 -16 q 14 0 18 12 Z" fill="#5d7d4a" />
      <path d="M50 88 q 14 -4 18 -16 q -14 0 -18 12 Z" fill="#6e9158" />
      {/* Outer bloom cluster */}
      {[
        [34, 40],
        [66, 40],
        [50, 26],
      ].map(([cx, cy], i) => (
        <g key={i}>
          {petals.map((a) => (
            <ellipse
              key={a}
              cx={cx}
              cy={cy - 8}
              rx="5.5"
              ry="8"
              fill={i === 2 ? "#e0536f" : "#d0455f"}
              transform={`rotate(${a} ${cx} ${cy})`}
            />
          ))}
          <circle cx={cx} cy={cy} r="3.4" fill="#f6d98a" />
        </g>
      ))}
      {/* Front bloom */}
      {petals.map((a) => (
        <ellipse
          key={a}
          cx="50"
          cy="38"
          rx="7"
          ry="10"
          fill="#e8617c"
          transform={`rotate(${a} 50 46)`}
        />
      ))}
      <circle cx="50" cy="46" r="4.4" fill="#f6d98a" />
    </>,
  );
}

/** Snow Leopard — pale coat, rosettes, huge tail. */
function SnowLeopard({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <path
        d="M72 70 Q 96 70 94 50 Q 86 46 80 58 Q 76 66 70 64 Z"
        fill="#c9d4e2"
      />
      <ellipse cx="50" cy="68" rx="24" ry="19" fill="#dbe4ef" />
      {/* Rosettes */}
      {[
        [38, 64],
        [52, 72],
        [62, 62],
        [46, 58],
      ].map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="4"
          fill="none"
          stroke="#8c99ab"
          strokeWidth="1.6"
        />
      ))}
      {/* Ears */}
      <path d="M32 30 l 3 -12 l 10 8 Z" fill="#c9d4e2" />
      <path d="M68 30 l -3 -12 l -10 8 Z" fill="#c9d4e2" />
      <circle cx="50" cy="40" r="20" fill="#eaf0f7" />
      {/* Eyes */}
      <ellipse cx="42" cy="38" rx="3.4" ry="4" fill="#5e7a3f" />
      <ellipse cx="58" cy="38" rx="3.4" ry="4" fill="#5e7a3f" />
      <ellipse cx="42" cy="38" rx="1.2" ry="3.4" fill="#17111f" />
      <ellipse cx="58" cy="38" rx="1.2" ry="3.4" fill="#17111f" />
      {/* Muzzle */}
      <ellipse cx="50" cy="49" rx="10" ry="7" fill="#fff" />
      <path d="M47 47 h 6 l -3 3 Z" fill="#c98b9a" />
      <path d="M50 50 v 4 M50 54 q -4 3 -7 1 M50 54 q 4 3 7 1" stroke="#8c99ab" strokeWidth="1.3" fill="none" strokeLinecap="round" />
    </>,
  );
}

/** One-horned Rhino — folded plates, single horn. */
function Rhino({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <ellipse cx="52" cy="60" rx="30" ry="21" fill="#8b8f9e" />
      {/* Skin folds */}
      <path d="M44 42 q 2 18 0 36 M62 44 q 3 16 0 32" stroke="#6d7180" strokeWidth="2.4" fill="none" />
      <ellipse cx="26" cy="52" rx="17" ry="14" fill="#9aa0ae" />
      {/* Horn */}
      <path d="M14 44 q 2 -13 8 -5 q -2 5 -3 8 Z" fill="#e0d6c4" />
      {/* Ear */}
      <ellipse cx="34" cy="38" rx="4" ry="6" fill="#7d8291" />
      <circle cx="22" cy="50" r="2.4" fill="#17111f" />
      <circle cx="22.8" cy="49.3" r="0.8" fill="#fff" />
      {/* Legs */}
      {[36, 50, 64, 76].map((x, i) => (
        <rect key={i} x={x} y="76" width="8" height="14" rx="3" fill="#7d8291" />
      ))}
      {/* Tail */}
      <path d="M82 54 q 8 4 5 12" stroke="#7d8291" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>,
  );
}

/** Sal Tree — broad canopy, straight trunk. */
function SalTree({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <rect x="45" y="52" width="10" height="42" rx="3" fill="#6b4a3a" />
      <path d="M50 72 l -12 -10 M50 62 l 12 -9" stroke="#6b4a3a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="36" r="24" fill="#4f7a3c" />
      <circle cx="30" cy="46" r="15" fill="#5d8c47" />
      <circle cx="70" cy="46" r="15" fill="#5d8c47" />
      <circle cx="42" cy="26" r="13" fill="#6b9c53" />
      <circle cx="62" cy="30" r="12" fill="#6b9c53" />
      {/* Leaf highlights */}
      {[
        [40, 40],
        [58, 44],
        [50, 28],
        [66, 36],
      ].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="3.5" ry="5.5" fill="#8bbd6d" opacity="0.75" transform={`rotate(${i * 35} ${cx} ${cy})`} />
      ))}
    </>,
  );
}

/** Yak — shaggy coat, curved horns. */
function Yak({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <ellipse cx="54" cy="56" rx="28" ry="20" fill="#4a3a3f" />
      {/* Shaggy skirt */}
      <path
        d="M26 62 q 6 16 12 4 q 6 16 12 4 q 6 16 12 4 q 6 14 12 2 l 0 -14 Z"
        fill="#3a2d31"
      />
      <ellipse cx="28" cy="48" rx="15" ry="13" fill="#5a4750" />
      {/* Horns */}
      <path d="M18 36 q -10 -8 -14 2 q 6 2 9 -1" fill="#e0d6c4" />
      <path d="M38 34 q 8 -10 16 -1 q -6 3 -10 1" fill="#e0d6c4" />
      <circle cx="24" cy="46" r="2.4" fill="#17111f" />
      <circle cx="24.8" cy="45.3" r="0.8" fill="#fff" />
      <ellipse cx="18" cy="54" rx="6" ry="4.5" fill="#8a7078" />
      {/* Legs */}
      {[40, 54, 68].map((x, i) => (
        <rect key={i} x={x} y="72" width="8" height="18" rx="3" fill="#3a2d31" />
      ))}
      {/* Tail tuft */}
      <path d="M82 50 q 10 6 6 16" stroke="#3a2d31" strokeWidth="5" fill="none" strokeLinecap="round" />
    </>,
  );
}

/** Sungabha — hanging golden orchid spray. */
function Orchid({ size = 72, className = "" }: ArtProps) {
  return wrap(
    size,
    className,
    <>
      <path d="M50 8 q 4 30 -4 52" stroke="#5d7d4a" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M48 30 q -16 -2 -22 -14 q 16 -2 22 10 Z" fill="#5d7d4a" />
      {[
        [38, 42, 0.95],
        [58, 50, 1],
        [42, 62, 0.9],
        [56, 74, 0.85],
      ].map(([cx, cy, s], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${s})`}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse
              key={a}
              cx="0"
              cy="-7"
              rx="4"
              ry="6.5"
              fill="#f0c24f"
              transform={`rotate(${a})`}
            />
          ))}
          <circle cx="0" cy="0" r="3.2" fill="#b5654a" />
        </g>
      ))}
    </>,
  );
}

const ART: Record<string, (p: ArtProps) => React.JSX.Element> = {
  monal: Monal,
  redpanda: RedPanda,
  laligurans: Laligurans,
  snowleopard: SnowLeopard,
  rhino: Rhino,
  sal: SalTree,
  yak: Yak,
  orchid: Orchid,
};

export default function NatureArt({
  id,
  size = 72,
  className = "",
}: {
  id: string;
} & ArtProps) {
  const Art = ART[id];
  if (!Art) return null;
  return <Art size={size} className={className} />;
}

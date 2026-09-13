import type { ReactNode } from "react";
import { Leaves } from "./Motes";
import {
  Chaitya,
  ClockTower,
  ConcreteHouse,
  FlagLine,
  KathmanduUniversity,
  MayurBus,
  NewariHouse,
  Pagoda,
  Pati,
  PhoneBox,
  PimbahalPond,
  Routemaster,
  Shikhara,
  Streetlamp,
  Stupa,
  TerraceHouse,
  Tree,
} from "./Scenery";

/**
 * A strip of scenery running full-bleed across the top of a page, with
 * something driving through it and a string hung over it.
 *
 * Four scenes, so a section gets the one that belongs to it rather than every
 * page opening on the same picture: the valley, the forest, festival night in
 * the square, and the street she actually lives on now.
 *
 * Each scene is one fixed-width panel repeated twice and slid left by exactly
 * its own width. Every panel's right edge is composed to continue into its own
 * left edge — matching trees, matching ground — so the wrap has no seam.
 */

/** Panel width in user units — must match the translate in `frieze-scroll`. */
const W = 1200;
const GROUND = 160;

export type FriezeVariant = "valley" | "jungle" | "festival" | "uk";

/* ------------------------------------------------------------------ *
 * Scenes
 * ------------------------------------------------------------------ */

/** Home: forest, the lanes, the pond, Durbar Square, Boudha, the campus. */
function ValleyPanel() {
  return (
    <>
      <Tree x={26} base={GROUND} h={74} tint="#35583a" />
      <Tree x={72} base={GROUND} h={92} />
      <Tree x={122} base={GROUND} h={66} tint="#2f4f35" />

      {/* The lane: a shop, a tall house, a flat-fronted one, a pati */}
      <NewariHouse x={160} base={GROUND} w={44} storeys={3} tone={0} ground="shop" />
      <NewariHouse x={218} base={GROUND} w={36} storeys={4} tone={2} bay={false} />
      <NewariHouse x={268} base={GROUND} w={46} storeys={3} tone={1} />
      <Pati x={330} base={GROUND} w={64} />
      <ConcreteHouse x={410} base={GROUND} w={44} storeys={3} tone={1} />

      <PimbahalPond x={476} base={GROUND} w={120} />
      <Chaitya x={624} base={GROUND} w={26} />
      <Tree x={668} base={GROUND} h={58} tint="#35583a" />

      <Pagoda x={726} base={GROUND} w={56} tiers={3} />
      <Shikhara x={800} base={GROUND} w={32} />
      <Pagoda x={860} base={GROUND} w={42} tiers={2} />

      <Stupa x={916} base={GROUND} w={74} />
      <NewariHouse x={958} base={GROUND} w={38} storeys={3} tone={3} roof="parapet" bay={false} />

      {/* KU's wings reach 0.3w beyond the block on each side, so it occupies
          roughly 970-1130 — the trees after it start clear of that. */}
      <KathmanduUniversity x={1000} base={GROUND} w={100} />

      {/*
       * Right edge. The last tree sits 40 units from the panel end, matching
       * the 26 of the first tree on the next panel: 1200-1186+26 = 40, the
       * same gap as anywhere else in the row, so the wrap is invisible.
       */}
      <Tree x={1150} base={GROUND} h={92} />
      <Tree x={1186} base={GROUND} h={74} tint="#35583a" />
    </>
  );
}

/** Fieldwork: deep forest, the pond, barely any building at all. */
function JunglePanel() {
  const trunks = [
    { x: 40, h: 96 },
    { x: 96, h: 68 },
    { x: 150, h: 110 },
    { x: 214, h: 78 },
    { x: 268, h: 92 },
    { x: 690, h: 104 },
    { x: 748, h: 72 },
    { x: 806, h: 118 },
    { x: 872, h: 84 },
    { x: 934, h: 98 },
    { x: 996, h: 70 },
    { x: 1056, h: 106 },
    { x: 1116, h: 80 },
    { x: 1168, h: 94 },
  ];
  return (
    <>
      {trunks.map((t, i) => (
        <Tree
          key={t.x}
          x={t.x}
          base={GROUND}
          h={t.h}
          tint={["#2f4f35", "#35583a", "#3f6b42"][i % 3]}
        />
      ))}
      <PimbahalPond x={360} base={GROUND} w={180} />
      <Chaitya x={572} base={GROUND} w={22} />
      <Pati x={608} base={GROUND} w={54} />
      <NewariHouse x={1010} base={GROUND} w={38} storeys={2} tone={2} bay={false} />
    </>
  );
}

/** Festival night: the temple row, lit, with the square filled. */
function FestivalPanel() {
  return (
    <>
      <Tree x={30} base={GROUND} h={70} tint="#35583a" />
      <NewariHouse x={70} base={GROUND} w={42} storeys={3} tone={0} ground="shop" />
      <Pagoda x={184} base={GROUND} w={72} tiers={3} />
      <Chaitya x={252} base={GROUND} w={24} />
      <Pagoda x={300} base={GROUND} w={50} tiers={2} />
      <Shikhara x={372} base={GROUND} w={36} />
      <Pati x={412} base={GROUND} w={70} />
      <Stupa x={548} base={GROUND} w={92} />
      <Pagoda x={664} base={GROUND} w={64} tiers={3} />
      <NewariHouse x={724} base={GROUND} w={44} storeys={4} tone={2} ground="shop" bay={false} />
      <Pagoda x={824} base={GROUND} w={54} tiers={2} />
      <Shikhara x={894} base={GROUND} w={30} />
      <NewariHouse x={926} base={GROUND} w={40} storeys={3} tone={1} />
      <PimbahalPond x={980} base={GROUND} w={130} />
      <Pagoda x={1124} base={GROUND} w={56} tiers={3} />
      <Tree x={1180} base={GROUND} h={70} tint="#35583a" />
    </>
  );
}

/** Where she is now: the terrace, the lamp, the box, the tower. */
function UkPanel() {
  return (
    <>
      <Tree x={28} base={GROUND} h={64} tint="#3c5540" />

      {/* A terrace is uniform by nature, so the variety comes from the widths,
          the brick tones and what interrupts the row. */}
      <TerraceHouse x={64} base={GROUND} w={54} tone="#7c4a3e" />
      <TerraceHouse x={120} base={GROUND} w={48} tone="#6d4439" />
      <TerraceHouse x={172} base={GROUND} w={58} tone="#8a5546" />
      <Streetlamp x={244} base={GROUND} h={92} />
      <PhoneBox x={274} base={GROUND} h={56} />

      <TerraceHouse x={308} base={GROUND} w={52} tone="#73453a" />
      <TerraceHouse x={364} base={GROUND} w={60} tone="#7c4a3e" />
      <TerraceHouse x={428} base={GROUND} w={46} tone="#684036" />

      <ClockTower x={520} base={GROUND} w={30} />
      <Streetlamp x={580} base={GROUND} h={92} />

      <TerraceHouse x={606} base={GROUND} w={56} tone="#8a5546" />
      <TerraceHouse x={666} base={GROUND} w={50} tone="#6d4439" />
      <TerraceHouse x={720} base={GROUND} w={58} tone="#73453a" />
      <Tree x={798} base={GROUND} h={72} tint="#3c5540" />
      <TerraceHouse x={824} base={GROUND} w={52} tone="#7c4a3e" />
      <TerraceHouse x={880} base={GROUND} w={46} tone="#8a5546" />

      <PhoneBox x={946} base={GROUND} h={56} />
      <Streetlamp x={980} base={GROUND} h={92} />
      <TerraceHouse x={1006} base={GROUND} w={58} tone="#684036" />
      <TerraceHouse x={1068} base={GROUND} w={48} tone="#73453a" />
      <TerraceHouse x={1120} base={GROUND} w={48} tone="#7c4a3e" />
      <Tree x={1186} base={GROUND} h={64} tint="#3c5540" />
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Composition
 * ------------------------------------------------------------------ */

const SCENES: Record<
  FriezeVariant,
  {
    body: () => ReactNode;
    /** Ridge colour behind the buildings. */
    hill: string;
    /** What drives through, and how long it takes to cross. */
    vehicle: "mayur" | "routemaster";
    /**
     * Flag lines strung over the scene, as {yEdge, yMid} pairs. Drawn inside
     * the panel so they scroll and scale with the buildings; both ends of each
     * line share a height so the loop has no step in the rope.
     */
    flags: { yEdge: number; yMid: number; count?: number }[];
  }
> = {
  valley: {
    body: ValleyPanel,
    hill: "#2f4a33",
    vehicle: "mayur",
    flags: [{ yEdge: 16, yMid: 40 }],
  },
  jungle: {
    body: JunglePanel,
    hill: "#26402c",
    vehicle: "mayur",
    flags: [],
  },
  // Festival night: strings tied off in every direction, crossing each other.
  festival: {
    body: FestivalPanel,
    hill: "#3a3050",
    vehicle: "mayur",
    flags: [
      { yEdge: 8, yMid: 34, count: 30 },
      { yEdge: 40, yMid: 14, count: 28 },
      { yEdge: 24, yMid: 52, count: 32 },
    ],
  },
  uk: { body: UkPanel, hill: "#2c3242", vehicle: "routemaster", flags: [] },
};

function Panel({ variant }: { variant: FriezeVariant }) {
  const scene = SCENES[variant];
  const Body = scene.body;

  return (
    <svg
      viewBox={`0 0 ${W} ${GROUND}`}
      width={W}
      height={GROUND}
      preserveAspectRatio="none"
      className="block h-full shrink-0"
      style={{ width: W }}
      aria-hidden
    >
      {/* Ridge behind everything */}
      <path
        d={`M 0 ${GROUND} L 0 118 Q 150 86 300 108 Q 460 130 610 96
            Q 760 66 900 104 Q 1050 134 ${W} 112 L ${W} ${GROUND} Z`}
        fill={scene.hill}
        opacity="0.35"
      />

      <Body />

      {/* Flags last, so they hang in front of the rooftops */}
      {scene.flags.map((f, i) => (
        <FlagLine
          key={i}
          w={W}
          yEdge={f.yEdge}
          yMid={f.yMid}
          count={f.count ?? 26}
          offset={i * 2}
          opacity={i === 0 ? 1 : 0.9}
        />
      ))}

      {/* The road they all sit on */}
      <rect x="0" y={GROUND - 9} width={W} height="9" fill="var(--color-night)" opacity="0.5" />
      <rect x="0" y={GROUND - 9} width={W} height="1" fill="var(--color-gilt)" opacity="0.22" />
    </svg>
  );
}

/**
 * @param variant Which scene to run.
 * @param height Band height in px.
 * @param leaves How many leaves fall over the page behind it.
 */
export default function Frieze({
  variant = "valley",
  height = 150,
  leaves = 8,
}: {
  variant?: FriezeVariant;
  height?: number;
  leaves?: number;
}) {
  const scene = SCENES[variant];

  return (
    <>
      <div
        aria-hidden
        className="full-bleed relative mb-6 overflow-hidden opacity-70"
        style={{
          height,
          // Feather both ends so the strip dissolves into the page rather than
          // stopping at a hard vertical edge.
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        {/* Two panels, slid left by exactly one panel width, forever. */}
        <div className="anim-frieze absolute bottom-0 flex h-full">
          <Panel variant={variant} />
          <Panel variant={variant} />
        </div>

        {/* The vehicle, in front of the strip and on its own clock, so it is
            never in the same place relative to the town twice. The wrapper is
            full width so translateX(100%) means "one band across". */}
        <div className="anim-bus absolute bottom-0 left-0 w-full">
          <div className="anim-bus-bounce w-fit">
            {scene.vehicle === "mayur" ? (
              <MayurBus width={112} />
            ) : (
              <Routemaster width={106} />
            )}
          </div>
        </div>
      </div>

      <Leaves count={leaves} />
    </>
  );
}

/**
 * UK Bingo. Twenty-four squares of inevitable British experience, plus a free
 * centre square that she has already earned by getting on the plane.
 *
 * Square ids are stable strings, not indexes — reordering or editing this list
 * later must not un-tick squares she has already completed.
 */
export type BingoSquare = { id: string; text: string };

export const BINGO_SQUARES: BingoSquare[] = [
  { id: "alright", text: "Someone said \"you alright?\" and left before you answered" },
  { id: "queue", text: "Joined a queue without knowing what for" },
  { id: "rain", text: "Got rained on with zero warning" },
  { id: "beans", text: "Witnessed beans on toast in the wild" },
  { id: "spice", text: "Watched a British person lose to mild spice" },
  { id: "name", text: "Had your name mangled beyond recognition" },
  { id: "taps", text: "Suffered the two-tap sink" },
  { id: "sorry", text: "Said sorry to an inanimate object" },
  { id: "tea", text: "Served a tragically weak cup of tea" },
  { id: "momo", text: "Paid criminal money for momo" },
  { id: "dark", text: "It was pitch dark before 5pm" },
  { id: "cheers", text: "Used \"cheers\" correctly on instinct" },
  { id: "curry", text: "Asked if you've had \"a proper curry\"" },
  { id: "sun", text: "Saw the sun; everyone removed a layer immediately" },
  { id: "bus", text: "The bus apologised for a 2-minute delay" },
  { id: "nepal", text: "Explained where Nepal is using your hands" },
  { id: "everest", text: "Someone mentioned Everest within 30 seconds" },
  { id: "charity", text: "Found treasure in a charity shop" },
  { id: "crisps", text: "Encountered a deeply cursed crisp flavour" },
  { id: "hill", text: "Climbed a \"mountain\" that was a hill" },
  { id: "chippy", text: "Had proper chips from a chippy" },
  { id: "smalltalk", text: "Made 10 minutes of small talk about weather" },
  { id: "homesick", text: "Cried at a song and blamed allergies" },
  { id: "spices", text: "Found the one shop with the right spices" },
];

export const FREE_SQUARE: BingoSquare = {
  id: "free",
  text: "Got on the plane 💜",
};

/** The 5x5 grid with the free square dropped into the centre. */
export function bingoGrid(): BingoSquare[] {
  const grid = [...BINGO_SQUARES];
  grid.splice(12, 0, FREE_SQUARE);
  return grid;
}

/** Row, column and diagonal index sets, for detecting a completed line. */
export function bingoLines(): number[][] {
  const lines: number[][] = [];
  for (let r = 0; r < 5; r++) {
    lines.push([0, 1, 2, 3, 4].map((c) => r * 5 + c));
  }
  for (let c = 0; c < 5; c++) {
    lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + c));
  }
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);
  return lines;
}

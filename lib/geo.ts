/**
 * "Where in the Valley" — a GeoGuessr-shaped guessing game.
 *
 * Street View embeds would need a Google Maps API key and are blocked by the
 * site's CSP, so rounds are clue-based instead: read the clue, click the map,
 * get scored on real great-circle distance from the true coordinates.
 *
 * The maps are stylised, not survey-accurate — good enough to place a temple,
 * not to navigate by.
 */

export type Round = {
  id: string;
  name: string;
  local?: string;
  lat: number;
  lon: number;
  clue: string;
  /** "valley" rounds use the Kathmandu Valley map; "nepal" the country map. */
  scope: "valley" | "nepal";
};

export const ROUNDS: Round[] = [
  // ---- Lalitpur / Patan — her home ground ----
  {
    id: "pimbahal",
    name: "Pimbahal Pokhari",
    local: "पिंबहाल पोखरी",
    lat: 27.6742,
    lon: 85.3186,
    clue: "A rectangular pond with a temple at its edge, ringed by old Newari houses. Kids play football on the strip beside it. You know exactly where this is.",
    scope: "valley",
  },
  {
    id: "patandurbar",
    name: "Patan Durbar Square",
    local: "पाटन दरबार क्षेत्र",
    lat: 27.6727,
    lon: 85.325,
    clue: "Krishna Mandir's stone shikhara, the Golden Temple a few lanes north, and more bronze than anywhere else in the country.",
    scope: "valley",
  },
  {
    id: "jawalakhel",
    name: "Jawalakhel",
    local: "जावलाखेल",
    lat: 27.673,
    lon: 85.312,
    clue: "Zoo on one side, Tibetan carpet centre on the other, and the roundabout everyone gives directions from.",
    scope: "valley",
  },
  {
    id: "bungamati",
    name: "Bungamati",
    local: "बुंगमती",
    lat: 27.595,
    lon: 85.3,
    clue: "A Newar village south of the ring road where the Rato Machhindranath spends half the year. Woodcarvers in every second doorway.",
    scope: "valley",
  },
  {
    id: "godavari",
    name: "Godavari Botanical Garden",
    local: "गोदावरी",
    lat: 27.5951,
    lon: 85.38,
    clue: "The national botanical garden at the foot of Phulchowki. Orchid house, fern collection, and where every environmental science field trip ends up.",
    scope: "valley",
  },

  // ---- Kathmandu ----
  {
    id: "swayambhu",
    name: "Swayambhunath",
    local: "स्वयम्भू",
    lat: 27.7149,
    lon: 85.2903,
    clue: "365 steps, painted eyes facing four directions, and monkeys that will take your food without apology.",
    scope: "valley",
  },
  {
    id: "boudha",
    name: "Boudhanath",
    local: "बौद्धनाथ",
    lat: 27.7215,
    lon: 85.362,
    clue: "The largest stupa in the country. Everyone walks clockwise; the cafés on the ring have the best view of the whitewashing.",
    scope: "valley",
  },
  {
    id: "pashupati",
    name: "Pashupatinath",
    local: "पशुपतिनाथ",
    lat: 27.7104,
    lon: 85.3487,
    clue: "On the Bagmati's west bank, with the cremation ghats below and sadhus on the terraces above.",
    scope: "valley",
  },
  {
    id: "ason",
    name: "Ason Bazaar",
    local: "असन",
    lat: 27.7075,
    lon: 85.312,
    clue: "Six lanes meeting at one impossible junction. Spices, brass, and absolutely no room to walk.",
    scope: "valley",
  },
  {
    id: "kirtipur",
    name: "Kirtipur",
    local: "कीर्तिपुर",
    lat: 27.6786,
    lon: 85.2775,
    clue: "A hill town southwest of the city that held out longest against the Gorkhali conquest. The university sits below it.",
    scope: "valley",
  },

  // ---- Bhaktapur ----
  {
    id: "nyatapola",
    name: "Nyatapola Temple",
    local: "न्यातपोल",
    lat: 27.6714,
    lon: 85.429,
    clue: "Five tiers, five pairs of guardians up the stairs — wrestlers, elephants, lions, griffins, goddesses. It survived every earthquake.",
    scope: "valley",
  },
  {
    id: "changu",
    name: "Changu Narayan",
    local: "चाँगुनारायण",
    lat: 27.7159,
    lon: 85.4275,
    clue: "On a ridge north of Bhaktapur. The oldest inscription in the valley sits in its courtyard.",
    scope: "valley",
  },
  {
    id: "nagarkot",
    name: "Nagarkot",
    local: "नगरकोट",
    lat: 27.7154,
    lon: 85.5209,
    clue: "The eastern rim everyone drags themselves up for a 5am view that is cloudy four times out of five.",
    scope: "valley",
  },

  // ---- Wider Nepal ----
  {
    id: "phewa",
    name: "Phewa Lake, Pokhara",
    local: "फेवा ताल",
    lat: 28.2096,
    lon: 83.9856,
    clue: "Machhapuchhre reflected in the water on a clear morning, and a hundred blue boats waiting.",
    scope: "nepal",
  },
  {
    id: "lumbini",
    name: "Lumbini",
    local: "लुम्बिनी",
    lat: 27.4695,
    lon: 83.2756,
    clue: "The Ashoka pillar, the Maya Devi temple, and flat Terai heat in every direction.",
    scope: "nepal",
  },
  {
    id: "chitwan",
    name: "Chitwan, Sauraha",
    local: "चितवन",
    lat: 27.58,
    lon: 84.49,
    clue: "Sal forest and elephant grass on the Rapti. Where the one-horned rhino came back from the brink.",
    scope: "nepal",
  },
  {
    id: "ilam",
    name: "Ilam",
    local: "इलाम",
    lat: 26.9094,
    lon: 87.9286,
    clue: "Tea terraces in the far east, close enough to Darjeeling to argue about whose is better.",
    scope: "nepal",
  },
  {
    id: "janakpur",
    name: "Janakpur",
    local: "जनकपुर",
    lat: 26.7288,
    lon: 85.925,
    clue: "Janaki Mandir in the southern plains — Mithila painting, and Sita's birthplace.",
    scope: "nepal",
  },
];

/* ------------------------------------------------------------------ *
 * Map projections
 * ------------------------------------------------------------------ */

/** Bounding boxes: [minLon, minLat, maxLon, maxLat]. */
export const BOUNDS = {
  valley: [85.16, 27.53, 85.58, 27.85] as const,
  nepal: [79.9, 26.25, 88.3, 30.5] as const,
};

/** Longitude/latitude to 0-100 SVG space, y flipped so north is up. */
export function project(
  lon: number,
  lat: number,
  scope: "valley" | "nepal",
): { x: number; y: number } {
  const [minLon, minLat, maxLon, maxLat] = BOUNDS[scope];
  return {
    x: ((lon - minLon) / (maxLon - minLon)) * 100,
    y: ((maxLat - lat) / (maxLat - minLat)) * 100,
  };
}

/** Inverse of project — turns a click back into coordinates. */
export function unproject(
  x: number,
  y: number,
  scope: "valley" | "nepal",
): { lon: number; lat: number } {
  const [minLon, minLat, maxLon, maxLat] = BOUNDS[scope];
  return {
    lon: minLon + (x / 100) * (maxLon - minLon),
    lat: maxLat - (y / 100) * (maxLat - minLat),
  };
}

/** Great-circle distance in kilometres. */
export function haversineKm(
  aLat: number,
  aLon: number,
  bLat: number,
  bLon: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLon = toRad(bLon - aLon);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * 0-5000 points, decaying with distance. The valley is ~35 km across, so it
 * uses a much tighter scale than a country-wide round.
 */
export function score(distanceKm: number, scope: "valley" | "nepal"): number {
  const scale = scope === "valley" ? 3.5 : 120;
  return Math.round(5000 * Math.exp(-distanceKm / scale));
}

export function pickRounds(count = 5): Round[] {
  const valley = ROUNDS.filter((r) => r.scope === "valley");
  const nepal = ROUNDS.filter((r) => r.scope === "nepal");

  const shuffle = <T,>(xs: T[]) => {
    const a = [...xs];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  // Mostly the valley, with one wider-Nepal round for variety.
  const picked = [
    ...shuffle(valley).slice(0, count - 1),
    ...shuffle(nepal).slice(0, 1),
  ];
  return shuffle(picked);
}

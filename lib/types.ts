export type Photo = {
  id: string;
  url: string;
  caption: string;
  place: string;
  createdAt: string;
};

/**
 * A photo stuck onto a diary entry. Position is a percentage of the board so
 * the layout survives a phone screen and a laptop alike.
 */
export type Sticker = {
  id: string;
  url: string;
  /** 0-100, percent of board width/height. */
  x: number;
  y: number;
  /** Width as a percent of board width. */
  w: number;
  rotate: number;
  z: number;
  /** Optional scribble under the photo. */
  caption: string;
  /** Polaroid frame, or a bare cut-out. */
  frame: "polaroid" | "plain";
};

export type DiaryEntry = {
  id: string;
  title: string;
  body: string;
  mood: string;
  stickers: Sticker[];
  createdAt: string;
};

export type Letter = {
  id: string;
  author: string;
  body: string;
  /** "to-her" = a friend wrote in; "from-her" = she wrote out. */
  direction: "to-her" | "from-her";
  recipient: string;
  opened: boolean;
  createdAt: string;
};

/**
 * A Locket-style photo: someone back home sends a picture that lands on her
 * home screen, so the reminder that she's missed arrives without being asked
 * for. Anyone with the write link can send one.
 */
export type Locket = {
  id: string;
  url: string;
  note: string;
  sentBy: string;
  createdAt: string;
};

export type Song = {
  id: string;
  title: string;
  artist: string;
  /** Why this one — the line that got you, the memory attached. */
  note: string;
  addedBy: string;
  /** Optional Spotify / YouTube / Apple Music link. */
  url: string;
  createdAt: string;
};

/**
 * Which list an item belongs to:
 *   bingo — the 5x5 UK Bingo card (text comes from lib/bingo.ts)
 *   ours  — the list her friends made for her
 *   hers  — the list she builds herself
 */
export type ListName = "bingo" | "ours" | "hers";

export type ChecklistItem = {
  id: string;
  list: ListName;
  text: string;
  addedBy: string;
  done: boolean;
  createdAt: string;
};

/** Wax-seal colours for letters, drawn from the valley rather than a game. */
export const SEALS = [
  "moss",
  "plum",
  "marigold",
  "rose",
  "sky",
  "dusk",
  "brick",
] as const;

export type Seal = (typeof SEALS)[number];

/** Stable seal pick from any string, so a given name always gets one colour. */
export function sealFor(seed: string): Seal {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return SEALS[hash % SEALS.length];
}

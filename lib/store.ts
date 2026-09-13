import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import type {
  ChecklistItem,
  DiaryEntry,
  Letter,
  ListName,
  Locket,
  Photo,
  Song,
  Sticker,
} from "./types";

/**
 * Two interchangeable backends:
 *
 *   - Neon Postgres, used whenever DATABASE_URL is set (always true on Vercel).
 *   - Plain JSON files under ./.data, used otherwise.
 *
 * The fallback exists so a fresh `git clone && npm install && npm run dev`
 * works with no accounts, no keys and no setup. Local data is gitignored.
 */

const hasDb = Boolean(process.env.DATABASE_URL);

export const storageMode = hasDb ? "postgres" : ("local" as const);

export function newId(): string {
  return crypto.randomUUID();
}

/* ------------------------------------------------------------------ *
 * Local JSON backend
 * ------------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), ".data");

async function readLocal<T>(file: string): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function writeLocal<T>(file: string, rows: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, file),
    JSON.stringify(rows, null, 2),
    "utf8",
  );
}

/* ------------------------------------------------------------------ *
 * Postgres backend
 * ------------------------------------------------------------------ */

type SqlClient = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let sqlClient: SqlClient | null = null;
let schemaReady: Promise<void> | null = null;

async function sql(): Promise<SqlClient> {
  if (!sqlClient) {
    const { neon } = await import("@neondatabase/serverless");
    sqlClient = neon(process.env.DATABASE_URL!) as unknown as SqlClient;
  }
  if (!schemaReady) schemaReady = ensureSchema(sqlClient);
  await schemaReady;
  return sqlClient;
}

async function ensureSchema(q: SqlClient): Promise<void> {
  await q`CREATE TABLE IF NOT EXISTS photos (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    caption TEXT NOT NULL DEFAULT '',
    place TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS diary (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    mood TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  // Added after launch; existing deployments need the column backfilled.
  await q`ALTER TABLE diary ADD COLUMN IF NOT EXISTS stickers TEXT NOT NULL DEFAULT '[]'`;
  await q`CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL DEFAULT '',
    body TEXT NOT NULL DEFAULT '',
    direction TEXT NOT NULL DEFAULT 'to-her',
    recipient TEXT NOT NULL DEFAULT '',
    opened BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS species (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    local TEXT NOT NULL DEFAULT '',
    latin TEXT NOT NULL DEFAULT '',
    kind TEXT NOT NULL DEFAULT 'fauna',
    fact TEXT NOT NULL DEFAULT '',
    tidbits TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT '',
    where_found TEXT NOT NULL DEFAULT '',
    photo_url TEXT NOT NULL DEFAULT '',
    seal TEXT NOT NULL DEFAULT 'moss',
    added_by TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS locket (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    note TEXT NOT NULL DEFAULT '',
    sent_by TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    title TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    added_by TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS checklist (
    id TEXT PRIMARY KEY,
    list TEXT NOT NULL DEFAULT 'hers',
    text TEXT NOT NULL DEFAULT '',
    added_by TEXT NOT NULL DEFAULT '',
    done BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  await q`CREATE TABLE IF NOT EXISTS songs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL DEFAULT '',
    artist TEXT NOT NULL DEFAULT '',
    note TEXT NOT NULL DEFAULT '',
    added_by TEXT NOT NULL DEFAULT '',
    url TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
}

const iso = (v: unknown) =>
  v instanceof Date ? v.toISOString() : String(v ?? new Date().toISOString());

/* ------------------------------------------------------------------ *
 * Photos
 * ------------------------------------------------------------------ */

export async function listPhotos(): Promise<Photo[]> {
  if (!hasDb) {
    const rows = await readLocal<Photo>("photos.json");
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM photos ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: String(r.id),
    url: String(r.url),
    caption: String(r.caption ?? ""),
    place: String(r.place ?? ""),
    createdAt: iso(r.created_at),
  }));
}

export async function addPhoto(
  input: Pick<Photo, "url" | "caption" | "place">,
): Promise<Photo> {
  const photo: Photo = {
    id: newId(),
    url: input.url,
    caption: input.caption,
    place: input.place,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<Photo>("photos.json");
    rows.push(photo);
    await writeLocal("photos.json", rows);
    return photo;
  }
  const q = await sql();
  await q`INSERT INTO photos (id, url, caption, place, created_at)
          VALUES (${photo.id}, ${photo.url}, ${photo.caption}, ${photo.place}, ${photo.createdAt})`;
  return photo;
}

export async function deletePhoto(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<Photo>("photos.json");
    await writeLocal(
      "photos.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM photos WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Diary
 * ------------------------------------------------------------------ */

/** Stickers are stored as a JSON string; bad data must not break the page. */
function parseStickers(raw: unknown): Sticker[] {
  if (Array.isArray(raw)) return raw as Sticker[];
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Sticker[]) : [];
  } catch {
    return [];
  }
}

export async function listDiary(): Promise<DiaryEntry[]> {
  if (!hasDb) {
    const rows = await readLocal<DiaryEntry>("diary.json");
    return rows
      .map((r) => ({ ...r, stickers: parseStickers(r.stickers) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM diary ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    mood: String(r.mood ?? ""),
    stickers: parseStickers(r.stickers),
    createdAt: iso(r.created_at),
  }));
}

export async function addDiary(
  input: Pick<DiaryEntry, "title" | "body" | "mood">,
): Promise<DiaryEntry> {
  const entry: DiaryEntry = {
    id: newId(),
    title: input.title,
    body: input.body,
    mood: input.mood,
    stickers: [],
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<DiaryEntry>("diary.json");
    rows.push(entry);
    await writeLocal("diary.json", rows);
    return entry;
  }
  const q = await sql();
  await q`INSERT INTO diary (id, title, body, mood, stickers, created_at)
          VALUES (${entry.id}, ${entry.title}, ${entry.body}, ${entry.mood},
                  '[]', ${entry.createdAt})`;
  return entry;
}

/** Replaces an entry's whole sticker layout — the board saves as one unit. */
export async function setDiaryStickers(
  id: string,
  stickers: Sticker[],
): Promise<void> {
  const json = JSON.stringify(stickers);

  if (!hasDb) {
    const rows = await readLocal<DiaryEntry>("diary.json");
    const row = rows.find((r) => r.id === id);
    if (row) row.stickers = stickers;
    await writeLocal("diary.json", rows);
    return;
  }

  const q = await sql();
  await q`UPDATE diary SET stickers = ${json} WHERE id = ${id}`;
}

export async function deleteDiary(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<DiaryEntry>("diary.json");
    await writeLocal(
      "diary.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM diary WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Letters
 * ------------------------------------------------------------------ */

export async function listLetters(): Promise<Letter[]> {
  if (!hasDb) {
    const rows = await readLocal<Letter>("letters.json");
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM letters ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: String(r.id),
    author: String(r.author ?? ""),
    body: String(r.body ?? ""),
    direction: (r.direction === "from-her" ? "from-her" : "to-her") as
      | "to-her"
      | "from-her",
    recipient: String(r.recipient ?? ""),
    opened: Boolean(r.opened),
    createdAt: iso(r.created_at),
  }));
}

export async function addLetter(
  input: Pick<Letter, "author" | "body" | "direction" | "recipient">,
): Promise<Letter> {
  const letter: Letter = {
    id: newId(),
    author: input.author,
    body: input.body,
    direction: input.direction,
    recipient: input.recipient,
    opened: false,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<Letter>("letters.json");
    rows.push(letter);
    await writeLocal("letters.json", rows);
    return letter;
  }
  const q = await sql();
  await q`INSERT INTO letters (id, author, body, direction, recipient, opened, created_at)
          VALUES (${letter.id}, ${letter.author}, ${letter.body}, ${letter.direction},
                  ${letter.recipient}, ${letter.opened}, ${letter.createdAt})`;
  return letter;
}

export async function markLetterOpened(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<Letter>("letters.json");
    const row = rows.find((r) => r.id === id);
    if (row) row.opened = true;
    await writeLocal("letters.json", rows);
    return;
  }
  const q = await sql();
  await q`UPDATE letters SET opened = true WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Mixtape
 * ------------------------------------------------------------------ */

export async function listSongs(): Promise<Song[]> {
  if (!hasDb) {
    const rows = await readLocal<Song>("songs.json");
    return rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM songs ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: String(r.id),
    title: String(r.title ?? ""),
    artist: String(r.artist ?? ""),
    note: String(r.note ?? ""),
    addedBy: String(r.added_by ?? ""),
    url: String(r.url ?? ""),
    createdAt: iso(r.created_at),
  }));
}

export async function addSong(
  input: Pick<Song, "title" | "artist" | "note" | "addedBy" | "url">,
): Promise<Song> {
  const song: Song = {
    id: newId(),
    title: input.title,
    artist: input.artist,
    note: input.note,
    addedBy: input.addedBy,
    url: input.url,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<Song>("songs.json");
    rows.push(song);
    await writeLocal("songs.json", rows);
    return song;
  }
  const q = await sql();
  await q`INSERT INTO songs (id, title, artist, note, added_by, url, created_at)
          VALUES (${song.id}, ${song.title}, ${song.artist}, ${song.note},
                  ${song.addedBy}, ${song.url}, ${song.createdAt})`;
  return song;
}

export async function deleteSong(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<Song>("songs.json");
    await writeLocal(
      "songs.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM songs WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Species she adds herself
 * ------------------------------------------------------------------ */

export type CustomSpecies = {
  id: string;
  name: string;
  local: string;
  latin: string;
  kind: "fauna" | "flora";
  fact: string;
  tidbits: string[];
  status: string;
  where: string;
  photoUrl: string;
  seal: string;
  addedBy: string;
  createdAt: string;
};

function parseTidbits(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.map(String);
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export async function listSpecies(): Promise<CustomSpecies[]> {
  if (!hasDb) {
    const rows = await readLocal<CustomSpecies>("species.json");
    return rows
      .map((r) => ({ ...r, tidbits: parseTidbits(r.tidbits) }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM species ORDER BY created_at DESC`;
  return rows.map((r) => ({
    id: String(r.id),
    name: String(r.name ?? ""),
    local: String(r.local ?? ""),
    latin: String(r.latin ?? ""),
    kind: r.kind === "flora" ? "flora" : "fauna",
    fact: String(r.fact ?? ""),
    tidbits: parseTidbits(r.tidbits),
    status: String(r.status ?? ""),
    where: String(r.where_found ?? ""),
    photoUrl: String(r.photo_url ?? ""),
    seal: String(r.seal ?? "moss"),
    addedBy: String(r.added_by ?? ""),
    createdAt: iso(r.created_at),
  }));
}

export async function addSpecies(input: {
  name: string;
  local: string;
  latin: string;
  kind: "fauna" | "flora";
  fact: string;
  tidbits: string[];
  status: string;
  where: string;
  photoUrl: string;
  seal: string;
  addedBy: string;
}): Promise<CustomSpecies> {
  const row: CustomSpecies = {
    ...input,
    id: newId(),
    createdAt: new Date().toISOString(),
  };

  if (!hasDb) {
    const rows = await readLocal<CustomSpecies>("species.json");
    rows.push(row);
    await writeLocal("species.json", rows);
    return row;
  }

  const q = await sql();
  await q`INSERT INTO species
          (id, name, local, latin, kind, fact, tidbits, status, where_found,
           photo_url, seal, added_by, created_at)
          VALUES (${row.id}, ${row.name}, ${row.local}, ${row.latin}, ${row.kind},
                  ${row.fact}, ${JSON.stringify(row.tidbits)}, ${row.status},
                  ${row.where}, ${row.photoUrl}, ${row.seal}, ${row.addedBy},
                  ${row.createdAt})`;
  return row;
}

export async function deleteSpecies(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<CustomSpecies>("species.json");
    await writeLocal(
      "species.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM species WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Locket — photos sent to her by people back home
 * ------------------------------------------------------------------ */

export async function listLockets(limit = 60): Promise<Locket[]> {
  if (!hasDb) {
    const rows = await readLocal<Locket>("locket.json");
    return rows
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
  const q = await sql();
  const rows = await q`SELECT * FROM locket ORDER BY created_at DESC LIMIT ${limit}`;
  return rows.map((r) => ({
    id: String(r.id),
    url: String(r.url),
    note: String(r.note ?? ""),
    sentBy: String(r.sent_by ?? ""),
    createdAt: iso(r.created_at),
  }));
}

export async function addLocket(
  input: Pick<Locket, "url" | "note" | "sentBy">,
): Promise<Locket> {
  const locket: Locket = {
    id: newId(),
    url: input.url,
    note: input.note,
    sentBy: input.sentBy,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<Locket>("locket.json");
    rows.push(locket);
    await writeLocal("locket.json", rows);
    return locket;
  }
  const q = await sql();
  await q`INSERT INTO locket (id, url, note, sent_by, created_at)
          VALUES (${locket.id}, ${locket.url}, ${locket.note}, ${locket.sentBy}, ${locket.createdAt})`;
  return locket;
}

export async function deleteLocket(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<Locket>("locket.json");
    await writeLocal(
      "locket.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM locket WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Calendar events she and her friends add
 * ------------------------------------------------------------------ */

export type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  note: string;
  addedBy: string;
  createdAt: string;
};

export async function listEvents(): Promise<CalendarEvent[]> {
  if (!hasDb) {
    const rows = await readLocal<CalendarEvent>("events.json");
    return rows.sort((a, b) => a.date.localeCompare(b.date));
  }
  const q = await sql();
  const rows = await q`SELECT * FROM events ORDER BY date ASC`;
  return rows.map((r) => ({
    id: String(r.id),
    date: String(r.date),
    title: String(r.title ?? ""),
    note: String(r.note ?? ""),
    addedBy: String(r.added_by ?? ""),
    createdAt: iso(r.created_at),
  }));
}

export async function addEvent(input: {
  date: string;
  title: string;
  note: string;
  addedBy: string;
}): Promise<CalendarEvent> {
  const event: CalendarEvent = {
    id: newId(),
    date: input.date,
    title: input.title,
    note: input.note,
    addedBy: input.addedBy,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<CalendarEvent>("events.json");
    rows.push(event);
    await writeLocal("events.json", rows);
    return event;
  }
  const q = await sql();
  await q`INSERT INTO events (id, date, title, note, added_by, created_at)
          VALUES (${event.id}, ${event.date}, ${event.title}, ${event.note},
                  ${event.addedBy}, ${event.createdAt})`;
  return event;
}

export async function deleteEvent(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<CalendarEvent>("events.json");
    await writeLocal(
      "events.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM events WHERE id = ${id}`;
}

/* ------------------------------------------------------------------ *
 * Checklists (UK bingo, the list we made, the list she makes)
 * ------------------------------------------------------------------ */

/** Bingo rows are keyed by their stable square id, not a uuid. */
export const bingoRowId = (squareId: string) => `bingo:${squareId}`;

export async function listChecklist(
  list?: ListName,
): Promise<ChecklistItem[]> {
  let rows: ChecklistItem[];

  if (!hasDb) {
    rows = await readLocal<ChecklistItem>("checklist.json");
  } else {
    const q = await sql();
    const raw = await q`SELECT * FROM checklist ORDER BY created_at ASC`;
    rows = raw.map((r) => ({
      id: String(r.id),
      list: String(r.list ?? "hers") as ListName,
      text: String(r.text ?? ""),
      addedBy: String(r.added_by ?? ""),
      done: Boolean(r.done),
      createdAt: iso(r.created_at),
    }));
  }

  const sorted = rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  return list ? sorted.filter((r) => r.list === list) : sorted;
}

export async function addChecklistItem(input: {
  list: ListName;
  text: string;
  addedBy: string;
}): Promise<ChecklistItem> {
  const item: ChecklistItem = {
    id: newId(),
    list: input.list,
    text: input.text,
    addedBy: input.addedBy,
    done: false,
    createdAt: new Date().toISOString(),
  };
  if (!hasDb) {
    const rows = await readLocal<ChecklistItem>("checklist.json");
    rows.push(item);
    await writeLocal("checklist.json", rows);
    return item;
  }
  const q = await sql();
  await q`INSERT INTO checklist (id, list, text, added_by, done, created_at)
          VALUES (${item.id}, ${item.list}, ${item.text}, ${item.addedBy},
                  ${item.done}, ${item.createdAt})`;
  return item;
}

/**
 * Sets an item's done state, inserting the row if it doesn't exist yet —
 * bingo squares have no row until the first time one is ticked.
 */
export async function setChecklistDone(
  id: string,
  done: boolean,
  fallback?: { list: ListName; text: string },
): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<ChecklistItem>("checklist.json");
    const row = rows.find((r) => r.id === id);
    if (row) {
      row.done = done;
    } else if (fallback) {
      rows.push({
        id,
        list: fallback.list,
        text: fallback.text,
        addedBy: "",
        done,
        createdAt: new Date().toISOString(),
      });
    }
    await writeLocal("checklist.json", rows);
    return;
  }

  const q = await sql();
  if (fallback) {
    await q`INSERT INTO checklist (id, list, text, added_by, done, created_at)
            VALUES (${id}, ${fallback.list}, ${fallback.text}, '', ${done}, ${new Date().toISOString()})
            ON CONFLICT (id) DO UPDATE SET done = ${done}`;
  } else {
    await q`UPDATE checklist SET done = ${done} WHERE id = ${id}`;
  }
}

export async function deleteChecklistItem(id: string): Promise<void> {
  if (!hasDb) {
    const rows = await readLocal<ChecklistItem>("checklist.json");
    await writeLocal(
      "checklist.json",
      rows.filter((r) => r.id !== id),
    );
    return;
  }
  const q = await sql();
  await q`DELETE FROM checklist WHERE id = ${id}`;
}

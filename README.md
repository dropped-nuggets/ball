# Rijuko

A keepsake site for a friend who moved from Pimbahal, Lalitpur to the UK.

Purple, foresty, Newari. An album, a diary she can stick photos onto, sealed
letters from home, a shared mixtape, a festival calendar, and a playroom.

---

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No database, no accounts, no API keys needed** —
with nothing configured, everything is stored in `./.data/*.json` and photos are
kept as downscaled data URLs. That folder is gitignored.

### Set a passphrase before sharing it with anyone

Copy `.env.example` to `.env.local` and set:

```bash
RIJUKO_PASSPHRASE=something-you-two-know
RIJUKO_SECRET=any-long-random-string
```

Without `RIJUKO_PASSPHRASE` **the site is completely public** and a red banner
says so on every page. The diary and the letters are not protected by anything
else.

---

## What's where

| Route | Who can see it | What it is |
|---|---|---|
| `/` | passphrase | Home: weather, locket, flight path, daily dose |
| `/album` | passphrase | Photo carousel + upload |
| `/diary` | passphrase | Entries, with a drag-and-drop photo scrapbook per entry |
| `/letters` | passphrase | Sealed letters; click to break the wax |
| `/mixtape` | passphrase | Shared playlist |
| `/calendar` | passphrase | Nepali festivals + her own events |
| `/play` | passphrase | Wordle, Where in the Valley, Memory, Flora & Fauna |
| `/bingo` | passphrase | UK Bingo + two checklists |
| **`/write`** | **anyone with the link** | Write her a letter, or send a photo |
| `/login` | anyone | Passphrase prompt |

`/write` is the link to send around. It never exposes anything she's written.

---

## Deploying to Vercel (free)

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new). Hobby plan.
3. **Storage → Neon Postgres** → connect. `DATABASE_URL` is injected for you.
   Tables are created automatically on first request.
4. **Storage → Blob** → connect. `BLOB_READ_WRITE_TOKEN` is injected.
   Without it the site still works; photos just live in the database instead.
5. **Settings → Environment Variables**, add:
   - `RIJUKO_PASSPHRASE` — required
   - `RIJUKO_SECRET` — any long random string
   - `NEXT_PUBLIC_HER_NAME` — e.g. `Riju`
   - `NEXT_PUBLIC_UK_CITY`, `UK_LAT`, `UK_LON` — her actual UK city (defaults to London)
6. Redeploy.

Everything used here has a free tier. Weather comes from
[Open-Meteo](https://open-meteo.com), which needs no key. Hobby plans are
throttled rather than billed, so there's no surprise invoice.

---

## Phone

### Install it (works today)

Open the site on her phone → Share → **Add to Home Screen**. It installs as a
PWA: own icon, opens fullscreen, no browser chrome.

### A real home-screen widget

A true iOS/Android widget needs a native app — a website cannot install one,
on any host. The free workaround is [Scriptable](https://scriptable.app) on iOS.

`/api/widget` returns everything a widget needs. It authenticates with the
passphrase in an `x-rijuko-key` **header** (never a URL parameter — those leak
into logs and history).

```js
// Scriptable widget. Set RIJUKO_URL and RIJUKO_KEY below.
const RIJUKO_URL = "https://your-app.vercel.app/api/widget";
const RIJUKO_KEY = "your-passphrase";

const req = new Request(RIJUKO_URL);
req.headers = { "x-rijuko-key": RIJUKO_KEY };
const data = await req.loadJSON();

const w = new ListWidget();
w.backgroundColor = new Color("#17111f");

if (data.locket?.url) {
  const img = await new Request(data.locket.url).loadImage();
  w.backgroundImage = img;
  const grad = new LinearGradient();
  grad.colors = [new Color("#17111f", 0.1), new Color("#17111f", 0.92)];
  grad.locations = [0, 1];
  w.backgroundGradient = grad;
}

const times = w.addText(`ktm ${data.times.nepal}  ·  uk ${data.times.uk}`);
times.font = Font.mediumSystemFont(12);
times.textColor = new Color("#c9b3f0");

w.addSpacer();

if (data.locket) {
  const note = w.addText(data.locket.note || "thinking of you");
  note.font = Font.semiboldSystemFont(15);
  note.textColor = new Color("#e8d7f7");
  const from = w.addText(`— ${data.locket.sentBy}`);
  from.font = Font.systemFont(11);
  from.textColor = new Color("#e0c893");
} else if (data.nextFestival) {
  const f = w.addText(
    `${data.nextFestival.name} in ${data.nextFestival.inDays}d`
  );
  f.font = Font.semiboldSystemFont(14);
  f.textColor = new Color("#e8d7f7");
}

Script.setWidget(w);
Script.complete();
```

Add the script in Scriptable, then long-press the home screen → add a Scriptable
widget → pick it.

---

## Notes for whoever works on this next

- **`lib/store.ts`** is the only file that touches storage. It has two backends —
  Neon Postgres when `DATABASE_URL` is set, JSON files otherwise — behind one
  set of functions. Add a feature by adding a table in `ensureSchema` and a pair
  of functions next to the existing ones.
- **Auth** is a single shared passphrase (`lib/auth.ts`), enforced twice: on each
  API route and again on each page via `guardPage()`. If you add a route,
  guard it — nothing does that for you.
- **Public endpoints** are only `POST /api/letters`, `POST /api/locket`,
  `POST /api/songs` and `POST /api/checklist`. All are rate limited in
  `lib/rateLimit.ts`. That limiter is per-instance and in memory, so on
  serverless the real ceiling is looser than configured. It raises the cost of
  abuse; it is not a hard guarantee.
- **The CSP lives in `middleware.ts`**, not `next.config.ts`, because it needs a
  per-request nonce. A flat `script-src 'self'` silently breaks hydration — the
  page renders but nothing is interactive. Don't "simplify" it.
- **Tailwind v4 tree-shakes `@theme` variables it can't see used.** The seal
  colours are composed at runtime (`var(--color-seal-${seal})`), so `globals.css`
  uses `@theme static`. Removing `static` makes those colours silently vanish.
- **Festival dates shift.** Most are lunar. `lib/festivals.ts` marks those
  `approx: true` and the UI shows `~`. Correct them against a patro each year —
  that file is the whole maintenance story.
- **Hydration-sensitive components** compute dates, times and random values in
  `useEffect` rather than during render, because the server's clock and timezone
  are not hers. Keep that pattern: `DailyDose`, `FlightPath`, `Wordle`,
  `MemoryGame`, `WeatherPanel`.

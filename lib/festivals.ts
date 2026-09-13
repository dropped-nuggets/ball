/**
 * Nepali festivals, pre-marked on the calendar.
 *
 * IMPORTANT — dates shift every year.
 *
 * Only a few of these are solar and therefore fixed (Nepali New Year, Maghe
 * Sankranti). The rest follow the lunar Bikram Sambat calendar, so their
 * Gregorian date moves by a couple of weeks each year. Those carry
 * `approx: true` and the UI marks them with a "~" so nobody books a flight on
 * one without checking.
 *
 * To correct or extend: edit this list. That is the whole maintenance story —
 * add a row per year as it's confirmed against a Nepali patro.
 */
export type Festival = {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  name: string;
  local: string;
  /** Lunar date that shifts yearly and should be verified. */
  approx: boolean;
  /** Specific to the Newar community or the Kathmandu Valley. */
  newari?: boolean;
  /** Specific to Patan / Lalitpur — her home. */
  patan?: boolean;
  note?: string;
  seal: string;
};

export const FESTIVALS: Festival[] = [
  // ---------------------------------------------------------------- 2026
  {
    date: "2026-09-25",
    name: "Indra Jatra",
    local: "इन्द्र जात्रा · Yenya",
    approx: true,
    newari: true,
    note: "Eight days of masked dances and the Kumari's chariot through the old city.",
    seal: "marigold",
  },
  {
    date: "2026-10-11",
    name: "Ghatasthapana",
    local: "घटस्थापना",
    approx: true,
    note: "Dashain begins. The jamara is sown.",
    seal: "moss",
  },
  {
    date: "2026-10-20",
    name: "Vijaya Dashami",
    local: "विजया दशमी",
    approx: true,
    note: "Tika day. The one where everyone goes home.",
    seal: "rose",
  },
  {
    date: "2026-11-08",
    name: "Tihar begins",
    local: "तिहार · Swanti",
    approx: true,
    note: "Five days of lights. Kaag, Kukur, Gai, then Mha Puja.",
    seal: "marigold",
  },
  {
    date: "2026-11-10",
    name: "Mha Puja · Nepal Sambat New Year",
    local: "म्ह: पूजा",
    approx: true,
    newari: true,
    note: "The Newari new year — the day you worship your own self. Nepal Sambat rolls over.",
    seal: "plum",
  },
  {
    date: "2026-11-11",
    name: "Bhai Tika",
    local: "भाइटीका",
    approx: true,
    seal: "rose",
  },
  {
    date: "2026-12-23",
    name: "Yomari Punhi",
    local: "योमरी पुन्ही",
    approx: true,
    newari: true,
    note: "Steamed yomari filled with chaku and sesame. The best one, objectively.",
    seal: "marigold",
  },

  // ---------------------------------------------------------------- 2027
  {
    date: "2027-01-15",
    name: "Maghe Sankranti",
    local: "माघे संक्रान्ति",
    approx: false,
    note: "Solar, so it barely moves. Til ko laddu and tarul.",
    seal: "marigold",
  },
  {
    date: "2027-02-15",
    name: "Maha Shivaratri",
    local: "महाशिवरात्री",
    approx: true,
    seal: "dusk",
  },
  {
    date: "2027-03-22",
    name: "Holi · Fagu Purnima",
    local: "होली",
    approx: true,
    seal: "rose",
  },
  {
    date: "2027-04-14",
    name: "Nepali New Year",
    local: "नयाँ वर्ष · Baishakh 1",
    approx: false,
    note: "Solar and fixed. Bisket Jatra runs in Bhaktapur around now.",
    seal: "sky",
  },
  {
    date: "2027-04-26",
    name: "Rato Machhindranath Jatra",
    local: "रातो मछिन्द्रनाथ",
    approx: true,
    newari: true,
    patan: true,
    note: "Patan's own. The tallest chariot in the valley, dragged through Lalitpur for weeks. Your festival.",
    seal: "brick",
  },
  {
    date: "2027-05-20",
    name: "Buddha Jayanti",
    local: "बुद्ध जयन्ती",
    approx: true,
    seal: "moss",
  },
  {
    date: "2027-08-17",
    name: "Janai Purnima",
    local: "जनै पूर्णिमा",
    approx: true,
    seal: "sky",
  },
  {
    date: "2027-08-18",
    name: "Gai Jatra",
    local: "गाईजात्रा · Sa Paru",
    approx: true,
    newari: true,
    note: "The one for everyone lost that year. Grief, but funny about it.",
    seal: "plum",
  },
  {
    date: "2027-09-03",
    name: "Teej",
    local: "तीज",
    approx: true,
    seal: "rose",
  },
];

/** Festivals falling in a given month, sorted by day. */
export function festivalsIn(year: number, month: number): Festival[] {
  const prefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  return FESTIVALS.filter((f) => f.date.startsWith(prefix)).sort((a, b) =>
    a.date.localeCompare(b.date),
  );
}

/** The next few festivals on or after a given ISO date. */
export function upcomingFestivals(fromISO: string, count = 3): Festival[] {
  return FESTIVALS.filter((f) => f.date >= fromISO)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, count);
}

export function daysUntil(fromISO: string, toISO: string): number {
  const a = new Date(`${fromISO}T00:00:00`);
  const b = new Date(`${toISO}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

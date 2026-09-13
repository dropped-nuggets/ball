/**
 * Daily five-letter word game.
 *
 * The answer list is Nepal-flavoured: places, food, nature, Nepali and Newari
 * words she'd know. Guesses are checked against answers plus a wider list of
 * ordinary English words, so she isn't forced to guess only themed words.
 */

export const ANSWERS: string[] = [
  "PATAN", "MOMOS", "DHAKA", "TIHAR", "DASHI", "LASSI", "CHIYA", "GURAS",
  "YETIS", "SHERP", "KUKRI", "DHIDO", "SAGUN", "NEWAR", "TARAI", "MITHO",
  "BAJRA", "KHUKU", "RAKSI", "PANAS", "SUNGA", "HABRE", "DANPH", "MAKAI",
  "SAPTA", "AAMAA", "BHAAT", "SAAGH", "JHYAL", "POKHA",
];

/** Extra words accepted as guesses but never chosen as the answer. */
const EXTRA_GUESSES: string[] = [
  "ABOUT", "ADIEU", "AUDIO", "BEACH", "BRAIN", "BREAD", "CHAIR", "CLOUD",
  "CRANE", "DREAM", "EARTH", "FIELD", "FLAME", "FROST", "GHOST", "GRAPE",
  "GREEN", "HEART", "HOUSE", "LIGHT", "MONTH", "MOUNT", "MUSIC", "NIGHT",
  "OCEAN", "PAPER", "PEACE", "PLANT", "QUIET", "RAINY", "RIVER", "ROAST",
  "SHARE", "SHINE", "SLATE", "SMILE", "SNOWY", "SOUND", "SPICE", "STONE",
  "STORM", "SUGAR", "SWEET", "TEARS", "THINK", "TIGER", "TRAIL", "VALLEY",
  "WATER", "WHEAT", "WHERE", "WORLD", "WRITE", "YOUNG",
].filter((w) => w.length === 5);

export const VALID_GUESSES = new Set([...ANSWERS, ...EXTRA_GUESSES]);

export type Mark = "correct" | "present" | "absent";

/**
 * Standard Wordle marking, including the duplicate-letter rule: a letter is
 * only marked "present" while unmatched copies of it remain in the answer.
 */
export function scoreGuess(guess: string, answer: string): Mark[] {
  const marks: Mark[] = Array(guess.length).fill("absent");
  const remaining: Record<string, number> = {};

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      marks[i] = "correct";
    } else {
      remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1;
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (marks[i] === "correct") continue;
    const c = guess[i];
    if (remaining[c] > 0) {
      marks[i] = "present";
      remaining[c] -= 1;
    }
  }

  return marks;
}

/** Days since epoch in local time — the puzzle turns over at midnight. */
export function dayNumber(date = new Date()): number {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor(local.getTime() / 86_400_000);
}

export function answerForToday(date?: Date): string {
  return ANSWERS[dayNumber(date) % ANSWERS.length];
}

export const MAX_ROWS = 6;
export const WORD_LENGTH = 5;

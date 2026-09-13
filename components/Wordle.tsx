"use client";

import { useCallback, useEffect, useState } from "react";
import { Panel } from "./Frame";
import {
  MAX_ROWS,
  VALID_GUESSES,
  WORD_LENGTH,
  answerForToday,
  dayNumber,
  scoreGuess,
  type Mark,
} from "@/lib/wordle";

const KEYS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const SAVE_KEY = "rijuko:wordle";

const MARK_STYLE: Record<Mark, string> = {
  correct: "bg-moss border-moss text-night",
  present: "bg-seal-marigold border-seal-marigold text-night",
  absent: "bg-plum border-plum-2 text-blossom/35",
};

export default function Wordle() {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("");
  const [shake, setShake] = useState(false);

  const done =
    guesses.length >= MAX_ROWS || guesses[guesses.length - 1] === answer;
  const won = guesses[guesses.length - 1] === answer;

  // Today's word and any progress already made, resolved after mount so the
  // server's date never disagrees with hers.
  useEffect(() => {
    const today = dayNumber();
    setAnswer(answerForToday());
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { day: number; guesses: string[] };
        if (saved.day === today && Array.isArray(saved.guesses)) {
          setGuesses(saved.guesses);
        }
      }
    } catch {
      // Storage blocked; she just starts the day's puzzle fresh.
    }
  }, []);

  const submit = useCallback(() => {
    if (done || !answer) return;

    if (current.length !== WORD_LENGTH) {
      setMessage(`${WORD_LENGTH} letters.`);
      setShake(true);
      return;
    }
    if (!VALID_GUESSES.has(current)) {
      setMessage("Not in the word list.");
      setShake(true);
      return;
    }

    const next = [...guesses, current];
    setGuesses(next);
    setCurrent("");
    setMessage(
      current === answer
        ? "Got it 💜"
        : next.length >= MAX_ROWS
          ? `It was ${answer}.`
          : "",
    );

    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ day: dayNumber(), guesses: next }),
      );
    } catch {
      // Progress just won't survive a reload.
    }
  }, [answer, current, done, guesses]);

  const press = useCallback(
    (key: string) => {
      setMessage("");
      if (done) return;
      if (key === "ENTER") return submit();
      if (key === "BACK") return setCurrent((c) => c.slice(0, -1));
      if (/^[A-Z]$/.test(key)) {
        setCurrent((c) => (c.length < WORD_LENGTH ? c + key : c));
      }
    },
    [done, submit],
  );

  // Physical keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "Enter") press("ENTER");
      else if (e.key === "Backspace") press("BACK");
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  useEffect(() => {
    if (!shake) return;
    const t = setTimeout(() => setShake(false), 450);
    return () => clearTimeout(t);
  }, [shake]);

  // Best-known state per letter, for colouring the keyboard.
  const keyMarks: Record<string, Mark> = {};
  for (const guess of guesses) {
    const marks = scoreGuess(guess, answer);
    guess.split("").forEach((c, i) => {
      const existing = keyMarks[c];
      const m = marks[i];
      if (
        existing === "correct" ||
        (existing === "present" && m === "absent")
      ) {
        return;
      }
      keyMarks[c] = m;
    });
  }

  const rows = Array.from({ length: MAX_ROWS }, (_, r) => {
    if (r < guesses.length) {
      return { word: guesses[r], marks: scoreGuess(guesses[r], answer) };
    }
    if (r === guesses.length) return { word: current, marks: null };
    return { word: "", marks: null };
  });

  return (
    <Panel dark className="p-5 sm:p-6">
      <div className="mb-4 text-center">
        <h3 className="font-display text-xl text-gilt">Nepal Wordle</h3>
        <p className="mt-1 text-[11px] text-lilac/45">
          Five letters. Places, food, animals, home. New one daily.
        </p>
      </div>

      <div className="mx-auto grid w-full max-w-[19rem] gap-1.5">
        {rows.map((row, r) => (
          <div
            key={r}
            className={`grid grid-cols-5 gap-1.5 ${
              shake && r === guesses.length ? "animate-[pulse-soft_0.4s]" : ""
            }`}
          >
            {Array.from({ length: WORD_LENGTH }, (_, c) => {
              const letter = row.word[c] ?? "";
              const mark = row.marks?.[c];
              return (
                <div
                  key={c}
                  className={`grid aspect-square place-items-center rounded-lg border text-lg font-semibold uppercase transition-colors ${
                    mark
                      ? MARK_STYLE[mark]
                      : letter
                        ? "border-lilac/60 text-blossom"
                        : "border-gilt/20 text-blossom"
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p
        className={`mt-3 h-5 text-center text-sm ${
          won ? "text-moss" : "text-lilac/70"
        }`}
      >
        {message}
      </p>

      {/* On-screen keyboard. Keys flex rather than take fixed widths — ten
          fixed 28px keys plus gaps overflow a 320px phone. */}
      <div className="mx-auto mt-2 grid w-full max-w-sm gap-1.5">
        {KEYS.map((row, i) => (
          <div key={i} className="flex justify-center gap-1">
            {i === 2 && (
              <KeyCap wide onClick={() => press("ENTER")}>
                ↵
              </KeyCap>
            )}
            {row.split("").map((k) => (
              <KeyCap key={k} mark={keyMarks[k]} onClick={() => press(k)}>
                {k}
              </KeyCap>
            ))}
            {i === 2 && (
              <KeyCap wide onClick={() => press("BACK")}>
                ⌫
              </KeyCap>
            )}
          </div>
        ))}
      </div>

      {done && (
        <p className="mt-4 text-center text-xs text-lilac/45">
          Come back tomorrow for a new one.
        </p>
      )}
    </Panel>
  );
}

function KeyCap({
  children,
  onClick,
  mark,
  wide = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  mark?: Mark;
  wide?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 min-w-0 flex-1 rounded-md border text-xs font-semibold transition-colors ${
        wide ? "grow-[1.6] basis-10" : "basis-7 sm:basis-8"
      } ${
        mark
          ? MARK_STYLE[mark]
          : "border-gilt/25 bg-plum-2 text-blossom/85 hover:border-gilt/60"
      }`}
    >
      {children}
    </button>
  );
}

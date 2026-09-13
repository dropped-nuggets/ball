import Link from "next/link";
import Motes, { Skyline, Stars } from "@/components/Motes";
import Frieze from "@/components/Frieze";
import { Panel } from "@/components/Frame";
import DailyDose from "@/components/DailyDose";
import FlightPath from "@/components/FlightPath";
import WeatherPanel from "@/components/WeatherPanel";
import LocketPanel from "@/components/LocketPanel";
import {
  listChecklist,
  listDiary,
  listLetters,
  listLockets,
  listPhotos,
  listSongs,
} from "@/lib/store";
import { PLACES, getWeather, skyFor, SKY_LABEL } from "@/lib/weather";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

const HER_NAME = process.env.NEXT_PUBLIC_HER_NAME || "you";

const CARDS = [
  {
    href: "/album",
    title: "Album",
    line: "Pimbahal at golden hour, and whatever grey thing you saw today.",
    seal: "sky",
  },
  {
    href: "/diary",
    title: "Diary",
    line: "The long days, the small wins, the 3am ones.",
    seal: "moss",
  },
  {
    href: "/letters",
    title: "Letters",
    line: "Everything we couldn't say out loud, sealed and waiting.",
    seal: "rose",
  },
  {
    href: "/mixtape",
    title: "Mixtape",
    line: "Songs for missing a place. Add yours, we'll add ours.",
    seal: "plum",
  },
  {
    href: "/bingo",
    title: "UK Bingo",
    line: "Tick off the inevitable. Plus the lists we made you.",
    seal: "marigold",
  },
] as const;

export default async function Home() {
  await guardPage();

  const [photos, entries, letters, songs, items, lockets, weather] =
    await Promise.all([
      listPhotos(),
      listDiary(),
      listLetters(),
      listSongs(),
      listChecklist(),
      listLockets(20),
      getWeather(),
    ]);

  const places = PLACES.map((p) => {
    const w = weather.find((x) => x.key === p.key);
    return {
      key: p.key,
      label: p.label,
      sub: p.sub,
      timeZone: p.timeZone,
      tempC: w?.tempC ?? null,
      sky: SKY_LABEL[skyFor(w?.code ?? null)],
      isDay: w?.isDay ?? true,
    };
  });

  const unopened = letters.filter((l) => !l.opened).length;
  const bingoDone = items.filter(
    (i) => i.list === "bingo" && i.done,
  ).length;

  const counts: Record<string, string> = {
    "/album": `${photos.length} ${photos.length === 1 ? "photo" : "photos"}`,
    "/diary": `${entries.length} ${entries.length === 1 ? "entry" : "entries"}`,
    "/letters": unopened
      ? `${unopened} unopened`
      : `${letters.length} ${letters.length === 1 ? "letter" : "letters"}`,
    "/mixtape": `${songs.length} ${songs.length === 1 ? "song" : "songs"}`,
    "/bingo": `${bingoDone}/25 ticked`,
  };

  return (
    <div className="relative">
      <Stars count={50} />
      <Motes count={20} />
      <Frieze variant="valley" leaves={7} />

      <section className="relative py-10 text-center sm:py-14">
        <p className="text-[11px] tracking-[0.3em] text-moss/70">
          ज्वजलपा · PIMBAHAL → UK
        </p>
        <h1 className="anim-rise mt-4 font-display text-4xl leading-tight text-blossom sm:text-6xl">
          Lalitpur is still here,
          <br />
          <span className="text-lilac">and so are we.</span>
        </h1>
        <p
          className="anim-rise mx-auto mt-5 max-w-xl text-sm leading-relaxed text-blossom/60 sm:text-base"
          style={{ animationDelay: "0.15s" }}
        >
          A little corner of the internet for {HER_NAME} — somewhere to put the
          photos, write the days down, and read what everyone back home has to
          say. For whenever the UK feels too far from the pond.
        </p>

        <div
          className="anim-rise mt-8 flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "0.3s" }}
        >
          <Link href="/letters" className="btn-violet px-6 py-2.5 text-sm">
            Read your letters
            {unopened > 0 && (
              <span className="ml-2 rounded-full bg-seal-rose px-2 py-0.5 text-[11px] text-night">
                {unopened}
              </span>
            )}
          </Link>
          <Link
            href="/write"
            className="rounded-full border border-blossom/25 px-6 py-2.5 text-sm text-blossom/70 transition-colors hover:border-lilac hover:text-lilac"
          >
            Send her one →
          </Link>
        </div>
      </section>

      <section className="relative pb-5">
        <WeatherPanel places={places} />
      </section>

      <section className="relative grid gap-5 pb-5 lg:grid-cols-2">
        <LocketPanel initial={lockets} />
        <FlightPath />
      </section>

      <section className="relative pb-4">
        <DailyDose />
      </section>

      <div className="gilt-rule my-8" />

      <section className="grid gap-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card, i) => (
          <Link key={card.href} href={card.href} className="group">
            <Panel
              dark
              torana
              className="anim-rise h-full overflow-hidden p-6 pt-10 transition-transform duration-200 group-hover:-translate-y-1"
            >
              <div
                className="newari-brick absolute inset-0 opacity-40"
                aria-hidden
              />
              <div className="relative" style={{ animationDelay: `${0.08 * i}s` }}>
                <span
                  aria-hidden
                  className="anim-bob mb-4 block h-8 w-8 rotate-45 rounded-[7px] border"
                  style={{
                    borderColor: `var(--color-seal-${card.seal})`,
                    background: `color-mix(in srgb, var(--color-seal-${card.seal}) 20%, transparent)`,
                    boxShadow: `0 0 20px -4px var(--color-seal-${card.seal})`,
                    animationDelay: `${0.4 * i}s`,
                  }}
                />
                <h3 className="font-display text-2xl text-gilt">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-blossom/60">
                  {card.line}
                </p>
                <p className="mt-4 text-[11px] tracking-[0.18em] text-lilac/45">
                  {counts[card.href].toUpperCase()}
                </p>
              </div>
            </Panel>
          </Link>
        ))}
      </section>

      <div className="relative h-28 sm:h-36">
        <Skyline />
      </div>
    </div>
  );
}

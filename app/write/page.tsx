import WriteClient from "@/components/WriteClient";
import SendLocket from "@/components/SendLocket";
import Motes, { Leaves, Stars } from "@/components/Motes";
import { SITE_NAME } from "@/lib/site";

export const metadata = {
  title: `Write to her — ${SITE_NAME}`,
  description: "Say the thing. She'll read it.",
};

/**
 * The public page. Anyone with the link can write; nothing here reads or
 * exposes her letters, diary or photos.
 */
export default function WritePage() {
  return (
    <div className="relative min-h-dvh">
      <Stars count={40} />
      <Motes count={16} />
      <Leaves count={6} />

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:py-20">
        <div className="mb-8 text-center">
          <p className="text-[11px] tracking-[0.3em] text-moss/70">
            ज्वजलपा
          </p>
          <h1 className="mt-3 font-display text-4xl text-blossom sm:text-5xl">
            Write to her
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-blossom/55">
            She's a long way from Pimbahal. Tell her something — the stupid
            thing that happened, the thing you never said, what the street
            looks like right now. It'll be sealed until she opens it.
          </p>
        </div>

        <WriteClient />

        <div className="gilt-rule my-8" />

        <SendLocket />
      </div>
    </div>
  );
}

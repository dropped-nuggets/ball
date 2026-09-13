import { TulipBracelet } from "./Florals";
import { Stars } from "./Motes";

/**
 * The loading screen: a bracelet of purple tulips over the night sky.
 *
 * Used in two places that have to look identical, because they hand over to
 * each other mid-animation:
 *
 * 1. `app/loading.tsx`, which Next streams in while the server renders a page;
 * 2. the hold in `PageTransition`, which keeps it on screen afterwards so the
 *    animation is never cut off half-way.
 *
 * If these two ever drift apart, the handover becomes a visible jump — so they
 * share this one component rather than each drawing their own.
 *
 * No client JS: it animates on CSS and SMIL alone, which matters because this
 * is precisely the moment when JS may not have arrived yet.
 */
export default function TulipLoaderScreen({
  /** Fixed to the viewport, over the page, for the post-render hold. */
  overlay = false,
}: {
  overlay?: boolean;
}) {
  return (
    <div
      className={
        overlay
          ? "rizzu-sky fixed inset-0 z-[60] grid place-items-center"
          : "rizzu-sky fixed inset-0 z-[45] grid place-items-center"
      }
    >
      <div className="ankhi-jhyal absolute inset-0 opacity-40" aria-hidden />
      <Stars count={34} />

      <div className="relative flex flex-col items-center px-6 text-center">
        <TulipBracelet size={190} />

        <p className="mt-8 text-[11px] tracking-[0.3em] text-moss/70">ज्वजलपा</p>
        <h2 className="mt-2 font-display text-3xl tracking-[0.14em] text-gilt">
          One moment
        </h2>
        <p className="mt-2 text-xs tracking-[0.16em] text-blossom/45">
          PICKING THE TULIPS
        </p>
      </div>
    </div>
  );
}

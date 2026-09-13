import Link from "next/link";
import { notFound } from "next/navigation";
import { Panel } from "@/components/Frame";
import { Roofline } from "@/components/Torana";
import NatureArt from "@/components/NatureArt";
import { Leaves } from "@/components/Motes";
import { SPECIES } from "@/lib/nature";
import { listSpecies } from "@/lib/store";
import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function SpeciesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await guardPage();

  const { id } = await params;

  // Built-in species first, then the ones she's added herself.
  const builtIn = SPECIES.find((s) => s.id === id);
  const custom = builtIn ? null : (await listSpecies()).find((s) => s.id === id);

  if (!builtIn && !custom) notFound();

  const s = builtIn ?? custom!;
  const photoUrl = custom?.photoUrl ?? "";
  const addedBy = custom?.addedBy ?? "";

  return (
    <div className="relative">
      <Leaves count={5} />

      <Link
        href="/play"
        className="mb-5 inline-block text-sm text-lilac/60 transition-colors hover:text-lilac"
      >
        ← back to the playroom
      </Link>

      <Panel dark torana className="overflow-hidden p-6 pt-12 sm:p-8 sm:pt-14">
        <div
          className="newari-brick absolute inset-0 opacity-40"
          aria-hidden
        />

        <div className="relative">
          <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div
              className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-full"
              style={{
                background: `color-mix(in srgb, var(--color-seal-${s.seal}) 16%, transparent)`,
                border: `1px solid color-mix(in srgb, var(--color-seal-${s.seal}) 55%, transparent)`,
              }}
            >
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={s.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <NatureArt id={s.id} size={92} />
              )}
            </div>

            <div className="mt-4 min-w-0 sm:mt-0">
              <h1 className="font-display text-3xl leading-tight text-blossom sm:text-4xl">
                {s.name}
              </h1>
              {s.local && (
                <p className="mt-1 text-sm text-moss/85">{s.local}</p>
              )}
              {s.latin && (
                <p className="text-xs italic text-lilac/40">{s.latin}</p>
              )}

              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <span
                  className="rounded-full px-3 py-1 text-[11px] capitalize"
                  style={{
                    background: `color-mix(in srgb, var(--color-seal-${s.seal}) 22%, transparent)`,
                    color: `var(--color-seal-${s.seal})`,
                  }}
                >
                  {s.kind}
                </span>
                {s.status && (
                  <span className="rounded-full border border-gilt/30 px-3 py-1 text-[11px] text-blossom/70">
                    {s.status}
                  </span>
                )}
                {s.where && (
                  <span className="rounded-full border border-gilt/30 px-3 py-1 text-[11px] text-blossom/70">
                    {s.where}
                  </span>
                )}
              </div>
            </div>
          </div>

          {s.fact && (
            <>
              <div className="gilt-rule my-6" />
              <p className="letter-body text-blossom/90">{s.fact}</p>
            </>
          )}
        </div>
      </Panel>

      {s.tidbits.length > 0 && (
        <>
          <Roofline className="my-6 h-5 opacity-60" />

          <Panel dark className="p-6">
            <h2 className="mb-4 font-display text-xl text-gilt">
              Things worth knowing
            </h2>
            <ul className="space-y-3">
              {s.tidbits.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-1.5 h-2 w-2 shrink-0 rotate-45"
                    style={{
                      background: `var(--color-seal-${s.seal})`,
                      opacity: 0.85,
                    }}
                  />
                  <p className="text-sm leading-relaxed text-blossom/75">{t}</p>
                </li>
              ))}
            </ul>

            {addedBy && (
              <p className="mt-5 text-[11px] text-lilac/35">
                added by {addedBy}
              </p>
            )}
          </Panel>
        </>
      )}
    </div>
  );
}

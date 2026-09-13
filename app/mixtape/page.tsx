import MixtapeClient from "@/components/MixtapeClient";
import { SectionTitle } from "@/components/Frame";
import Motes from "@/components/Motes";
import { listSongs } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function MixtapePage() {
  await guardPage();

  const songs = await listSongs();

  return (
    <div className="relative">
      <Motes count={16} />
      <SectionTitle sub="Songs for missing a place. Anyone can add one.">
        The Mixtape
      </SectionTitle>
      <MixtapeClient initialSongs={songs} />
    </div>
  );
}

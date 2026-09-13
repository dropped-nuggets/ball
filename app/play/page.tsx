import PlayClient from "@/components/PlayClient";
import { Leaves } from "@/components/Motes";
import { listSpecies } from "@/lib/store";
import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  await guardPage();

  const customSpecies = await listSpecies();

  return (
    <div className="relative">
      <Leaves count={5} />
      <PlayClient customSpecies={customSpecies} />
    </div>
  );
}

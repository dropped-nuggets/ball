import PlayClient from "@/components/PlayClient";
import Frieze from "@/components/Frieze";
import { listSpecies } from "@/lib/store";
import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function PlayPage() {
  await guardPage();

  const customSpecies = await listSpecies();

  return (
    <div className="relative">
      <Frieze variant="jungle" />
      <PlayClient customSpecies={customSpecies} />
    </div>
  );
}

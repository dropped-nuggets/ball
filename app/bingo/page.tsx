import BingoClient from "@/components/BingoClient";
import Frieze from "@/components/Frieze";
import { listChecklist } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function BingoPage() {
  await guardPage();

  const items = await listChecklist();

  return (
    <div className="relative">
      <Frieze variant="uk" />
      <BingoClient initialItems={items} />
    </div>
  );
}

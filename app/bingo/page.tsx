import BingoClient from "@/components/BingoClient";
import { Leaves } from "@/components/Motes";
import { listChecklist } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function BingoPage() {
  await guardPage();

  const items = await listChecklist();

  return (
    <div className="relative">
      <Leaves count={5} />
      <BingoClient initialItems={items} />
    </div>
  );
}

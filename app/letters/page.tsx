import { headers } from "next/headers";
import LettersClient from "@/components/LettersClient";
import { SectionTitle } from "@/components/Frame";
import Motes from "@/components/Motes";
import { listLetters } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function LettersPage() {
  await guardPage();

  const letters = await listLetters();

  // Build the shareable write link from the request host, so it's correct in
  // local dev, on preview deployments and in production without configuration.
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = host.startsWith("localhost") ? "http" : "https";

  return (
    <div className="relative">
      <Motes count={14} />
      <SectionTitle sub="Sealed until you open them. No takebacks.">
        The Letters
      </SectionTitle>
      <LettersClient
        initialLetters={letters}
        writeUrl={`${proto}://${host}/write`}
      />
    </div>
  );
}

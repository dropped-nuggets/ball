import DiaryClient from "@/components/DiaryClient";
import { SectionTitle } from "@/components/Frame";
import Frieze from "@/components/Frieze";
import { listDiary, listPhotos } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function DiaryPage() {
  await guardPage();

  const [entries, photos] = await Promise.all([listDiary(), listPhotos()]);

  return (
    <div className="relative">
      <Frieze variant="valley" />
      <SectionTitle sub="One line counts. Stick photos on it. Make it yours.">
        The Diary
      </SectionTitle>
      <DiaryClient
        initialEntries={entries}
        albumPhotos={photos}
        blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}

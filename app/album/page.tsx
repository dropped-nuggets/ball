import AlbumClient from "@/components/AlbumClient";
import { SectionTitle } from "@/components/Frame";
import Frieze from "@/components/Frieze";
import { listPhotos } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function AlbumPage() {
  await guardPage();

  const photos = await listPhotos();

  return (
    <div className="relative">
      <Frieze variant="valley" />
      <SectionTitle sub="Home, and wherever you are now, in one place.">
        The Album
      </SectionTitle>
      <AlbumClient
        initialPhotos={photos}
        blobEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}

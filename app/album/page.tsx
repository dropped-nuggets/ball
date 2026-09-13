import AlbumClient from "@/components/AlbumClient";
import { SectionTitle } from "@/components/Frame";
import { Leaves } from "@/components/Motes";
import { listPhotos } from "@/lib/store";

import { guardPage } from "@/lib/guard";

export const dynamic = "force-dynamic";

export default async function AlbumPage() {
  await guardPage();

  const photos = await listPhotos();

  return (
    <div className="relative">
      <Leaves count={6} />
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

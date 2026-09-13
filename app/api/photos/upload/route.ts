import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

/**
 * Issues short-lived tokens so the browser can upload straight to Vercel Blob.
 *
 * Photos go browser -> Blob directly rather than through this function, which
 * keeps us clear of the 4.5 MB serverless request body limit — phone photos
 * routinely exceed it.
 */
export async function POST(request: Request): Promise<NextResponse> {
  // An unguarded token issuer lets anyone fill the blob store at her expense
  // (SEC-22). Uploading is hers alone.
  const denied = await requireAuth();
  if (denied) return denied as NextResponse;

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Blob storage is not configured." },
      { status: 501 },
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/gif",
          "image/heic",
        ],
        maximumSizeInBytes: 15 * 1024 * 1024,
        addRandomSuffix: true,
      }),
      // Required by the SDK. The client writes the row once upload resolves,
      // so there is nothing to persist here.
      onUploadCompleted: async () => {},
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

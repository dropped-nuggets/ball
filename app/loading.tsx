import TulipLoaderScreen from "@/components/TulipLoaderScreen";

/**
 * Route-level loading UI, streamed in while the server renders a page.
 *
 * `PageTransition` keeps the identical screen up for a moment after this one
 * is torn down, so the bracelet is never cut off mid-bloom.
 */
export default function Loading() {
  return <TulipLoaderScreen />;
}

import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/site";

/**
 * Makes the site installable to a phone home screen: own icon, no browser
 * chrome, opens like an app.
 *
 * This is not a home-screen *widget* — those need a native app on both iOS and
 * Android and cannot be produced by a web deployment. For an actual widget,
 * see the Scriptable recipe in the README, which reads /api/widget.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: "A piece of Pimbahal, wherever you are.",
    start_url: "/",
    display: "standalone",
    background_color: "#17111f",
    theme_color: "#17111f",
    orientation: "portrait",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}

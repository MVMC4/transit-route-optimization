/** Installable rider-app metadata and device display preferences. */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TransitOS Rider",
    short_name: "TransitOS",
    description: "Find practical combi routes across Gaborone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6fa",
    theme_color: "#0f1117",
  };
}

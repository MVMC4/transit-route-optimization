/** Installable rider-app metadata and device display preferences. */

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Tsela Rider",
    short_name: "Tsela",
    description: "Find practical combi routes across Gaborone.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f6fa",
    theme_color: "#0f1117",
  };
}

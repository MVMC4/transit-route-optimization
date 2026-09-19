/** Fumadocs page tree generated from the typed Tsela endpoint catalog. */

import type * as PageTree from "fumadocs-core/page-tree";
import { PRODUCTION_GUIDES } from "./guides";
import { REFERENCE_ENDPOINTS, REFERENCE_GROUPS } from "./reference";

export const pageTree: PageTree.Root = {
  name: "Tsela API",
  children: [
    { type: "page", name: "Overview", url: "/reference/routes/list" },
    ...REFERENCE_GROUPS.flatMap((group) => [
      { type: "separator" as const, name: group },
      ...REFERENCE_ENDPOINTS.filter((endpoint) => endpoint.group === group).map((endpoint) => ({
        type: "page" as const,
        name: endpoint.title,
        url: `/reference/${endpoint.slug}`,
      })),
    ]),
    { type: "separator", name: "Production operations" },
    ...PRODUCTION_GUIDES.map((guide) => ({
      type: "page" as const,
      name: guide.title,
      url: `/reference/${guide.slug}`,
    })),
  ],
};

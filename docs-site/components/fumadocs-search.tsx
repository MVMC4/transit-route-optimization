"use client";

/** In-memory Fumadocs search dialog for the small typed endpoint catalog. */

import { useMemo, useState } from "react";
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SearchItemType,
  type SharedProps,
} from "fumadocs-ui/components/dialog/search";
import { REFERENCE_ENDPOINTS } from "../lib/reference";

export default function TselaSearchDialog(props: SharedProps) {
  const [search, setSearch] = useState("");
  const items = useMemo<SearchItemType[]>(() => {
    const query = search.trim().toLowerCase();
    return REFERENCE_ENDPOINTS.filter((endpoint) => !query || `${endpoint.title} ${endpoint.method} ${endpoint.path} ${endpoint.description} ${endpoint.group}`.toLowerCase().includes(query)).map((endpoint) => ({
      id: endpoint.slug,
      type: "page" as const,
      url: `/reference/${endpoint.slug}`,
      content: endpoint.title,
      breadcrumbs: [endpoint.group, `${endpoint.method} ${endpoint.path}`],
    }));
  }, [search]);

  return <SearchDialog search={search} onSearchChange={setSearch} {...props}>
    <SearchDialogOverlay />
    <SearchDialogContent>
      <SearchDialogHeader><SearchDialogIcon /><SearchDialogInput placeholder="Search endpoints, methods, or paths" /><SearchDialogClose /></SearchDialogHeader>
      <SearchDialogList items={items} />
      <SearchDialogFooter><span>Tsela API reference</span><kbd>Esc</kbd></SearchDialogFooter>
    </SearchDialogContent>
  </SearchDialog>;
}

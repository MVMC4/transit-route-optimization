/** Search sitemap covering editorial pages and every Markdown-backed blog entry. */

import type { MetadataRoute } from "next";
import { listJournalPosts } from "../lib/journal";
import { SITE_URL } from "../lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/services", "/developers", "/company", "/journal", "/brand"];
  const posts = await listJournalPosts();
  return [
    ...pages.map((path, index) => ({ url: `${SITE_URL}${path}`, changeFrequency: index === 0 ? "weekly" as const : "monthly" as const, priority: index === 0 ? .9 : .7 })),
    ...posts.map((post) => ({ url: `${SITE_URL}/journal/${post.slug}`, lastModified: post.date, changeFrequency: "monthly" as const, priority: .6 })),
  ];
}

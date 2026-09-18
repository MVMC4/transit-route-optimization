/** Public metadata and index of Markdown-backed product and developer blog posts. */

import type { Metadata } from "next";
import Link from "next/link";
import { listJournalPosts } from "../../lib/journal";

export const metadata: Metadata = { title: "Build blog", description: "Tsela product decisions, route-data progress, shipped changes, and validation notes.", alternates: { canonical: "/journal" } };

export default async function JournalPage() {
  const posts = await listJournalPosts();
  return <section className="journal-index"><header className="journal-index-header"><p className="section-number">BUILD BLOG</p><h1>The network is being built in public.</h1><p>Short, plain-language notes on what changed, why it changed, and what still needs local validation.</p></header><div className="journal-list">{posts.map((post) => <Link href={`/journal/${post.slug}`} key={post.slug}><time>{new Date(`${post.date}T00:00:00`).toLocaleDateString("en-BW", { day: "2-digit", month: "short", year: "numeric" })}</time><div><span>{post.status}</span><h2>{post.title}</h2><p>{post.summary}</p></div><b>→</b></Link>)}</div></section>;
}

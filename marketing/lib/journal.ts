/** Filesystem-backed journal loader with a deliberately small, auditable frontmatter format. */

import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

export type JournalPost = { slug: string; title: string; date: string; summary: string; status: string; body: string };

const journalDirectory = path.join(process.cwd(), "content", "journal");

function parsePost(slug: string, source: string): JournalPost {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Journal post ${slug} is missing frontmatter`);
  const metadata = Object.fromEntries(match[1].split(/\r?\n/).map((line) => {
    const split = line.indexOf(":");
    return [line.slice(0, split).trim(), line.slice(split + 1).trim()];
  }));
  return { slug, title: metadata.title, date: metadata.date, summary: metadata.summary, status: metadata.status ?? "in progress", body: match[2].trim() };
}

export async function listJournalPosts(): Promise<JournalPost[]> {
  const files = (await readdir(journalDirectory)).filter((file) => file.endsWith(".md"));
  const posts = await Promise.all(files.map(async (file) => parsePost(file.replace(/\.md$/, ""), await readFile(path.join(journalDirectory, file), "utf8"))));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getJournalPost(slug: string): Promise<JournalPost | null> {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try { return parsePost(slug, await readFile(path.join(journalDirectory, `${slug}.md`), "utf8")); }
  catch { return null; }
}

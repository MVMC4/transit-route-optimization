/** Individual Markdown-backed build-journal entry with safe server-side rendering. */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownArticle } from "../../../components/markdown-article";
import { getJournalPost } from "../../../lib/journal";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await getJournalPost((await params).slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.summary, alternates: { canonical: `/journal/${post.slug}` }, openGraph: { type: "article", title: post.title, description: post.summary, publishedTime: post.date } };
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getJournalPost(slug);
  if (!post) notFound();
  return <article className="journal-article"><Link className="journal-back" href="/journal">← All blog posts</Link><header><div className="journal-meta"><time>{post.date}</time><span>{post.status}</span></div><h1>{post.title}</h1><p className="hero-lede">{post.summary}</p></header><MarkdownArticle source={post.body} /></article>;
}

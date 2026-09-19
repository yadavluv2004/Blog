import { cache } from "react";
import readingTime from "reading-time";

import type { Category, Post, PostDocument, PostMeta } from "@/lib/types";
import { extractHeadings } from "@/lib/headings";
import { slugify } from "@/lib/utils";
import { getDb } from "@/lib/db";

const COLLECTION = "posts";

function toPost(doc: PostDocument): Post {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    date: doc.date,
    category: doc.category ?? "",
    tags: doc.tags ?? [],
    coverImage: doc.coverImage ?? "",
    readingTime: doc.readingTime || readingTime(doc.content ?? "").text,
    featured: Boolean(doc.featured),
    content: doc.content ?? "",
    headings: extractHeadings(doc.content ?? ""),
  };
}

function stripContent(post: Post): PostMeta {
  const { content: _content, headings: _headings, ...meta } = post;
  return meta;
}

/**
 * Reads every published (non-draft) post from Mongo, newest first.
 *
 * Never throws: when MONGODB_URI isn't configured, or the query fails for
 * any reason, this resolves to an empty array — the same contract the
 * file-based version had for a missing content directory. Wrapped in
 * React's cache() so one render pass queries Mongo once.
 */
const readAllPosts = cache(async (): Promise<Post[]> => {
  const db = await getDb();
  if (!db) return [];

  try {
    const docs = await db
      .collection<PostDocument>(COLLECTION)
      .find({ draft: { $ne: true } })
      .sort({ date: -1 })
      .toArray();
    return docs.map(toPost);
  } catch (error) {
    console.warn("[mongo] failed to read posts:", error);
    return [];
  }
});

/** All published posts, newest first. */
export async function getAllPosts(): Promise<PostMeta[]> {
  const posts = await readAllPosts();
  return posts.map(stripContent);
}

/** Full post — including body and headings — or null if the slug doesn't exist. */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await readAllPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

/**
 * Records one view of a post. Called from the post page itself — real
 * traffic only, never backfilled or estimated. Awaited by the caller (not
 * fire-and-forget) because on serverless the function can be frozen the
 * instant the response is sent, which would silently drop an un-awaited
 * write. Never throws: an unconfigured or unreachable Mongo just means the
 * count doesn't increment this time, not a broken page.
 *
 * Caveat worth knowing: this counts every render of the page, including
 * search-engine crawlers and your own visits — it's a real number, not a
 * unique-visitor count.
 */
export async function incrementPostViews(slug: string): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await db.collection<PostDocument>(COLLECTION).updateOne({ slug }, { $inc: { views: 1 } });
  } catch (error) {
    console.warn("[mongo] failed to record a post view:", error);
  }
}

/**
 * The post to feature on the homepage: the first post explicitly marked
 * `featured: true`, else the most recent post, else null when there are no
 * posts at all. Never fabricates a post.
 */
export async function getFeaturedPost(): Promise<PostMeta | null> {
  const posts = await readAllPosts();
  if (posts.length === 0) return null;
  const explicit = posts.find((p) => p.featured);
  return stripContent(explicit ?? posts[0]);
}

/** The N most recent posts. */
export async function getLatestPosts(limit = 6): Promise<PostMeta[]> {
  const posts = await readAllPosts();
  return posts.slice(0, limit).map(stripContent);
}

/** Categories derived from real posts, most-used first. Empty when no posts have a category. */
export async function getCategories(): Promise<Category[]> {
  const posts = await readAllPosts();
  const counts = new Map<string, number>();

  for (const post of posts) {
    const name = post.category.trim();
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Posts related to `slug`, ranked by shared category (+3) and each shared
 * tag (+1). Falls back to the most recent other posts when nothing scores,
 * so the section still has something reasonable to show rather than
 * inventing a "related" relationship that doesn't exist.
 */
export async function getRelatedPosts(slug: string, limit = 3): Promise<PostMeta[]> {
  const posts = await readAllPosts();
  const current = posts.find((p) => p.slug === slug);
  if (!current) return [];

  const others = posts.filter((p) => p.slug !== slug);

  const scored = others
    .map((post) => {
      let score = 0;
      if (current.category && post.category === current.category) score += 3;
      score += post.tags.filter((t) => current.tags.includes(t)).length;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1));

  const related = scored.filter((s) => s.score > 0).slice(0, limit);
  const picked = related.length > 0 ? related : scored.slice(0, limit);

  return picked.map((s) => stripContent(s.post));
}

/** The chronologically previous/next post relative to `slug`, or null at either edge. */
export async function getAdjacentPosts(
  slug: string,
): Promise<{ prev: PostMeta | null; next: PostMeta | null }> {
  const posts = await readAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  // posts is sorted newest-first, so the chronologically "next" post (newer)
  // is the previous array element, and "prev" (older) is the next element.
  const next = index > 0 ? posts[index - 1] : null;
  const prev = index < posts.length - 1 ? posts[index + 1] : null;

  return {
    prev: prev ? stripContent(prev) : null,
    next: next ? stripContent(next) : null,
  };
}

/** Lightweight index for the client-side search dialog — no post bodies. */
export interface SearchIndexEntry {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
}

export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  const posts = await getAllPosts();
  return posts.map(({ slug, title, description, category, tags }) => ({
    slug,
    title,
    description,
    category,
    tags,
  }));
}

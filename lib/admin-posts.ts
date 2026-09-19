import "server-only";

import { ObjectId } from "mongodb";
import readingTime from "reading-time";

import type { PostDocument, PostInput } from "@/lib/types";
import { getDbWithStatus } from "@/lib/db";
import { slugify } from "@/lib/utils";

const COLLECTION = "posts";

export class AdminPostsUnavailableError extends Error {
  constructor(status: "not_configured" | "connection_failed") {
    super(
      status === "not_configured"
        ? "MONGODB_URI is not configured — set it in .env.local to manage posts."
        : "Couldn't connect to MongoDB. If MONGODB_URI looks correct, check Atlas → Network Access — the connecting IP is most likely not in the allow list yet.",
    );
    this.name = "AdminPostsUnavailableError";
  }
}

async function requireDb() {
  const { db, status } = await getDbWithStatus();
  if (!db) throw new AdminPostsUnavailableError(status === "ok" ? "connection_failed" : status);
  return db;
}

/** Everything the admin dashboard table needs — includes drafts, excludes body content. */
export interface AdminPostSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  featured: boolean;
  draft: boolean;
  views: number;
}

function toSummary(doc: PostDocument): AdminPostSummary {
  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    date: doc.date,
    category: doc.category ?? "",
    featured: Boolean(doc.featured),
    draft: Boolean(doc.draft),
    views: doc.views ?? 0,
  };
}

/** All posts — including drafts — newest first, for the /admin dashboard. */
export async function listAllPostsAdmin(): Promise<AdminPostSummary[]> {
  const db = await requireDb();
  const docs = await db.collection<PostDocument>(COLLECTION).find({}).sort({ date: -1 }).toArray();
  return docs.map(toSummary);
}

/** Full post document by id, for the edit form. Null if the id is invalid or not found. */
export async function getPostByIdAdmin(id: string): Promise<PostDocument | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await requireDb();
  return db.collection<PostDocument>(COLLECTION).findOne({ _id: new ObjectId(id) });
}

async function uniqueSlug(db: Awaited<ReturnType<typeof requireDb>>, base: string, excludeId?: string) {
  let candidate = base;
  let suffix = 2;

  for (;;) {
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: new ObjectId(excludeId) };
    const existing = await db.collection<PostDocument>(COLLECTION).findOne(filter);
    if (!existing) return candidate;
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
}

function normalize(input: PostInput) {
  return {
    title: input.title.trim(),
    description: input.description.trim(),
    date: input.date,
    category: input.category.trim(),
    tags: input.tags.map((t) => t.trim()).filter(Boolean),
    coverImage: input.coverImage.trim(),
    readingTime: input.readingTime?.trim() || readingTime(input.content).text,
    featured: Boolean(input.featured),
    draft: Boolean(input.draft),
    content: input.content,
  };
}

/** Creates a new post. Slug defaults to a slugified title and is made unique automatically. */
export async function createPost(input: PostInput): Promise<{ id: string; slug: string }> {
  const db = await requireDb();
  const base = slugify(input.slug?.trim() || input.title);
  const slug = await uniqueSlug(db, base || "post");
  const now = new Date().toISOString();

  const doc: Omit<PostDocument, "_id"> = {
    slug,
    ...normalize(input),
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection<Omit<PostDocument, "_id">>(COLLECTION).insertOne(doc);
  return { id: String(result.insertedId), slug };
}

/** Updates an existing post by id. Re-derives a unique slug if the slug field changed. */
export async function updatePost(id: string, input: PostInput): Promise<{ slug: string } | null> {
  if (!ObjectId.isValid(id)) return null;
  const db = await requireDb();

  const objectId = new ObjectId(id);
  const existing = await db.collection<PostDocument>(COLLECTION).findOne({ _id: objectId });
  if (!existing) return null;

  const requestedBase = slugify(input.slug?.trim() || input.title);
  const slug =
    requestedBase === existing.slug ? existing.slug : await uniqueSlug(db, requestedBase || "post", id);

  await db.collection<PostDocument>(COLLECTION).updateOne(
    { _id: objectId },
    {
      $set: {
        slug,
        ...normalize(input),
        updatedAt: new Date().toISOString(),
      },
    },
  );

  return { slug };
}

export async function deletePost(id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const db = await requireDb();
  const result = await db.collection<PostDocument>(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

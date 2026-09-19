/**
 * Shared content and configuration types.
 *
 * `PostMeta` is everything about a post except its body. It is what crosses
 * into client components (search, filtering, cards). The full `Post` — which
 * carries the raw MDX source — never leaves the server.
 *
 * Posts are stored in MongoDB (see lib/db.ts) and authored through the
 * password-gated /admin UI, not as files on disk.
 */

export interface Heading {
  /** Slug that matches the id rehype-slug generates for the rendered heading. */
  id: string;
  text: string;
  /** 2 or 3. h1 belongs to the page title, h4+ is too deep for a TOC. */
  level: 2 | 3;
}

export interface PostMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  /** ISO date string. */
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  /** Human readable, e.g. "6 min read". Computed when not overridden. */
  readingTime: string;
  featured: boolean;
}

export interface Post extends PostMeta {
  /** Raw MDX body, server-side only. */
  content: string;
  headings: Heading[];
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

/**
 * Shape of the Mongo `posts` document, as stored (dates as ISO strings).
 * `ObjectId` is imported type-only, so this stays a compile-time-only
 * dependency — no mongodb code ships to the client through this file.
 */
export interface PostDocument {
  _id: import("mongodb").ObjectId;
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  readingTime: string;
  featured: boolean;
  draft: boolean;
  content: string;
  createdAt: string;
  updatedAt: string;
  /**
   * Optional so existing documents created before this field existed don't
   * need a migration — every reader treats a missing value as 0.
   */
  views?: number;
}

/** Fields the admin create/edit form submits. */
export interface PostInput {
  title: string;
  slug?: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  coverImage: string;
  readingTime?: string;
  featured: boolean;
  draft: boolean;
  content: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  locale: string;
  author: {
    name: string;
    role: string;
    bio: string;
    avatar: string;
    email: string;
  };
  socials: SocialLink[];
  newsletter: {
    enabled: boolean;
    description: string;
  };
  giscus: {
    repo: string;
    repoId: string;
    category: string;
    categoryId: string;
  };
}

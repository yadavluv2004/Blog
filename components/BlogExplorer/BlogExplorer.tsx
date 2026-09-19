"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, PostMeta } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { BlogGrid } from "@/components/BlogGrid";
import { CategoryFilter } from "@/components/CategoryFilter";
import styles from "./BlogExplorer.module.css";

interface BlogExplorerProps {
  posts: PostMeta[];
  categories: Category[];
}

/**
 * Owns search + category filter state for /blog. Filtering happens
 * in-memory over metadata already loaded server-side — no network round
 * trip — and state mirrors into the URL (?q=&category=) so results are
 * shareable and back/forward navigation works.
 */
export function BlogExplorer({ posts, categories }: BlogExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState<string | null>(searchParams.get("category"));

  function syncUrl(nextQuery: string, nextCategory: string | null) {
    const params = new URLSearchParams();
    if (nextQuery) params.set("q", nextQuery);
    if (nextCategory) params.set("category", nextCategory);
    const search = params.toString();
    startTransition(() => {
      router.replace(search ? `/blog?${search}` : "/blog", { scroll: false });
    });
  }

  function handleQueryChange(value: string) {
    setQuery(value);
    syncUrl(value, category);
  }

  function handleCategoryChange(value: string | null) {
    setCategory(value);
    syncUrl(query, value);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (category && slugify(post.category) !== category) return false;
      if (!q) return true;
      const haystack = [post.title, post.description, post.category, ...post.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [posts, query, category]);

  return (
    <div className={styles.wrap}>
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="17"
            height="17"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(event) => handleQueryChange(event.target.value)}
            placeholder="Search posts…"
            aria-label="Search posts"
            className={styles.searchInput}
          />
        </div>

        {categories.length > 0 && (
          <CategoryFilter categories={categories} active={category} onChange={handleCategoryChange} />
        )}
      </div>

      <BlogGrid
        posts={filtered}
        emptyTitle={posts.length === 0 ? "No posts yet." : "No posts match your search."}
        emptyDescription={
          posts.length === 0
            ? "Check back soon — new posts will show up here automatically."
            : "Try a different search term or category."
        }
      />
    </div>
  );
}

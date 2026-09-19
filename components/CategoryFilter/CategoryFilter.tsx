"use client";

import type { Category } from "@/lib/types";
import styles from "./CategoryFilter.module.css";

interface CategoryFilterProps {
  categories: Category[];
  active: string | null;
  onChange: (categorySlug: string | null) => void;
}

/**
 * Category chips for the /blog explorer. The caller (BlogExplorer) only
 * renders this when categories is non-empty.
 */
export function CategoryFilter({ categories, active, onChange }: CategoryFilterProps) {
  return (
    <div className={styles.wrap} role="group" aria-label="Filter by category">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`${styles.chip} ${active === null ? styles.active : ""}`}
        aria-pressed={active === null}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => onChange(category.slug)}
          className={`${styles.chip} ${active === category.slug ? styles.active : ""}`}
          aria-pressed={active === category.slug}
        >
          {category.name}
          <span className={styles.count}>{category.count}</span>
        </button>
      ))}
    </div>
  );
}

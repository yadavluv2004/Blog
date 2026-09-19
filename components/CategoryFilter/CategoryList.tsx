import Link from "next/link";
import type { Category } from "@/lib/types";
import { Section } from "@/components/Section";
import styles from "./CategoryList.module.css";

interface CategoryListProps {
  categories: Category[];
}

/**
 * Homepage categories section. Only ever rendered by the caller when
 * `categories` is non-empty — see app/(site)/page.tsx — so there is no
 * internal empty state.
 */
export function CategoryList({ categories }: CategoryListProps) {
  return (
    <Section border>
      <h2 className={`text-h2 ${styles.heading}`}>Browse by category</h2>
      <ul className={styles.list}>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link href={`/blog?category=${category.slug}`} className={styles.chip}>
              {category.name}
              <span className={styles.count}>{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import styles from "./PostNavigation.module.css";

interface PostNavigationProps {
  prev: PostMeta | null;
  next: PostMeta | null;
}

/** Previous/next post links. Each side renders only when that post exists. */
export function PostNavigation({ prev, next }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav aria-label="More posts" className={styles.grid}>
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className={`${styles.card} ${styles.prev}`}>
          <span className={styles.direction}>← Previous</span>
          <span className={styles.title}>{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={`/blog/${next.slug}`} className={`${styles.card} ${styles.next}`}>
          <span className={styles.direction}>Next →</span>
          <span className={styles.title}>{next.title}</span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}

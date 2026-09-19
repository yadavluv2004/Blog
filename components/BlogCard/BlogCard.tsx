import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/types";
import { formatDateShort } from "@/lib/utils";
import styles from "./BlogCard.module.css";

interface BlogCardProps {
  post: PostMeta;
  /** Slightly larger treatment for the single featured card. */
  featured?: boolean;
}

export function BlogCard({ post, featured }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${styles.card} ${featured ? styles.featured : ""}`}
    >
      {post.coverImage ? (
        <div className={styles.imageWrap}>
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes={featured ? "(min-width: 768px) 640px, 100vw" : "(min-width: 768px) 380px, 100vw"}
            className={styles.image}
          />
        </div>
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        {post.category && <span className={styles.category}>{post.category}</span>}
        <h3 className={styles.title}>{post.title}</h3>
        {post.description && <p className={styles.description}>{post.description}</p>}
        <div className={styles.meta}>
          <time dateTime={post.date}>{formatDateShort(post.date)}</time>
          {post.readingTime && (
            <>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

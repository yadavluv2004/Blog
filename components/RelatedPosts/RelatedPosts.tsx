import type { PostMeta } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import styles from "./RelatedPosts.module.css";

interface RelatedPostsProps {
  posts: PostMeta[];
}

/** Only ever rendered by the caller when posts is non-empty — see app/blog/[slug]/page.tsx. */
export function RelatedPosts({ posts }: RelatedPostsProps) {
  return (
    <div>
      <h2 className={`text-h2 ${styles.heading}`}>Related posts</h2>
      <div className={styles.grid}>
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}

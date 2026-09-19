import type { PostMeta } from "@/lib/types";
import { BlogCard } from "@/components/BlogCard";
import { EmptyState } from "@/components/EmptyState";
import styles from "./BlogGrid.module.css";

interface BlogGridProps {
  posts: PostMeta[];
  emptyTitle?: string;
  emptyDescription?: string;
}

export function BlogGrid({
  posts,
  emptyTitle = "No posts yet.",
  emptyDescription,
}: BlogGridProps) {
  if (posts.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <BlogCard key={post.slug} post={post} />
      ))}
    </div>
  );
}

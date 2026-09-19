import type { PostMeta } from "@/lib/types";
import { Section } from "@/components/Section";
import { BlogCard } from "@/components/BlogCard";
import styles from "./FeaturedPost.module.css";

interface FeaturedPostProps {
  post: PostMeta;
}

/**
 * Only ever rendered by the caller when a real featured post exists — see
 * app/page.tsx. There is no internal empty state because this component
 * should never mount with nothing to show.
 */
export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Section border>
      <p className={styles.eyebrow}>Featured</p>
      <BlogCard post={post} featured />
    </Section>
  );
}

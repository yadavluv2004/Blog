import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts, getCategories } from "@/lib/blogs";
import { Section } from "@/components/Section";
import { BlogExplorer } from "@/components/BlogExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "All posts.",
};

// Posts live in MongoDB and can change at any time via /admin.
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  return (
    <Section>
      <div className={styles.heading}>
        <h1 className="text-h1">Blog</h1>
        <p className="text-muted">
          {posts.length > 0
            ? `${posts.length} post${posts.length === 1 ? "" : "s"}, on software, design and everything between.`
            : "Nothing published yet — new posts will appear here automatically."}
        </p>
      </div>

      <Suspense fallback={null}>
        <BlogExplorer posts={posts} categories={categories} />
      </Suspense>
    </Section>
  );
}

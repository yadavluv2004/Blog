import Link from "next/link";
import { getFeaturedPost, getLatestPosts, getCategories } from "@/lib/blogs";
import { Hero } from "@/components/Hero";
import { FeaturedPost } from "@/components/FeaturedPost";
import { BlogGrid } from "@/components/BlogGrid";
import { CategoryList } from "@/components/CategoryFilter";
import { Newsletter } from "@/components/Newsletter";
import { Section } from "@/components/Section";
import styles from "./page.module.css";

// Posts live in MongoDB and can change at any time via /admin.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featured, latest, categories] = await Promise.all([
    getFeaturedPost(),
    // Fetch one extra: the featured post gets filtered back out below, so
    // without this a full 6-post grid would only ever show 5 whenever one
    // of the 6 latest happens to also be the featured post.
    getLatestPosts(7),
    getCategories(),
  ]);

  // The featured post also appears in "latest" — don't show it twice.
  const latestWithoutFeatured = (featured ? latest.filter((post) => post.slug !== featured.slug) : latest).slice(
    0,
    6,
  );

  // True "no posts at all" only when there's neither a featured post nor
  // anything left in latest — if the only post that exists IS the featured
  // one, there's nothing more to show here, but that's not the same as
  // having zero posts, so the section is hidden rather than showing a
  // false "No posts yet."
  const hasNothingMoreToShow = latestWithoutFeatured.length === 0 && featured;

  return (
    <>
      <Hero />

      {featured && <FeaturedPost post={featured} />}

      {!hasNothingMoreToShow && (
        <Section border={!featured}>
          <div className={styles.sectionHeading}>
            <h2 className="text-h2">Latest posts</h2>
            {latestWithoutFeatured.length > 0 && (
              <Link href="/blog" className={styles.viewAll}>
                View all →
              </Link>
            )}
          </div>
          <BlogGrid posts={latestWithoutFeatured} />
        </Section>
      )}

      {categories.length > 0 && <CategoryList categories={categories} />}

      <Newsletter />
    </>
  );
}

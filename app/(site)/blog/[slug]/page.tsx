import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAdjacentPosts, getRelatedPosts, incrementPostViews } from "@/lib/blogs";
import { site, authorName } from "@/site.config";
import { formatDate, safeJsonLd } from "@/lib/utils";
import { Container } from "@/components/Container";
import { Article } from "@/components/Article";
import { TableOfContents } from "@/components/TableOfContents";
import { ShareButtons } from "@/components/ShareButtons";
import { PostNavigation } from "@/components/PostNavigation";
import { RelatedPosts } from "@/components/RelatedPosts";
import { Comments } from "@/components/Comments";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Posts live in MongoDB and can be added/edited from /admin at any time, so
// this page always reads fresh rather than relying on a build-time list of
// known slugs.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const url = site.url ? `${site.url}/blog/${post.slug}` : undefined;

  return {
    title: post.title,
    description: post.description,
    alternates: url ? { canonical: url } : undefined,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [{ prev, next }, related] = await Promise.all([
    getAdjacentPosts(slug),
    getRelatedPosts(slug),
    incrementPostViews(slug),
  ]);

  const url = site.url ? `${site.url}/blog/${post.slug}` : `/blog/${post.slug}`;
  const showToc = post.headings.length >= 3;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(authorName ? { author: { "@type": "Person", name: authorName } } : {}),
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <article>
      {/*
        Next.js's own recommended pattern for JSON-LD — a data script, not
        executable code. React 19 flags any <script> element rendered by a
        component (including this one, and this exact pattern in Next's own
        docs), but it's a known dev-only false positive here: the tag is
        part of the server-rendered HTML crawlers read, so nothing is
        actually broken. safeJsonLd escapes `<` so admin-entered content
        can't break out of the tag.
      */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />

      <header className={styles.header}>
        <Container narrow>
          {post.category && <p className={styles.category}>{post.category}</p>}
          <h1 className={`text-display ${styles.title}`}>{post.title}</h1>
          {post.description && <p className={`text-lead ${styles.description}`}>{post.description}</p>}

          <div className={styles.meta}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {authorName && (
              <>
                <span aria-hidden="true">·</span>
                <span>{authorName}</span>
              </>
            )}
            {post.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime}</span>
              </>
            )}
          </div>
        </Container>
      </header>

      {post.coverImage && (
        <Container>
          <div className={styles.coverWrap}>
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className={styles.cover}
            />
          </div>
        </Container>
      )}

      <Container>
        <div className={showToc ? styles.layout : styles.layoutNoToc}>
          <div className={styles.main}>
            <Article content={post.content} />

            {post.tags.length > 0 && (
              <ul className={styles.tags}>
                {post.tags.map((tag) => (
                  <li key={tag} className={styles.tag}>
                    {tag}
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.shareRow}>
              <ShareButtons url={url} title={post.title} />
            </div>

            <div className={styles.section}>
              <PostNavigation prev={prev} next={next} />
            </div>

            {related.length > 0 && (
              <div className={styles.section}>
                <RelatedPosts posts={related} />
              </div>
            )}

            <div className={styles.section}>
              <Comments />
            </div>
          </div>

          {showToc && (
            <aside className={styles.tocSlot}>
              <TableOfContents headings={post.headings} />
            </aside>
          )}
        </div>
      </Container>

      <div className={styles.backRow}>
        <Container>
          <Link href="/blog" className={styles.backLink}>
            ← Back to all posts
          </Link>
        </Container>
      </div>
    </article>
  );
}

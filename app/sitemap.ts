import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blogs";
import { site } from "@/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url || "http://localhost:3000";
  const posts = await getAllPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...postRoutes];
}

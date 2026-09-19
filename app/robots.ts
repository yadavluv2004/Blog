import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  const base = site.url || "http://localhost:3000";

  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${base}/sitemap.xml`,
  };
}

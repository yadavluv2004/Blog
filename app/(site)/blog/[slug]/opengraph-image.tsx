import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blogs";
import { site, authorName } from "@/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Posts live in MongoDB and can be added at any time via /admin, so this
// image is generated per-request rather than for a fixed, build-time list
// of slugs.
export const dynamic = "force-dynamic";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const title = post?.title ?? site.title ?? "Untitled";
  const category = post?.category;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#ffffff",
          color: "#111113",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#3c83f6", fontWeight: 600 }}>
          {category || " "}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6b6b73" }}>{authorName || " "}</div>
      </div>
    ),
    { ...size },
  );
}

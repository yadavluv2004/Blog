import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // The admin cover-image field accepts any URL, and there's no way to
    // know its host ahead of time — so this allows any https image rather
    // than requiring a next.config.ts edit + redeploy every time a new
    // post uses a new image host. Safe here because only you (the admin)
    // can ever set a coverImage value; tighten this to specific hostnames
    // if that stops being true.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

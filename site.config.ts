import type { SiteConfig } from "@/lib/types";

/**
 * The only file you need to edit to make this site yours.
 *
 * Every value ships empty on purpose. Nothing here is faked, and every
 * consumer checks before it renders — an empty field means the UI element
 * is hidden or falls back to a neutral state rather than showing a
 * placeholder. Fill these in gradually; the site stays coherent at every
 * stage of being filled in.
 */
export const site: SiteConfig = {
  /** Shown in the navbar, the footer and the browser title. */
  name: "Luv Yadav",

  /** Falls back to `name` when empty. Used as the homepage <title>. */
  title: "",

  /** Meta description for the homepage and the default Open Graph card. */
  description: "",

  /**
   * Canonical origin, e.g. "https://yoursite.com". No trailing slash.
   * Reads NEXT_PUBLIC_SITE_URL first so previews and production can differ.
   * Sitemap and Open Graph URLs need this to be absolute.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "",

  locale: "en",

  author: {
    /** Falls back to `site.name` when empty. */
    name: "Luv Yadav",
    /** One line under your name in the hero, e.g. "Software engineer". */
    role: "Software Engineer",
    /** 1–2 sentences for the hero. */
    bio: "Full-stack software engineer building AI-powered products used by thousands of users daily.",
    /** Path under /public, e.g. "/images/avatar.jpg". Empty → neutral block. */
    avatar: "/images/avatar.jpg",
    /** Enables the navbar Contact button as a mailto: link. Hidden while empty. */
    email: "yadav.luv2004@gmail.com",
  },

  /**
   * Footer social row. Hidden entirely while empty.
   */
  socials: [
    { label: "GitHub", href: "https://github.com/yadavluv2004" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/luv-yadav-989424263/" },
    { label: "X", href: "https://x.com/yadav_luv2004" },
  ],

  newsletter: {
    /**
     * Leave false until you wire a provider in app/api/subscribe/route.ts.
     * While false the form renders disabled and says it is not connected —
     * it never pretends a subscription succeeded.
     */
    enabled: false,
    description: "",
  },

  /**
   * Comments, powered by GitHub Discussions. Get these four values from
   * https://giscus.app after enabling Discussions on a public repo.
   * The comments section does not render at all until repoId is set.
   */
  giscus: {
    repo: "",
    repoId: "",
    category: "",
    categoryId: "",
  },
};

/** Display name with sensible fallbacks, never an empty string in the UI. */
export const authorName = site.author.name || site.name;
export const siteTitle = site.title || site.name;

export default site;

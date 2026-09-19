/** Small, dependency-free helpers shared across components. */

/** Formats an ISO date string for display, e.g. "September 18, 2026". */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Short form for cards, e.g. "Sep 18, 2026". */
export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

/**
 * URL-safe slug. Mirrors the id rehype-slug generates (lowercase, spaces and
 * non-word characters become single hyphens) so links from lib/headings.ts
 * always match the ids rendered on the page.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Joins class names, skipping falsy values. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * JSON.stringify for embedding in a <script type="application/ld+json">.
 * Post titles/descriptions come from the admin form, so this escapes `<`
 * as < per Next.js's own JSON-LD guidance — otherwise a value like
 * `</script><script>...` could break out of the tag.
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

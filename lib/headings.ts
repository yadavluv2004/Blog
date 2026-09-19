import type { Heading } from "@/lib/types";
import { slugify } from "@/lib/utils";

/**
 * Extracts h2/h3 headings from raw MDX source for the table of contents.
 *
 * Scans line by line tracking fenced-code-block state, so a `#` inside a
 * ```code block``` is never mistaken for a heading. IDs are generated with
 * the same slugify rule rehype-slug uses at render time, and duplicates are
 * disambiguated the same way (`-1`, `-2`, ...) so TOC links always resolve.
 */
export function extractHeadings(source: string): Heading[] {
  const headings: Heading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;

  for (const rawLine of source.split("\n")) {
    const line = rawLine.trim();

    if (/^(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+)$/.exec(line);
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/#+$/, "").trim();
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    headings.push({ id, text, level });
  }

  return headings;
}

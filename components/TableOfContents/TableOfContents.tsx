"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/types";
import styles from "./TableOfContents.module.css";

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * Sticky on desktop (positioned by the parent grid in the article layout),
 * a collapsible <details> on mobile. Hidden entirely by the caller when an
 * article has fewer than 3 headings — see Article layout in
 * app/blog/[slug]/page.tsx.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const list = (
    <ul className={styles.list}>
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? styles.nested : undefined}>
          <a
            href={`#${heading.id}`}
            className={`${styles.link} ${activeId === heading.id ? styles.active : ""}`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <nav aria-label="Table of contents" className={styles.desktop}>
        <p className={styles.heading}>On this page</p>
        {list}
      </nav>

      <details className={styles.mobile}>
        <summary className={styles.mobileSummary}>On this page</summary>
        {list}
      </details>
    </>
  );
}

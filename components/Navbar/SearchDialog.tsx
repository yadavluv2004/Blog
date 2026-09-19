"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SearchIndexEntry } from "@/lib/blogs";
import styles from "./SearchDialog.module.css";

interface SearchDialogProps {
  index: SearchIndexEntry[];
}

/**
 * Client-side search over a pre-built lightweight index (title, description,
 * category, tags — no post bodies). With zero posts, the trigger still
 * renders but the dialog opens straight to an honest "no posts yet" state
 * instead of an input that can't do anything.
 */
export function SearchDialog({ index }: SearchDialogProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isShortcut) {
        event.preventDefault();
        setOpen((v) => !v);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    return () => {
      document.body.style.overflow = original;
      cancelAnimationFrame(raf);
    };
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return index.slice(0, 8);
    return index
      .filter((entry) =>
        [entry.title, entry.description, entry.category, ...entry.tags]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
      .slice(0, 8);
  }, [index, query]);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label="Search posts"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            id={dialogId}
            className={styles.dialog}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.inputRow}>
              <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search posts…"
                className={styles.input}
                aria-label="Search posts"
              />
              <kbd className={styles.esc}>Esc</kbd>
            </div>

            <div className={styles.results}>
              {index.length === 0 ? (
                <p className={styles.empty}>No posts yet.</p>
              ) : results.length === 0 ? (
                <p className={styles.empty}>No results for &ldquo;{query}&rdquo;.</p>
              ) : (
                <ul className={styles.list}>
                  {results.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={`/blog/${entry.slug}`}
                        className={styles.result}
                        onClick={() => setOpen(false)}
                      >
                        <span className={styles.resultTitle}>{entry.title}</span>
                        {entry.category && (
                          <span className={styles.resultMeta}>{entry.category}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

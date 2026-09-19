"use client";

import { useState } from "react";
import styles from "./ShareButtons.module.css";

interface ShareButtonsProps {
  url: string;
  title: string;
}

/**
 * Plain share-intent links to X and LinkedIn, plus a copy-link button.
 * No SDKs, no trackers, no share-count APIs (which would need fake numbers
 * before anyone has actually shared the post).
 */
export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — fail silently.
    }
  }

  return (
    <div className={styles.wrap} aria-label="Share this post">
      <span className={styles.label}>Share</span>
      <a href={xHref} target="_blank" rel="noopener noreferrer" className={styles.button} aria-label="Share on X">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.3l5.1 6.7L18.9 2Zm-1.3 18h2L7.5 4h-2l12.1 16Z" />
        </svg>
      </a>
      <a href={linkedInHref} target="_blank" rel="noopener noreferrer" className={styles.button} aria-label="Share on LinkedIn">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-1 1.83-2 3.77-2 4.04 0 4.78 2.6 4.78 6v6.3h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V21h-4V9Z" />
        </svg>
      </a>
      <button type="button" onClick={handleCopy} className={styles.button} aria-label={copied ? "Link copied" : "Copy link"}>
        {copied ? (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="12" height="12" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>
    </div>
  );
}

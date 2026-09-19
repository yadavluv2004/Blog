"use client";

import { useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import styles from "./CodeBlock.module.css";

type CodeBlockProps = HTMLAttributes<HTMLPreElement>;

/**
 * Wraps Shiki's <pre> output (mapped via mdx-components.tsx) and adds a
 * copy button. Forwards every prop Shiki puts on <pre> — its "shiki"
 * className and the --shiki-light-bg/--shiki-dark-bg style variables —
 * onto the real element, since that's what prose.css's dual-theme
 * selectors key off. Reads the rendered text directly from the DOM rather
 * than re-deriving it from children, so it always copies exactly what's
 * shown regardless of how Shiki structures the highlighted spans.
 */
export function CodeBlock({ children, ...rest }: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = preRef.current?.textContent ?? "";
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — fail silently.
    }
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        onClick={handleCopy}
        className={styles.copyButton}
        aria-label={copied ? "Copied" : "Copy code"}
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre ref={preRef} {...rest}>
        {children}
      </pre>
      <span className="visually-hidden" role="status" aria-live="polite">
        {copied ? "Code copied to clipboard" : ""}
      </span>
    </div>
  );
}

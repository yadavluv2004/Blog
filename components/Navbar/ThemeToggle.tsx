"use client";

import { useEffect, useState } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // Private browsing / blocked storage — theme still applies for this view.
  }
}

/**
 * Reads the theme the blocking inline script (in layout.tsx) already
 * applied to <html> before hydration, so there is no flash and no
 * mismatch between server and client markup.
 */
function readCurrentTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readCurrentTheme());
  }, []);

  function toggle() {
    const next: Theme = (theme ?? readCurrentTheme()) === "dark" ? "light" : "dark";
    applyTheme(next);
    setTheme(next);
  }

  // Render a stable, non-flashing icon slot until mounted.
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.sun}
      >
        <circle cx="12" cy="12" r="4.5" />
        <path d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={styles.moon}
      >
        <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
      </svg>
    </button>
  );
}

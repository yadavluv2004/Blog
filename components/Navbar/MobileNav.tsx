"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./MobileNav.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`${styles.bar} ${open ? styles.barOpenTop : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpenMid : ""}`} />
        <span className={`${styles.bar} ${open ? styles.barOpenBottom : ""}`} />
      </button>

      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={styles.panel}
        >
          <nav>
            <ul className={styles.list}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { site, authorName } from "@/site.config";
import { Container } from "@/components/Container";
import styles from "./Footer.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.top}>
          <div className={styles.brand}>
            {authorName && <span className={styles.name}>{authorName}</span>}
          </div>

          <nav aria-label="Footer">
            <ul className={styles.links}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {site.socials.length > 0 && (
            <ul className={styles.socials}>
              {site.socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className={styles.copyright}>
          © {year}
          {authorName ? ` ${authorName}` : ""}. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}

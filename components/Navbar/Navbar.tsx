import Link from "next/link";
import { getSearchIndex } from "@/lib/blogs";
import { authorName } from "@/site.config";
import { Container } from "@/components/Container";
import { ThemeToggle } from "./ThemeToggle";
import { SearchDialog } from "./SearchDialog";
import { MobileNav } from "./MobileNav";
import styles from "./Navbar.module.css";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
];

export async function Navbar() {
  const index = await getSearchIndex();

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.bar}>
          {authorName ? (
            <Link href="/" className={styles.logo}>
              {authorName}
            </Link>
          ) : (
            <Link href="/" className={styles.logo} aria-label="Home" />
          )}

          <nav className={styles.center} aria-label="Primary">
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

          <div className={styles.right}>
            <ThemeToggle />
            <SearchDialog index={index} />
            <MobileNav />
          </div>
        </div>
      </Container>
    </header>
  );
}

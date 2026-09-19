import Link from "next/link";
import { Section } from "@/components/Section";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <Section narrow>
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className="text-h1">Page not found</h1>
        <p className="text-muted">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
        <Link href="/" className="button buttonPrimary">
          Back home
        </Link>
      </div>
    </Section>
  );
}

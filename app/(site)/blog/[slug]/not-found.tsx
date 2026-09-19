import Link from "next/link";
import { Section } from "@/components/Section";
import styles from "./not-found.module.css";

export default function PostNotFound() {
  return (
    <Section narrow>
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className="text-h1">Post not found</h1>
        <p className="text-muted">
          The post you&rsquo;re looking for doesn&rsquo;t exist or may have been moved.
        </p>
        <Link href="/blog" className="button buttonPrimary">
          Back to all posts
        </Link>
      </div>
    </Section>
  );
}

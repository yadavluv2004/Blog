import Image from "next/image";
import Link from "next/link";
import { site, authorName } from "@/site.config";
import { Section } from "@/components/Section";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <Section className={styles.section}>
      <div className={styles.grid}>
        <div className={styles.copy}>
          {site.author.role && <p className={styles.eyebrow}>{site.author.role}</p>}
          <h1 className={`text-display ${styles.heading}`}>
            {authorName || "Hi, I write here."}
          </h1>
          {site.author.bio && <p className={`text-lead ${styles.bio}`}>{site.author.bio}</p>}
          <div className={styles.actions}>
            <Link href="/blog" className="button buttonPrimary">
              Explore Blog
            </Link>
          </div>
        </div>

        <div className={styles.imageWrap}>
          {site.author.avatar ? (
            <Image
              src={site.author.avatar}
              alt={authorName || "Author portrait"}
              width={320}
              height={320}
              priority
              className={styles.image}
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true" />
          )}
        </div>
      </div>
    </Section>
  );
}

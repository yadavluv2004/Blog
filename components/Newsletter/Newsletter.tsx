import { site } from "@/site.config";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";
import styles from "./Newsletter.module.css";

/**
 * Minimal newsletter capture UI. Renders a genuinely disabled form with an
 * honest note until `site.newsletter.enabled` is true and a provider is
 * wired in app/api/subscribe/route.ts — it never pretends a submission
 * succeeded.
 */
export function Newsletter() {
  const { enabled, description } = site.newsletter;

  return (
    <Section border>
      <div className={styles.wrap}>
        <div className={styles.copy}>
          <h2 className="text-h2">Newsletter</h2>
          <p className={`text-muted ${styles.description}`}>
            {description || "Occasional notes on what I'm writing and building. No spam."}
          </p>
        </div>

        <form className={styles.form} aria-describedby="newsletter-note">
          <input
            type="email"
            name="email"
            placeholder="you@example.com"
            aria-label="Email address"
            disabled={!enabled}
            className={styles.input}
          />
          <button
            type="submit"
            disabled={!enabled}
            className={cn("button", enabled ? "buttonPrimary" : "buttonDisabled")}
          >
            Subscribe
          </button>
        </form>
        <p id="newsletter-note" className={styles.note}>
          {enabled
            ? "You'll get an email to confirm your subscription."
            : "Signups aren't connected yet — check back soon."}
        </p>
      </div>
    </Section>
  );
}

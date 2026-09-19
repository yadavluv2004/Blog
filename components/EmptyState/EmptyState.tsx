import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * The single "nothing here yet" pattern used everywhere the site has no
 * real content to show (no posts, no projects, no search results). Never
 * invents fake content — this is what an empty section looks like instead.
 */
export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.empty} role="status">
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}

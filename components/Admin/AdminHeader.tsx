import Link from "next/link";
import { authorName } from "@/site.config";
import { logoutAction } from "@/app/admin/(protected)/actions";
import styles from "./admin.module.css";

export function AdminHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <span className={styles.brand}>
          {authorName || "Admin"} <span className={styles.brandTag}>/ admin</span>
        </span>
        <nav className={styles.nav}>
          <Link href="/admin" className="text-small">
            Posts
          </Link>
          <Link href="/admin/new" className="button buttonSecondary">
            New post
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-small text-muted">
              Log out
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}

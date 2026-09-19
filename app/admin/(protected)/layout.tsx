import type { Metadata } from "next";
import { AdminHeader } from "@/components/Admin/AdminHeader";
import styles from "@/components/Admin/admin.module.css";

export const metadata: Metadata = { robots: { index: false, follow: false } };

/**
 * Chrome for every authenticated /admin page (middleware.ts already
 * guarantees a valid session by the time this renders). Deliberately
 * separate from app/(site)/layout.tsx — no public Navbar/Footer here.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <AdminHeader />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

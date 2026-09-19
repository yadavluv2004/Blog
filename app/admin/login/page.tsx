import type { Metadata } from "next";
import { LoginForm } from "@/components/Admin/LoginForm";
import { loginAction } from "./actions";
import styles from "@/components/Admin/admin.module.css";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <div className={styles.loginWrap}>
      <div className={styles.loginCard}>
        <h1 className={`text-h2 ${styles.loginTitle}`}>Admin</h1>
        <p className={`text-muted text-small ${styles.loginHint}`}>Sign in to manage posts.</p>
        <LoginForm action={loginAction} next={next && next.startsWith("/admin") ? next : "/admin"} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { listAllPostsAdmin, AdminPostsUnavailableError } from "@/lib/admin-posts";
import { PostsTable } from "@/components/Admin/PostsTable";
import styles from "@/components/Admin/admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  try {
    const posts = await listAllPostsAdmin();
    return (
      <>
        <div className={styles.pageHeading}>
          <h1 className="text-h1">Posts</h1>
          <Link href="/admin/new" className="button buttonPrimary">
            New post
          </Link>
        </div>
        <PostsTable posts={posts} />
      </>
    );
  } catch (error) {
    if (error instanceof AdminPostsUnavailableError) {
      return (
        <div>
          <h1 className={`text-h1 ${styles.sectionTitle}`}>Posts</h1>
          <p className="text-muted">{error.message}</p>
        </div>
      );
    }
    throw error;
  }
}

import Link from "next/link";
import type { AdminPostSummary } from "@/lib/admin-posts";
import { formatDateShort } from "@/lib/utils";
import { DeletePostButton } from "./DeletePostButton";
import styles from "./PostsTable.module.css";

interface PostsTableProps {
  posts: AdminPostSummary[];
}

export function PostsTable({ posts }: PostsTableProps) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No posts yet.</p>
        <Link href="/admin/new" className="button buttonPrimary">
          Write your first post
        </Link>
      </div>
    );
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Date</th>
          <th>Category</th>
          <th>Views</th>
          <th>Status</th>
          <th aria-label="Actions" />
        </tr>
      </thead>
      <tbody>
        {posts.map((post) => (
          <tr key={post.id}>
            <td>
              <Link href={`/admin/${post.id}/edit`} className={styles.titleLink}>
                {post.title}
              </Link>
            </td>
            <td className="text-muted text-small">{formatDateShort(post.date)}</td>
            <td className="text-muted text-small">{post.category || "—"}</td>
            <td className="text-muted text-small">{post.views.toLocaleString()}</td>
            <td>
              <div className={styles.badges}>
                {post.draft && <span className={styles.badgeDraft}>Draft</span>}
                {post.featured && <span className={styles.badgeFeatured}>Featured</span>}
                {!post.draft && !post.featured && <span className="text-muted text-small">Published</span>}
              </div>
            </td>
            <td>
              <div className={styles.actions}>
                <Link href={`/admin/${post.id}/edit`} className="text-small">
                  Edit
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

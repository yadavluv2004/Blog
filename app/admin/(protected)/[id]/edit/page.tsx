import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostByIdAdmin, AdminPostsUnavailableError } from "@/lib/admin-posts";
import { PostForm } from "@/components/Admin/PostForm";
import styles from "@/components/Admin/admin.module.css";
import { updatePostAction } from "./actions";

export const metadata: Metadata = { title: "Edit post", robots: { index: false, follow: false } };

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  let post;
  try {
    post = await getPostByIdAdmin(id);
  } catch (error) {
    if (error instanceof AdminPostsUnavailableError) {
      return (
        <div>
          <h1 className={`text-h1 ${styles.sectionTitle}`}>Edit post</h1>
          <p className="text-muted">{error.message}</p>
        </div>
      );
    }
    throw error;
  }

  if (!post) notFound();

  const boundAction = updatePostAction.bind(null, id);

  return (
    <>
      <h1 className={`text-h1 ${styles.sectionTitle}`}>Edit post</h1>
      <PostForm
        action={boundAction}
        submitLabel="Save changes"
        initialValues={{
          title: post.title,
          slug: post.slug,
          description: post.description ?? "",
          date: post.date.slice(0, 10),
          category: post.category ?? "",
          tags: (post.tags ?? []).join(", "),
          coverImage: post.coverImage ?? "",
          readingTime: post.readingTime ?? "",
          featured: Boolean(post.featured),
          draft: Boolean(post.draft),
          content: post.content ?? "",
        }}
      />
    </>
  );
}

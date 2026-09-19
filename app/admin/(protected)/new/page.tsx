import type { Metadata } from "next";
import { PostForm } from "@/components/Admin/PostForm";
import styles from "@/components/Admin/admin.module.css";
import { createPostAction } from "./actions";

export const metadata: Metadata = { title: "New post", robots: { index: false, follow: false } };

const emptyValues = {
  title: "",
  slug: "",
  description: "",
  date: "",
  category: "",
  tags: "",
  coverImage: "",
  readingTime: "",
  featured: false,
  draft: false,
  content: "",
};

export default function NewPostPage() {
  return (
    <>
      <h1 className={`text-h1 ${styles.sectionTitle}`}>New post</h1>
      <PostForm action={createPostAction} initialValues={emptyValues} submitLabel="Publish" />
    </>
  );
}

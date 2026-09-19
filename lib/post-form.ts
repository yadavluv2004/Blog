import type { PostInput } from "@/lib/types";

/** Shared between the create and update server actions and the client PostForm. */
export interface PostFormState {
  error?: string;
}

/** Parses the admin post form's FormData into a PostInput, and validates the required fields. */
export function parsePostFormData(formData: FormData): PostInput | { error: string } {
  const title = String(formData.get("title") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const content = String(formData.get("content") ?? "");

  if (!title) return { error: "Title is required." };
  if (!date || Number.isNaN(new Date(date).getTime())) return { error: "A valid date is required." };
  if (!content.trim()) return { error: "Content is required." };

  const tagsRaw = String(formData.get("tags") ?? "");

  const input: PostInput = {
    title,
    slug: String(formData.get("slug") ?? "").trim() || undefined,
    description: String(formData.get("description") ?? "").trim(),
    date: new Date(date).toISOString(),
    category: String(formData.get("category") ?? "").trim(),
    tags: tagsRaw
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    coverImage: String(formData.get("coverImage") ?? "").trim(),
    readingTime: String(formData.get("readingTime") ?? "").trim() || undefined,
    featured: formData.get("featured") === "on",
    draft: formData.get("draft") === "on",
    content,
  };

  return input;
}

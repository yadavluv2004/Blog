"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updatePost, AdminPostsUnavailableError } from "@/lib/admin-posts";
import { requireAdminSession, UnauthorizedError } from "@/lib/admin-session";
import { parsePostFormData, type PostFormState } from "@/lib/post-form";

export async function updatePostAction(
  id: string,
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  try {
    await requireAdminSession();
  } catch (error) {
    if (error instanceof UnauthorizedError) return { error: "Your session expired — sign in again." };
    throw error;
  }

  const parsed = parsePostFormData(formData);
  if ("error" in parsed) return parsed;

  let result;
  try {
    result = await updatePost(id, parsed);
  } catch (error) {
    if (error instanceof AdminPostsUnavailableError) return { error: error.message };
    console.error(error);
    return { error: "Something went wrong saving the post." };
  }

  if (!result) return { error: "This post no longer exists." };

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${result.slug}`);
  redirect("/admin");
}

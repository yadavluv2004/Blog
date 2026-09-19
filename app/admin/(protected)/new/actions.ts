"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createPost, AdminPostsUnavailableError } from "@/lib/admin-posts";
import { requireAdminSession, UnauthorizedError } from "@/lib/admin-session";
import { parsePostFormData, type PostFormState } from "@/lib/post-form";

export async function createPostAction(
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

  try {
    await createPost(parsed);
  } catch (error) {
    if (error instanceof AdminPostsUnavailableError) return { error: error.message };
    console.error(error);
    return { error: "Something went wrong creating the post." };
  }

  revalidatePath("/");
  revalidatePath("/blog");
  redirect("/admin");
}

"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth";
import { isAdminSession } from "@/lib/admin-session";
import { deletePost } from "@/lib/admin-posts";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}

export async function deletePostAction(id: string) {
  // Called directly from a client button (not a <form action>), so a
  // thrown error would surface as an unhandled rejection in the browser
  // rather than a redirect — send the user back to sign in instead.
  if (!(await isAdminSession())) redirect("/admin/login");

  await deletePost(id);
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/blog");
}

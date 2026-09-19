"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyPassword } from "@/lib/auth";

export interface LoginState {
  error?: string;
}

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  const nextPath = String(formData.get("next") ?? "/admin");

  if (!process.env.ADMIN_PASSWORD) {
    return { error: "Admin login isn't configured yet — set ADMIN_PASSWORD in .env.local." };
  }

  const ok = await verifyPassword(password);
  if (!ok) return { error: "Incorrect password." };

  const token = await createSessionToken();
  if (!token) {
    return { error: "Admin login isn't configured yet — set ADMIN_SESSION_SECRET in .env.local." };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(nextPath.startsWith("/admin") ? nextPath : "/admin");
}

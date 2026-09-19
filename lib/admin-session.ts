import "server-only";

import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Verifies the admin session from within a Server Action or Server
 * Component (Node runtime — this reads next/headers' cookies(), which
 * middleware.ts's Edge bundle can't use, hence the separate file).
 *
 * middleware.ts already gates every /admin/* page, but a Server Action is
 * independently POST-able once its id is known to the client, bypassing
 * page-level middleware entirely. Every mutating admin action must call
 * this itself rather than trusting that it was only ever reached through
 * a gated page.
 */
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Not signed in.");
    this.name = "UnauthorizedError";
  }
}

/** Throws if there's no valid admin session. Call at the top of every mutating admin action. */
export async function requireAdminSession(): Promise<void> {
  if (!(await isAdminSession())) throw new UnauthorizedError();
}

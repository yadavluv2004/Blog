import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

/**
 * Gates every /admin route behind the signed session cookie set by
 * app/admin/login. /admin/login itself is always reachable (that's where
 * the cookie gets set); everything else redirects there when the cookie is
 * missing, expired, or tampered with.
 *
 * Named proxy.ts, not middleware.ts — Next.js renamed the convention in
 * 16.x (middleware.ts still works but is deprecated).
 */
export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const valid = await verifySessionToken(token);

  if (!valid) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

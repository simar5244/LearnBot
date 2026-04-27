import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/dashboard", "/onboarding", "/learn", "/profile", "/progress", "/chat", "/my-tutor-lab"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needsAuth = protectedPaths.some((p) => pathname.startsWith(p));
  if (needsAuth === false) return NextResponse.next();

  const sessionId = req.cookies.get("session_id")?.value || "";
  if (sessionId.length === 0) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/onboarding", "/learn", "/profile", "/progress", "/chat", "/my-tutor-lab"],
};

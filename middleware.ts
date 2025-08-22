import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = [/^\/dashboard/, /^\/entries\//];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  const isProtected = PROTECTED.some((re) => re.test(pathname));
  const hasSupabaseSession =
    req.cookies.has("sb-access-token") || req.cookies.has("sb-refresh-token") ||
    req.cookies.has("sb:token") || req.cookies.has("sb-") || false;

  if (isProtected && !hasSupabaseSession) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/entries/:path*"],
};

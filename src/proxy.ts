import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/test", "/results", "/reports", "/settings", "/admin", "/psychologist"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED.some((path) => pathname.startsWith(path));
  if (!isProtected) return NextResponse.next();

  // Check cookie-based token (for server-side guard)
  const token = req.cookies.get("nafsiiq_token")?.value;

  // If no cookie token, redirect to login
  // (client-side layouts also guard using localStorage token via AuthContext)
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/test/:path*",
    "/results/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/psychologist/:path*",
  ],
};

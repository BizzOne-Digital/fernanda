import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((request) => {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdminArea = pathname.startsWith("/admin");

  if (isAdminArea && !isLogin && !request.auth) {
    const loginUrl = new URL("/admin/login", request.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();

  if (isAdminArea) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
});

export const config = {
  matcher: ["/admin/:path*"],
};

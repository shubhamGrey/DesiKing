import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get("auth");

  // Allow access to login page and public assets
  if (pathname.startsWith("/login") || pathname.startsWith("/_next")) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to /login
  // if (!isLoggedIn) {
  //   const loginUrl = new URL('/login', request.url);
  //   return NextResponse.redirect(loginUrl);
  // }

  return NextResponse.next();
}

// Define which paths this middleware applies to
export const config = {
  matcher: [
    "/",
    "/about",
    "/products/:path*",
    "/contact",
    // add more protected routes here
  ],
};

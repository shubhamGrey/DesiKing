import { NextResponse } from "next/server";

// Helper function to decode JWT token (basic decoding without verification)
function decodeJWT(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("access_token");
  const isLoggedIn = !!accessToken?.value;

  console.log(
    `Middleware: Checking route ${pathname}, isLoggedIn: ${isLoggedIn}`
  );

  // Public routes that don't require authentication
  const publicRoutes = [
    "/login",
    "/",
    "/about",
    "/contact",
    "/products",
    "/product", // Dynamic route prefix
    "/payment-result",
    "/privacy-policy",
    "/terms-and-conditions",
    "/terms-of-services",
    "/refund-policy",
    "/shipping-policy",
    "/user-session-test", // Test page for user session
  ];

  // Protected routes that require authentication
  const protectedRoutes = [
    "/cart",
    "/profile", // Referenced in header, needs to be protected when implemented
    "/orders", // Referenced in payment-result, needs to be protected when implemented
  ];

  // Admin-only routes (for managing content)
  const adminRoutes = ["/add-category", "/add-product"];

  // Allow access to public assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes("favicon") ||
    pathname.includes(".") // Static files
  ) {
    return NextResponse.next();
  }

  // Helper function to check if path matches routes
  const isRouteMatch = (routes, path) => {
    return routes.some((route) => {
      if (route === "/") {
        return path === "/";
      }
      return path === route || path.startsWith(route + "/");
    });
  };

  const isPublicRoute = isRouteMatch(publicRoutes, pathname);
  const isProtectedRoute = isRouteMatch(protectedRoutes, pathname);
  const isAdminRoute = isRouteMatch(adminRoutes, pathname);

  // If it's a public route and not protected, allow access
  if (isPublicRoute && !isProtectedRoute && !isAdminRoute) {
    return NextResponse.next();
  }

  // Check authentication for protected or admin routes
  if (isProtectedRoute || isAdminRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Additional check for admin routes
    if (isAdminRoute) {
      return checkAdminAccess(request, accessToken);
    }
  }

  return NextResponse.next();
}

// Separate function to handle admin access checks
function checkAdminAccess(request, accessToken) {
  // First try to get role from cookies
  let userRole = request.cookies.get("user_role")?.value;

  // If no role in cookies, try to decode from JWT token
  if (!userRole && accessToken?.value) {
    const decodedToken = decodeJWT(accessToken.value);
    if (decodedToken) {
      // Extract role from token (adjust based on your JWT structure)
      userRole =
        decodedToken.role ||
        decodedToken.userRole ||
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
    }
  }

  console.log(`Admin route check: userRole = ${userRole}`);

  if (userRole !== "Admin") {
    // Redirect non-admin users to unauthorized page or home
    console.log(`Access denied to admin route for role: ${userRole}`);
    const unauthorizedUrl = new URL("/", request.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

// Define which paths this middleware applies to
export const config = {
  matcher: [
    // Public routes
    "/",
    "/about",
    "/contact",
    "/login",
    "/products/:path*",
    "/product/:path*", // Dynamic product pages
    "/payment-result",
    "/privacy-policy",
    "/terms-and-conditions",
    "/terms-of-services",
    "/refund-policy",
    "/shipping-policy",
    "/user-session-test",

    // Protected routes
    "/cart",
    "/profile/:path*",
    "/orders/:path*",

    // Admin routes
    "/add-category/:path*",
    "/add-product/:path*",

    // Catch-all for any other routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

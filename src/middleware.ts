import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const userId = request.cookies.get("mock_user_id")?.value;

  // Public routes that don't require auth
  if (
    pathname === "/login" ||
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // No user — redirect to login
  if (!userId) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Role-based route protection
  const isAdminUser = userId.startsWith("admin-");
  const isClientUser = userId.startsWith("client-");

  if (pathname.startsWith("/admin") && !isAdminUser) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  if (pathname.startsWith("/portal") && !isClientUser && !isAdminUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = process.env.AUTH_SECRET;

if (!secret) {
  throw new Error("AUTH_SECRET is not defined");
}

const secretKey = new TextEncoder().encode(secret);

const COOKIE_NAME = "write-space-session";

const protectedRoutes = [
  "/dashboard",
  "/write",
  "/editprofile",
];

async function isAuthenticated(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token, secretKey);
    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authenticated = await isAuthenticated(request);

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  const isAuthRoute =
    pathname === "/login" || pathname === "/signup";

  if (isProtectedRoute && !authenticated) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(
      new URL("/", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/write/:path*",
    "/editprofile",
    "/login",
    "/signup",
  ],
};

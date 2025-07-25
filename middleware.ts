import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get("token")?.value;
  if (!token) return false;

  try {
    await jwtVerify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const isAuth = await isAuthenticated(request);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isProtectedPage = pathname.startsWith("/dashboard") || pathname.startsWith("/settings");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/dashboard/home", request.url));
  }

  if (isProtectedPage && !isAuth) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/settings"],
};

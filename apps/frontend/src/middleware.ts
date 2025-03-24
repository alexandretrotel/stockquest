import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth-server";
import { DEFAULT_AUTH_REDIRECT_PAGE } from "./data/settings";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // public paths
  const publicPaths = ["/auth", "/api/auth"];

  // if the path is public, return next
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // if the path is not public, check if the user is authenticated
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  // if the user is not authenticated, redirect to the signin page or return an unauthorized error for API routes
  if (!session) {
    if (pathname.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return NextResponse.redirect(new URL(DEFAULT_AUTH_REDIRECT_PAGE, req.url));
  }

  // if the user is authenticated but the email is not verified, redirect to the verify email page
  if (session && !session.user.emailVerified && !session.user.isAnonymous) {
    return NextResponse.redirect(new URL("/auth/verify-email", req.url));
  }

  // if the user is authenticated and mail verified, add the session to the request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-session", JSON.stringify(session));

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|manifest.json|robots.txt|sw.js).*)",
    "/api/:path*",
  ],
};

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/profile", "/post/create", "/post/edit"];

export async function proxy(request: NextRequest) {
  const pathName = request.nextUrl.pathname;
  const session = getSessionCookie(request);
  // const session = await auth.api.getSession({
  //     headers: await headers(),
  //   });
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathName.startsWith(route),
  );
  if (isProtectedRoute && !session) {
    // redirect user to authpage
    return NextResponse.redirect(new URL("/auth", request.url));
  }
  if (pathName === "/auth" && session) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/post/create", "/post/edit/:path*", "/auth"],
};

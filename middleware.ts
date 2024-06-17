import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/libs/mongodb";
import { getJwtSecretKey, verifyJwtToken } from "@/libs/auth";

export async function middleware(request: NextRequest, response: NextResponse) {
  // Check if token exists in cookies
  const { url, nextUrl, cookies } = request;
  const { value: token } = cookies.get("token") ?? { value: null };
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
    return NextResponse.redirect(new URL("/home", url));
  }

  if (
    !hasVerifiedToken &&
    (nextUrl.pathname === "/home" ||
      nextUrl.pathname === "/setting" ||
      nextUrl.pathname === "/help")
  ) {
    const response = NextResponse.redirect(new URL("/login", url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

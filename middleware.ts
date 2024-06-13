import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { connect } from "@/libs/mongodb";
import { getJwtSecretKey, verifyJwtToken } from "@/libs/auth";

export async function middleware(request: NextRequest, response: NextResponse) {
  // Check if token exists in cookies
  const { url, nextUrl, cookies } = request;

  // // Reset the password
  // if (nextUrl.pathname === "/reset") {
  //   // get token
  //   const { searchParams } = new URL(request.url);
  //   const resetToken = searchParams.get("token");
  //   const data: any = verifyJwtToken(resetToken);

  //   // find user
  //   if (!data) {
  //     await connect();
  //     const user = Users.findOne({ email: data?.email });

  //     if (user != null) {
  //       return NextResponse.next();
  //     }
  //   }

  //   return NextResponse.redirect(new URL("/login", url));
  // }

  const session = await getToken({
    req: request,
    secret: process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    raw: true,
  });

  const { value: token } = cookies.get("token") ?? { value: null };
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
    if (!session && !hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
    return NextResponse.redirect(new URL("/home", url));
  }

  if (
    !hasVerifiedToken &&
    !session &&
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

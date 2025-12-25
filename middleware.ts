// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (!token) return false;

        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/admin-dashboard")
        ) {
          return token.role === "admin";
        }

        if (pathname.startsWith("/user-dashboard")) {
          return token.role === "user";
        }

        return true;
      },
    },
  }
);

// কোন কোন পাথে এই রুলস অ্যাপ্লাই হবে
export const config = {
  matcher: [
    "/admin/:path*",
    "/user-dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
};

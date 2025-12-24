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

        // ১. লগইন না থাকলে কাউকে ঢুকতে দেবে না
        if (!token) return false;

        // ২. অ্যাডমিন রাউট প্রোটেকশন
        // শুধুমাত্র 'admin' রোল থাকলেই ঢুকতে পারবে (User ঢুকতে পারবে না)
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/admin-dashboard")
        ) {
          return token.role === "admin";
        }

        // ৩. ইউজার ড্যাশবোর্ড প্রোটেকশন
        // শুধুমাত্র 'user' রোল থাকলেই ঢুকতে পারবে (Admin ঢুকতে পারবে না)
        if (pathname.startsWith("/user-dashboard")) {
          return token.role === "user";
        }

        // অন্য সব রাউটে লগইন থাকলেই হবে
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

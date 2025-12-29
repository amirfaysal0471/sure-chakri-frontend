import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { API_ACCESS_RULES, UI_ACCESS_RULES } from "@/lib/access-control";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const method = req.method;

        if (pathname.startsWith("/api")) {
          const matchedRule = API_ACCESS_RULES.find((rule) => {
            const isPathMatch = pathname.startsWith(rule.path);
            const isMethodMatch =
              rule.methods.includes("ALL") || rule.methods.includes(method);
            return isPathMatch && isMethodMatch;
          });

          if (!matchedRule) return !!token;
          if (matchedRule.roles.includes("public")) return true;
          if (!token) return false;

          return matchedRule.roles.includes(token.role as string);
        }

        if (!token) return false;

        const matchedUIRule = UI_ACCESS_RULES.find((rule) =>
          pathname.startsWith(rule.path)
        );

        if (matchedUIRule) {
          return matchedUIRule.roles.includes(token.role as string);
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/user-dashboard/:path*",
    "/admin-dashboard/:path*",
    "/api/:path*",
  ],
};

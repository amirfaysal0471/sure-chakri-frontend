// lib/access-control.ts

export type UserRole = "admin" | "user" | "public";

interface RouteRule {
  path: string;
  methods: string[];
  roles: UserRole[];
}

// 🔥 এখানেই আপনি সব রুলস সেট করবেন (Just Edit This List)
export const API_ACCESS_RULES: RouteRule[] = [
  // 1. Pricing API (GET Public, Rest Admin)
  {
    path: "/api/pricing",
    methods: ["GET"],
    roles: ["public"],
  },
  {
    path: "/api/pricing",
    methods: ["POST", "PUT", "DELETE"],
    roles: ["admin"],
  },

  // 2. Posts API (User & Admin can write)
  {
    path: "/api/posts",
    methods: ["ALL"],
    roles: ["user", "admin"],
  },

  // 3. User & Auth (Public)
  {
    path: "/api/auth",
    methods: ["ALL"],
    roles: ["public"],
  },

  // 4. Admin API (Strictly Admin)
  {
    path: "/api/admin",
    methods: ["ALL"],
    roles: ["admin"],
  },
];

// 🔥 UI পেজের এক্সেস রুলস
export const UI_ACCESS_RULES = [
  { path: "/admin", roles: ["admin"] },
  { path: "/admin-dashboard", roles: ["admin"] },
  { path: "/user-dashboard", roles: ["user"] },
];

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      plan: string; // 🔥 এখানে যুক্ত করুন
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    plan: string; // 🔥 এখানে যুক্ত করুন
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    id: string;
    plan: string; // 🔥 এখানে যুক্ত করুন
  }
}

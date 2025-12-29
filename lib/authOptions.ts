import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/app/models/User";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("ইমেইল এবং পাসওয়ার্ড প্রয়োজন");
        }
        await connectDB();

        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("ভুল ইমেইল বা পাসওয়ার্ড");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("ভুল পাসওয়ার্ড");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // 🔥 Google দিয়ে সাইন ইন হ্যান্ডলিং (FIXED)
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            // নতুন ইউজার তৈরি হচ্ছে
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              // 🔥 FIX: গুগল আইডি সেভ করা হচ্ছে (duplicate error এড়ানোর জন্য)
              googleId: account.providerAccountId,
              role: "user",
              plan: "free",
            });
          } else {
            // যদি ইউজার আগে থেকেই থাকে কিন্তু googleId সেট করা না থাকে
            // তাহলে আমরা একাউন্ট লিংক করে দেব
            if (!existingUser.googleId) {
              existingUser.googleId = account.providerAccountId;
              // যদি আগে provider credentials থাকে, এখন google ও যুক্ত হবে (optional logic)
              if (existingUser.provider === "credentials") {
                existingUser.provider = "google"; // বা হাইব্রিড হিসেবে রাখতে পারেন
              }
              await existingUser.save();
            }
          }
          return true;
        } catch (error) {
          console.log("Error saving user", error);
          return false;
        }
      }
      return true;
    },

    // 🔥 JWT কলব্যাক
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      if (token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.plan = dbUser.plan;
        }
      }
      return token;
    },

    // 🔥 সেশন কলব্যাক
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

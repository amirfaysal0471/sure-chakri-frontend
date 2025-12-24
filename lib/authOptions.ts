// lib/authOptions.ts
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email });

          if (!existingUser) {
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: "google",
              role: "user", // নতুন ইউজার গুগল দিয়ে ঢুকলে 'user' রোল পাবে
            });
          }
          return true;
        } catch (error) {
          console.log("Error saving user", error);
          return false;
        }
      }
      return true;
    },
    // JWT কলব্যাক: এখানে আমরা রোল এবং আইডি টোকেনে সেট করি
    async jwt({ token, user, trigger, session }) {
      // ১. যদি ইউজার প্রোফাইল আপডেট করে, তবে টোকেন আপডেট হবে
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }

      // ২. প্রথমবার লগইন করার সময় (user অবজেক্ট থাকে)
      if (user) {
        await connectDB();
        // ডাটাবেস থেকে লেটেস্ট রোল এবং আইডি নিয়ে আসা
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role; // রোল সেট করা হচ্ছে
        }
      }
      return token;
    },
    // সেশন কলব্যাক: টোকেন থেকে ডাটা সেশনে পাঠানো হয় (Client Side এ পাওয়ার জন্য)
    async session({ session, token }) {
      if (session?.user) {
        // Typescript এর জন্য 'as any' ব্যবহার করা হয়েছে,
        // আপনি চাইলে next-auth.d.ts ফাইল দিয়ে টাইপ ঠিক করতে পারেন।
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/", // লগইন পেজ হিসেবে হোমপেজ বা আপনার মডাল রাখা ভালো
  },
  secret: process.env.NEXTAUTH_SECRET,
};

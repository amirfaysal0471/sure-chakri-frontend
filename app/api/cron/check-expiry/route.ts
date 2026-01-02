import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/app/models/User";

// Vercel বা সার্ভারলেস এনভায়রনমেন্টে এটি ক্যাশ এড়ায়
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // ১. সিকিউরিটি চেক
    const authHeader = req.headers.get("authorization");

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const today = new Date();

    // ২. মেইন লজিক: যাদের মেয়াদ শেষ, তাদের একসাথে আপডেট করা (Bulk Update)
    const result = await User.updateMany(
      {
        plan: { $ne: "free" }, // যারা ফ্রি ইউজার নয়
        planExpiresAt: { $lt: today }, // এবং যাদের মেয়াদের তারিখ আজকের আগে
      },
      {
        $set: {
          plan: "free",
          planExpiresAt: null, // মেয়াদ শেষ তাই নাল করে দেওয়া
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Process completed. ${result.modifiedCount} users updated.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

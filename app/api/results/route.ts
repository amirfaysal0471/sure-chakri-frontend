import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/app/models/result.model";
import Exam from "@/app/models/exam.model"; // Populate করার জন্য দরকার
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    await connectDB();

    // সেশন থেকে ইউজার আইডি নেওয়া (Security)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // ইউজারের সব রেজাল্ট আনা (Exam Title সহ)
    const results = await Result.find({ user: userId })
      .populate({
        path: "exam",
        select: "title examDate settings", // শুধুমাত্র টাইটেল এবং ডেট দরকার
      })
      .sort({ createdAt: -1 }) // একদম লেটেস্ট রেজাল্ট আগে
      .lean();

    return NextResponse.json({ success: true, data: results });
  } catch (error: any) {
    console.error("Results Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

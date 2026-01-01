import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/app/models/result.model";

export async function GET() {
  try {
    await connectDB();

    // সব রেজাল্ট এগ্রিগেট করে টপ ১ জন প্লেয়ার বের করা
    const topPlayer = await Result.aggregate([
      // ১. ইউজার অনুযায়ী গ্রুপ করা এবং মোট মার্কস যোগ করা
      {
        $group: {
          _id: "$user",
          totalPoints: { $sum: "$obtainedMarks" },
        },
      },
      // ২. পয়েন্ট অনুযায়ী সাজানো (বড় থেকে ছোট)
      { $sort: { totalPoints: -1 } },
      // ৩. শুধুমাত্র ১ জনকে নেওয়া
      { $limit: 1 },
      // ৪. ইউজার কালেকশন থেকে নাম এবং ছবি আনা
      {
        $lookup: {
          from: "users", // আপনার ডাটাবেসে ইউজার কালেকশনের নাম (সাধারণত 'users')
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      // ৫. অ্যারে থেকে অবজেক্টে রূপান্তর
      { $unwind: "$userInfo" },
      // ৬. প্রয়োজনীয় ডাটা প্রজেক্ট করা
      {
        $project: {
          name: "$userInfo.name",
          image: "$userInfo.image",
          totalPoints: 1,
        },
      },
    ]);

    if (topPlayer.length === 0) {
      return NextResponse.json({ success: false, message: "No data found" });
    }

    return NextResponse.json({ success: true, data: topPlayer[0] });
  } catch (error: any) {
    console.error("Top Player Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

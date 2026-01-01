import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/db";
import Result from "@/app/models/result.model";
import mongoose from "mongoose";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ rank: "--" });
    }

    // ১. বর্তমান ইউজারের মোট পয়েন্ট বের করা
    const userStats = await Result.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: { _id: "$user", totalPoints: { $sum: "$obtainedMarks" } } },
    ]);

    const myPoints = userStats.length > 0 ? userStats[0].totalPoints : 0;

    // ২. চেক করা কতজনের পয়েন্ট আমার চেয়ে বেশি (যাদের বেশি তারা আমার উপরে)
    const betterPlayers = await Result.aggregate([
      { $group: { _id: "$user", totalPoints: { $sum: "$obtainedMarks" } } },
      { $match: { totalPoints: { $gt: myPoints } } }, // যাদের পয়েন্ট আমার চেয়ে বেশি
      { $count: "count" },
    ]);

    // ৩. র‍্যাংক নির্ধারণ (আমার উপরে যতজন আছে + ১)
    const rank = (betterPlayers.length > 0 ? betterPlayers[0].count : 0) + 1;

    return NextResponse.json({ success: true, rank, myPoints });
  } catch (error: any) {
    console.error("Rank Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

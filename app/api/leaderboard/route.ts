import { NextResponse } from "next/server";
import {
  getLeaderboardData,
  TimeFilter,
} from "@/app/services/leaderboard.service";

export async function GET(req: Request) {
  try {
    // URL থেকে ফিল্টার প্যারামিটার নেওয়া (যেমন: ?filter=weekly)
    const { searchParams } = new URL(req.url);
    const filter = (searchParams.get("filter") as TimeFilter) || "all";

    // সার্ভিস কল করা
    const data = await getLeaderboardData(filter);

    return NextResponse.json({
      success: true,
      filter,
      data,
    });
  } catch (error: any) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}

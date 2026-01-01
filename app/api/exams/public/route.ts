import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exam from "@/app/models/exam.model";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "upcoming";

    // MongoDB Aggregation Pipeline
    const exams = await Exam.aggregate([
      { $match: {} }, // প্রয়োজনে এখানে ফিল্টার যুক্ত করতে পারেন

      // ১. রেজাল্ট এবং ইউজার ইনফো একসাথে আনা (শুধুমাত্র লেটেস্ট ৩টি)
      {
        $lookup: {
          from: "results",
          let: { examId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$exam", "$$examId"] } } }, // এই এক্সামের রেজাল্ট
            { $sort: { createdAt: -1 } }, // সবার শেষে যারা দিয়েছে
            { $limit: 3 }, // মাত্র ৩ জন
            {
              $lookup: {
                // ইউজার ডিটেইলস আনা
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "userInfo",
              },
            },
            { $unwind: "$userInfo" }, // অ্যারে থেকে অবজেক্ট করা
            { $project: { "userInfo.image": 1, "userInfo.name": 1 } }, // শুধু ছবি আর নাম নেওয়া
          ],
          as: "recentParticipants",
        },
      },

      // ২. মোট কতজন দিয়েছে সেটা আলাদাভাবে গোনা
      {
        $lookup: {
          from: "results",
          localField: "_id",
          foreignField: "exam",
          as: "allResults", // শুধু কাউন্টের জন্য
        },
      },

      {
        $addFields: {
          usersJoined: { $size: "$allResults" }, // মোট সংখ্যা
          recentUsers: "$recentParticipants.userInfo", // ৩ জনের ছবির লিস্ট
        },
      },

      {
        $project: {
          allResults: 0,
          recentParticipants: 0,
          questions: 0,
          answers: 0,
          __v: 0,
        },
      },

      { $sort: { examDate: type === "archive" ? -1 : 1 } },
    ]);

    return NextResponse.json({ success: true, data: exams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

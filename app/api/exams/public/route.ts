import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Exam from "@/app/models/exam.model";

export async function GET(req: Request) {
  try {
    await connectDB();

    // 1. URL থেকে প্যারামিটার নেওয়া
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const type = searchParams.get("type") || "upcoming"; // 'upcoming' or 'archive'

    // 2. Skip ক্যালকুলেশন (Pagination এর জন্য)
    const skip = (page - 1) * limit;
    const now = new Date();

    // 3. কুয়েরি এবং সর্টিং লজিক
    let query: any = {
      // শুধুমাত্র পাবলিক বা অ্যাক্টিভ এক্সাম দেখানোর জন্য ফিল্টার (যদি থাকে)
      // isActive: true,
    };

    // যদি চান ব্যাকএন্ড থেকেই Upcoming/Archive আলাদা করতে, তাহলে নিচের লজিক আনকমেন্ট করতে পারেন।
    // তবে ফ্রন্টএন্ডে যেহেতু আমরা রিয়েল-টাইম চেক করছি, তাই এখানে সব ডেটা পাঠানোই নিরাপদ।
    /*
    if (type === "upcoming") {
      query.examDate = { $gte: now }; // আজকের পরের গুলো
    } else if (type === "archive") {
      query.examDate = { $lt: now };  // আগের গুলো
    }
    */

    // 4. ডেটাবেস থেকে ডেটা আনা
    const exams = await Exam.find(query)
      // প্রশ্ন বা উত্তর সাধারণ ইউজারদের পাঠানো যাবে না, তাই বাদ দেওয়া হলো
      .select("-questions -answers")
      // Archive হলে নতুন গুলো আগে, Upcoming হলে পুরান গুলো আগে (Date Sorting)
      .sort({ examDate: type === "archive" ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // 5. আরও ডেটা আছে কিনা চেক করা (Infinite Scroll এর জন্য জরুরি)
    const totalExams = await Exam.countDocuments(query);
    const hasMore = skip + exams.length < totalExams;

    return NextResponse.json(
      {
        success: true,
        data: exams,
        hasMore, // ফ্রন্টএন্ডকে জানাবে আরও ডেটা লোড করতে হবে কিনা
        page,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: any) {
    console.error("Public Exams Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load exam schedule" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Result from "@/app/models/result.model";
import Exam from "@/app/models/exam.model";
import "@/app/models/question.models"; // Question model register করার জন্য
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, { params }: RouteContext) {
  try {
    await connectDB();
    const { id } = await params;

    // ১. সেশন চেক (Security)
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ২. রেজাল্ট লোড করা (Deep Population সহ)
    const result = await Result.findById(id)
      .populate("exam", "title examDate settings duration") // এক্সাম ইনফো
      .populate({
        path: "details.questionId", // প্রশ্নের বিস্তারিত
        select: "questionText options explanation marks",
      })
      .lean();

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }

    // ৩. সিকিউরিটি চেক: ইউজার কি নিজের রেজাল্ট দেখছে?
    if (result.user.toString() !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Result Detail Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

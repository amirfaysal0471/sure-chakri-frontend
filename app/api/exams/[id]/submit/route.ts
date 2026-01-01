import { NextResponse } from "next/server";
import { submitExamResult } from "@/app/services/result.service";
// import { getServerSession } from "next-auth"; // আপনার অথেনটিকেশন সেটআপ অনুযায়ী

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id: examId } = await params;
    const body = await req.json();
    const { answers, userId } = body;

    // নোট: রিয়েল অ্যাপে 'userId' বডি থেকে না নিয়ে সেশন থেকে নেওয়া উচিত
    // const session = await getServerSession(authOptions);
    // const userId = session?.user?.id;

    if (!userId || !answers) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // সার্ভিস কল করা
    const result = await submitExamResult({
      userId,
      examId,
      answers,
    });

    return NextResponse.json({
      success: true,
      message: "Exam submitted successfully",
      resultId: result._id, // ফ্রন্টএন্ডে এই ID দিয়ে রিডাইরেক্ট হবে
    });
  } catch (error: any) {
    console.error("Submit Error:", error);
    return NextResponse.json(
      { error: error.message || "Submission failed" },
      { status: 500 }
    );
  }
}

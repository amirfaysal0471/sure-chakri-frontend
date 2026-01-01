import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { republishExam } from "@/app/services/exam.service";
import { authOptions } from "@/lib/authOptions";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    // ১. অ্যাডমিন চেক (Security)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ২. বডি থেকে নতুন ডেট নেওয়া
    const body = await req.json();
    const { examDate, startTime, endTime } = body;

    if (!examDate || !startTime || !endTime) {
      return NextResponse.json(
        { error: "New dates are required" },
        { status: 400 }
      );
    }

    // ৩. সার্ভিস কল করা
    const newExam = await republishExam(id, {
      examDate: new Date(examDate),
      startTime,
      endTime,
    });

    return NextResponse.json({
      success: true,
      message: "Exam republished successfully!",
      data: newExam,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

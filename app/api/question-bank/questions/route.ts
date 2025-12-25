import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { createQuestion } from "@/app/services/question.service";
import Question from "@/app/models/question.models";

// POST: Create New Question
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // ভ্যালিডেশন ফিক্স: correctAnswer 0 হতে পারে (Index হিসেবে)
    if (
      !body.categoryId ||
      !body.questionText ||
      body.correctAnswer === undefined ||
      body.correctAnswer === null
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const question = await createQuestion(body);
    return NextResponse.json({ success: true, data: question });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET: Fetch Questions (Create Exam পেজে লোড করার জন্য)
export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "500");

    const questions = await Question.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("categoryId", "name") // ক্যাটাগরি পপুলেট করা হলো
      .lean();

    return NextResponse.json({
      success: true,
      data: { questions },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

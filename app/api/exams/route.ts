import { createExam, getAllExams } from "@/app/services/exam.service";
import { NextResponse } from "next/server";

// POST: Create New Exam
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // বেসিক ভ্যালিডেশন
    if (!body.title || !body.examCategoryId || !body.examDate) {
      return NextResponse.json(
        { error: "Missing required fields (Title, Category, Date)" },
        { status: 400 }
      );
    }

    const newExam = await createExam(body);

    return NextResponse.json(
      { message: "Exam created successfully", data: newExam },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create Exam Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// GET: Fetch All Exams
export async function GET() {
  try {
    const exams = await getAllExams();
    return NextResponse.json({ data: exams }, { status: 200 });
  } catch (error: any) {
    console.error("Get Exams Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exams" },
      { status: 500 }
    );
  }
}

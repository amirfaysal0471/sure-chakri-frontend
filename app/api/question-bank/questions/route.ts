import { NextResponse } from "next/server";
import { createQuestion, getQuestions } from "@/app/services/question.service";

// POST: Create New Question
export async function POST(req: Request) {
  try {
    const body = await req.json();

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

// GET: Fetch Questions with Search, Filter & Pagination
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const categoryId = searchParams.get("category") || "all";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const result = await getQuestions(search, categoryId, page, limit);

    return NextResponse.json({
      success: true,
      data: result.questions,
      metadata: result.metadata,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

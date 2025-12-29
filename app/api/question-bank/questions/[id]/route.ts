import { NextResponse } from "next/server";
import {
  deleteQuestion,
  getQuestionById,
  updateQuestion,
} from "@/app/services/question.service";

// Next.js 15 Params Type
type Props = {
  params: Promise<{ id: string }>;
};

// GET: Single Question
export async function GET(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const question = await getQuestionById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: question });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update Question
export async function PUT(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();

    const updatedQuestion = await updateQuestion(id, body);

    if (!updatedQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question updated successfully",
      data: updatedQuestion,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove Question
export async function DELETE(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const deletedQuestion = await deleteQuestion(id);

    if (!deletedQuestion) {
      return NextResponse.json(
        { success: false, error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

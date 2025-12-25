import { NextResponse } from "next/server";
import {
  deleteExam,
  getExamById,
  updateExam,
} from "@/app/services/exam.service";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Helper to format error responses consistently.
 */
function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "An error occurred";
  return NextResponse.json({ error: message }, { status: 500 });
}

// GET: Fetch Single Exam
export async function GET(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const exam = await getExamById(id);

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: exam });
  } catch (error) {
    return handleError(error);
  }
}

// PUT: Update Exam
export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedExam = await updateExam(id, body);

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully",
      data: updatedExam,
    });
  } catch (error) {
    return handleError(error);
  }
}

// DELETE: Remove Exam
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await deleteExam(id);

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    return handleError(error);
  }
}

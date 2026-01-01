import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import {
  deleteExam,
  getExamById,
  getExamByIdForStudent,
  updateExam,
} from "@/app/services/exam.service";
import { authOptions } from "@/lib/authOptions";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Helper to format error responses consistently.
 */
function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : "An error occurred";
  const status = message.includes("not found")
    ? 404
    : message.includes("not available")
    ? 403
    : 500;

  return NextResponse.json({ error: message }, { status });
}

// =================================================================
// GET: Fetch Single Exam (Validation for Submission)
// =================================================================
export async function GET(req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;

    // 1. Check Query Params for View Mode
    const { searchParams } = new URL(req.url);
    const isStudentView = searchParams.get("view") === "user";

    // ---------------------------------------------------------
    // 🎓 STUDENT VIEW (Validation & Secure Data)
    // ---------------------------------------------------------
    if (isStudentView) {
      // ১. সেশন চেক
      const session = await getServerSession(authOptions);
      const userId = session?.user?.id;

      if (!userId) {
        return NextResponse.json(
          { error: "Unauthorized. Please login." },
          { status: 401 }
        );
      }

      // ২. সার্ভিস কল
      const examData = await getExamByIdForStudent(id, userId);

      // ৩. রেজাল্ট চেক
      if (examData?.hasSubmitted) {
        return NextResponse.json({
          success: true,
          hasSubmitted: true,
          resultId: examData.resultId,
          message: "You have already completed this exam.",
        });
      }

      if (!examData) {
        return NextResponse.json({ error: "Exam not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: examData });
    }

    // ---------------------------------------------------------
    // 👑 ADMIN VIEW (Full Data)
    // ---------------------------------------------------------
    const examData = await getExamById(id);

    if (!examData) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: examData });
  } catch (error) {
    // 🔥🔥 DEBUGGING LOG: এটি আপনার টার্মিনালে এরর প্রিন্ট করবে
    console.error("❌ GET EXAM ERROR:", error);

    return handleError(error);
  }
}

// =================================================================
// PUT: Update Exam
// =================================================================
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
    console.error("❌ UPDATE EXAM ERROR:", error);
    return handleError(error);
  }
}

// =================================================================
// DELETE: Remove Exam
// =================================================================
export async function DELETE(_req: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    await deleteExam(id);

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE EXAM ERROR:", error);
    return handleError(error);
  }
}

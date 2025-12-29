// File: app/api/exams/public/route.ts

import { getPublicExams } from "@/app/services/exam.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // পাবলিক ইউজারদের জন্য নিরাপদ ডাটা (প্রশ্ন বাদে)
    const exams = await getPublicExams();

    return NextResponse.json(
      {
        success: true,
        data: exams,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // Real-time data
        },
      }
    );
  } catch (error: any) {
    console.error("Public Exams Error:", error);
    return NextResponse.json(
      { error: "Failed to load exam schedule" },
      { status: 500 }
    );
  }
}

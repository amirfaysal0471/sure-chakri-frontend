import {
  updateExamCategory,
  deleteExamCategory,
} from "@/app/services/examCategory.service";
import { NextResponse } from "next/server";

// Next.js 15 এ params একটি Promise
type Props = {
  params: Promise<{ id: string }>;
};

// PUT: Update Category
export async function PUT(req: Request, props: Props) {
  try {
    const params = await props.params; // 🔥 MUST AWAIT PARAMS
    const id = params.id;
    const body = await req.json();

    console.log("Updating ID:", id); // ডিবাগিং এর জন্য

    const result = await updateExamCategory(id, body);

    return NextResponse.json({
      message: "Category updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("PUT API Error:", error); // টার্মিনালে এরর দেখার জন্য
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Remove Category
export async function DELETE(req: Request, props: Props) {
  try {
    const params = await props.params; // 🔥 MUST AWAIT PARAMS
    const id = params.id;

    console.log("Deleting ID:", id); // ডিবাগিং এর জন্য

    await deleteExamCategory(id);

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error: any) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

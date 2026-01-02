import { NextResponse } from "next/server";
import {
  updateMessageStatus,
  deleteMessage,
} from "@/app/services/contact.service";

// ✅ PUT: স্ট্যাটাস বা নোট আপডেট করা (PATCH এর বদলে)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // সার্ভিস ফাংশন একই থাকবে, এটি ডাটা আপডেট করবে
    const updatedData = await updateMessageStatus(id, body);

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: মেসেজ ডিলিট করা
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteMessage(id);

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

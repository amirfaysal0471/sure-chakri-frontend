import { NextResponse } from "next/server";
import {
  updatePaymentMethod,
  deletePaymentMethod,
} from "@/app/services/payment.service";

// ১. PATCH: আপডেট করার জন্য (Edit / Toggle Active)
export async function PATCH(
  req: Request,
  // 🔥 FIX: params এখন Promise, তাই টাইপ এবং await ব্যবহার করতে হবে
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ params await করা হয়েছে
    const body = await req.json();

    const updatedMethod = await updatePaymentMethod(id, body);

    if (!updatedMethod) {
      return NextResponse.json(
        { success: false, error: "Method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedMethod });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ২. DELETE: ডিলিট করার জন্য
export async function DELETE(
  req: Request,
  // 🔥 FIX: params এখন Promise
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ params await করা হয়েছে

    const deletedMethod = await deletePaymentMethod(id);

    if (!deletedMethod) {
      return NextResponse.json(
        { success: false, error: "Method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

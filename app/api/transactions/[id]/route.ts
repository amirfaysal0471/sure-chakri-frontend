import { NextResponse } from "next/server";
import { verifyTransaction } from "@/app/services/payment.service";

// PATCH: ট্রানজেকশন স্ট্যাটাস আপডেট করার জন্য (Approved/Rejected)
export async function PATCH(
  req: Request,
  // 🔥 FIX 1: params এখন Promise, তাই টাইপ আপডেট করতে হবে
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔥 FIX 2: params await করে id বের করতে হবে
    const { id } = await params;

    const body = await req.json();
    const { status, adminNote } = body;

    // সার্ভিস ফাংশন কল (verifyTransaction)
    const updatedTransaction = await verifyTransaction(id, status, adminNote);

    return NextResponse.json({
      success: true,
      message: "Transaction updated successfully",
      data: updatedTransaction,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

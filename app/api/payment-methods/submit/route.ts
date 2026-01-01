import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { submitTransaction } from "@/app/services/payment.service";
import { authOptions } from "@/lib/authOptions"; // ✅ ১. এটি অবশ্যই আন-কমেন্ট করতে হবে

export async function POST(req: Request) {
  try {
    // ✅ ২. authOptions পাস করতে হবে, নইলে session নাল (null) আসবে
    const session = await getServerSession(authOptions);

    if (!session) {
      console.log("❌ Payment Submit Error: No Session Found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    console.log("📝 Payment Request Body:", body); // ডিবাগিং লগ

    // ৩. সার্ভিস কল করা
    const transaction = await submitTransaction(session.user.id, body);

    return NextResponse.json({
      success: true,
      message: "Payment submitted successfully!",
      data: transaction,
    });
  } catch (error: any) {
    // 🔥 ৪. টার্মিনালে আসল এররটি প্রিন্ট হবে
    console.error("❌ Transaction Error:", error.message);

    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

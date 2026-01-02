import { NextResponse } from "next/server";
import { verifyTransaction } from "@/app/services/payment.service";

// 🔥 Shared Helper Function (যাতে কোড ডুপ্লিকেট না হয়)
async function handleTransactionUpdate(
  req: Request,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    // 1. params await করে id বের করা (Next.js 15+)
    const { id } = await paramsPromise;

    const body = await req.json();
    const { status, adminNote } = body;

    // 2. সার্ভিস ফাংশন কল
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

// ✅ PUT Method (আপনার নতুন রিকোয়ারমেন্ট অনুযায়ী)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleTransactionUpdate(req, params);
}

// ✅ PATCH Method (আগের কম্প্যাটিবিলিটি বজায় রাখার জন্য)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleTransactionUpdate(req, params);
}

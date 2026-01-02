import { NextResponse } from "next/server";
import { getAllTransactions } from "@/app/services/payment.service"; // 🔥 সার্ভিস ইমপোর্ট করুন

export async function GET() {
  try {
    // 🔥 সরাসরি ডাটাবেস কল না করে সার্ভিস ফাংশন ব্যবহার করুন
    // এতে আপনার populate, sort এবং console.log লজিক সব এক জায়গায় থাকবে
    const transactions = await getAllTransactions();

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

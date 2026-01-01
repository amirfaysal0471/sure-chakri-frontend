import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Transaction from "@/app/models/transaction.model";

export async function GET() {
  try {
    await connectDB();
    // পপুলেট করে ইউজারের নাম ও ইমেইল সহ আনা হচ্ছে
    const transactions = await Transaction.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

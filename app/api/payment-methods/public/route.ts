import { NextResponse } from "next/server";
import { getPaymentMethods } from "@/app/services/payment.service";

export async function GET() {
  try {
    // false passed, so only Active methods will return
    const methods = await getPaymentMethods(false);
    return NextResponse.json({ success: true, data: methods });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to load methods" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import {
  addPaymentMethod,
  getPaymentMethods,
} from "@/app/services/payment.service";

export async function GET() {
  try {
    const methods = await getPaymentMethods(true); // true = isAdmin
    return NextResponse.json({ success: true, data: methods });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const method = await addPaymentMethod(body);
    return NextResponse.json({ success: true, data: method });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

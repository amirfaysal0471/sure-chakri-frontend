import { NextResponse } from "next/server";
import { getAllMessages } from "@/app/services/contact.service";

export const dynamic = "force-dynamic"; // ডাটা যেন ক্যাশ না হয়

export async function GET() {
  try {
    const messages = await getAllMessages();
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

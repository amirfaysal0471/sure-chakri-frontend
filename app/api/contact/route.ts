import { NextResponse } from "next/server";
import { createContactMessage } from "@/app/services/contact.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, ...formData } = body; // টোকেন এবং ফর্ম ডাটা আলাদা করা হলো

    // ১. টোকেন মিসিং চেক
    if (!token) {
      return NextResponse.json(
        { error: "Security check failed (No token provided)" },
        { status: 400 }
      );
    }

    // ২. Cloudflare ভেরিফিকেশন (Server-Side)
    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: process.env.TURNSTILE_SECRET_KEY, // .env.local থেকে সিক্রেট কি
          response: token,
        }),
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { error: "Security check failed (Invalid token)" },
        { status: 400 }
      );
    }

    // ৩. ভেরিফিকেশন সফল হলে ডাটাবেসে সেভ করা
    await createContactMessage(formData);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully!",
    });
  } catch (error: any) {
    console.error("Contact API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

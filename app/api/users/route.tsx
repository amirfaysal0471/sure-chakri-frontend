// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/app/models/User";

export async function GET() {
  try {
    await connectDB();

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching users", error: error.message },
      { status: 500 }
    );
  }
}

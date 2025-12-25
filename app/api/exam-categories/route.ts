import {
  createExamCategory,
  getExamCategories,
} from "@/app/services/examCategory.service";
import { NextResponse } from "next/server";

// POST: Create
export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const result = await createExamCategory(body);
    return NextResponse.json(
      { message: "Created successfully", data: result },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.message.includes("E11000")) {
      return NextResponse.json(
        { error: "Name already exists!" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET: Fetch All
export async function GET() {
  try {
    const data = await getExamCategories();
    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load" }, { status: 500 });
  }
}

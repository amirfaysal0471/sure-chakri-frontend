import {
  createCategory,
  getAllCategories,
} from "@/app/services/questionBankCategories.service";
import { NextResponse } from "next/server";
// GET: Fetch all categories with pagination/search
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "All";

    const data = await getAllCategories(page, limit, search, type);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create a new category
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Basic Validation
    if (!body.name || !body.type) {
      return NextResponse.json(
        { success: false, error: "Name and Type are required" },
        { status: 400 }
      );
    }

    const category = await createCategory(body);
    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

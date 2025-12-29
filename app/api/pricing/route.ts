import { NextResponse } from "next/server";
import {
  createPricingPlan,
  getPricingPlans,
  reorderPricingPlans,
} from "@/app/services/pricing.service";

// GET: Fetch All Plans
export async function GET() {
  try {
    const plans = await getPricingPlans();
    return NextResponse.json({ success: true, data: plans });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST: Create Plan
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Creating Plan Data:", body);
    const newPlan = await createPricingPlan(body);
    return NextResponse.json({ success: true, data: newPlan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT: Reorder Plans (Expects array of IDs)
export async function PUT(req: Request) {
  try {
    const body = await req.json();

    // Check if it's a reorder request
    if (body.action === "reorder" && Array.isArray(body.orderedIds)) {
      await reorderPricingPlans(body.orderedIds);
      return NextResponse.json({
        success: true,
        message: "Plans reordered successfully",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

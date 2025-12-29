import { NextResponse } from "next/server";
import {
  deletePricingPlan,
  updatePricingPlan,
} from "@/app/services/pricing.service";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// PUT: Update Plan
export async function PUT(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updatedPlan = await updatePricingPlan(id, body);

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete Plan
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    const deletedPlan = await deletePricingPlan(id);

    if (!deletedPlan) {
      return NextResponse.json(
        { success: false, error: "Plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

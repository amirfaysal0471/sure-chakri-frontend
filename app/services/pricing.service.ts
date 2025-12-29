import PricingPlan, { IPricingPlan } from "@/app/models/pricing.model";
import connectDB from "@/lib/db";

// Get All Plans (Sorted by Order)
export const getPricingPlans = async () => {
  await connectDB();
  const plans = await PricingPlan.find().sort({ order: 1 }).lean();
  return plans.map((plan: any) => ({
    ...plan,
    id: plan._id.toString(),
    _id: plan._id.toString(),
    features: plan.features.map((f: any) => ({
      ...f,
      id: f._id ? f._id.toString() : Date.now().toString(),
    })),
  }));
};

// Create New Plan
export const createPricingPlan = async (data: Partial<IPricingPlan>) => {
  await connectDB();
  const lastPlan = await PricingPlan.findOne().sort({ order: -1 });
  const newOrder = lastPlan && lastPlan.order ? lastPlan.order + 1 : 0;

  const newPlan = await PricingPlan.create({ ...data, order: newOrder });
  return newPlan;
};

// Update Plan
export const updatePricingPlan = async (
  id: string,
  data: Partial<IPricingPlan>
) => {
  await connectDB();
  const updatedPlan = await PricingPlan.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updatedPlan;
};

// Delete Plan
export const deletePricingPlan = async (id: string) => {
  await connectDB();
  return await PricingPlan.findByIdAndDelete(id);
};

// Reorder Plans (Bulk Update)
export const reorderPricingPlans = async (orderedIds: string[]) => {
  await connectDB();

  const bulkOps = orderedIds.map((id, index) => ({
    updateOne: {
      // 🔥 FIX: 'id' কে 'any' হিসেবে কাস্ট করা হয়েছে টাইপ এরর এড়াতে
      filter: { _id: id as any },
      update: { $set: { order: index } },
    },
  }));

  // অথবা এখানে 'bulkOps as any' ব্যবহার করা যেতে পারে
  await PricingPlan.bulkWrite(bulkOps as any);

  return true;
};

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFeature {
  text: string;
  included: boolean;
}

export interface IPricingPlan extends Document {
  title: string;
  description: string;

  // 🔥 নতুন ফিল্ড
  planId: "free" | "pro" | "premium";

  price: number;
  yearlyPrice?: number;
  currency: string;
  billingCycle: "Monthly" | "Yearly" | "One-time";
  discountPercent?: number;
  isPopular: boolean;
  customBadge?: string;
  isActive: boolean;
  features: IFeature[];
  buttonText: string;
  buttonLink: string;
  colorTheme: string;
  order: number;
}

const FeatureSchema = new Schema<IFeature>({
  text: { type: String, required: true },
  included: { type: Boolean, default: true },
});

const PricingPlanSchema = new Schema<IPricingPlan>(
  {
    title: { type: String, required: true },
    description: { type: String },

    // 🔥 এই অংশটি মিসিং ছিল, তাই ডাটাবেসে সেভ হচ্ছিল না
    planId: {
      type: String,
      required: true,
      enum: ["free", "pro", "premium"],
      default: "free",
    },

    price: { type: Number, default: 0 },
    yearlyPrice: { type: Number },
    currency: { type: String, default: "৳" },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Yearly", "One-time"],
      default: "Monthly",
    },
    discountPercent: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    customBadge: { type: String },
    isActive: { type: Boolean, default: true },
    features: [FeatureSchema],
    buttonText: { type: String, default: "Subscribe" },
    buttonLink: { type: String, default: "#" },
    colorTheme: { type: String, default: "blue" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// 🔥 FIX: পুরনো মডেল ক্যাশ মুছে ফেলে নতুন করে তৈরি করা
// এটি ডেভেলপমেন্ট মোডে স্কিমা আপডেট না হওয়ার সমস্যা সমাধান করবে
if (mongoose.models.PricingPlan) {
  delete mongoose.models.PricingPlan;
}

const PricingPlan: Model<IPricingPlan> = mongoose.model<IPricingPlan>(
  "PricingPlan",
  PricingPlanSchema
);

export default PricingPlan;

export interface PlanFeature {
  id?: string;
  text: string;
  included: boolean;
}

export interface PricingPlan {
  _id?: string;
  id?: string;
  title: string;
  description: string;

  // 🔥 নতুন ফিল্ড: User Model এর সাথে মিল রাখার জন্য
  planId: "free" | "pro" | "premium";

  price: number;
  yearlyPrice?: number;
  currency: string;
  billingCycle: "Monthly" | "Yearly" | "One-time";
  discountPercent?: number;
  isPopular: boolean;
  customBadge?: string;
  isActive: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonLink: string;
  colorTheme: string;
  order?: number;
}

export const COLOR_THEMES = [
  {
    name: "Blue",
    value: "blue",
    bg: "bg-blue-600",
    text: "text-blue-600",
    border: "border-blue-600",
  },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-600",
    text: "text-green-600",
    border: "border-green-600",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-purple-600",
    text: "text-purple-600",
    border: "border-purple-600",
  },
  {
    name: "Orange",
    value: "orange",
    bg: "bg-orange-600",
    text: "text-orange-600",
    border: "border-orange-600",
  },
  {
    name: "Slate",
    value: "slate",
    bg: "bg-slate-600",
    text: "text-slate-600",
    border: "border-slate-600",
  },
  {
    name: "Red",
    value: "red",
    bg: "bg-red-600",
    text: "text-red-600",
    border: "border-red-600",
  },
];

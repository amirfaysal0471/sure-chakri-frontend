"use client";

import { useState } from "react";
import { Check, X, Sparkles, Zap, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

// --- Mock Data: Pricing Plans ---
const PLANS = [
  {
    id: "free",
    name: "Basic",
    description:
      "শুরু করার জন্য সেরা। প্রতিদিনের ফ্রি পরীক্ষাগুলো দিয়ে নিজেকে যাচাই করুন।",
    price: { monthly: 0, yearly: 0 },
    features: [
      "Daily 1 Free Live Exam",
      "Basic Leaderboard Access",
      "Public Study Group Access",
      "Limited Solution Explanations",
    ],
    notIncluded: [
      "Subject-wise Archive Exams",
      "Detailed Performance Analytics",
      "Exclusive PDF Notes",
      "Ad-free Experience",
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro Learner",
    description:
      "সিরিয়াস পরীক্ষার্থীদের জন্য। আনলিমিটেড এক্সাম এবং অ্যাডভান্সড অ্যানালিটিক্স।",
    price: { monthly: 499, yearly: 399 }, // Yearly is the 'per month' cost when billed yearly
    features: [
      "Unlimited Live & Archive Exams",
      "Advanced AI Analytics Dashboard",
      "Topic-wise Weakness Finder",
      "Exclusive PDF Suggestion Notes",
      "Priority Mentor Support",
      "Ad-free Seamless Experience",
    ],
    notIncluded: [],
    cta: "Upgrade to Pro",
    popular: true, // Highlights this card
  },
  {
    id: "team",
    name: "Exam Batch",
    description:
      "নির্দিষ্ট পরীক্ষার (যেমন: প্রাইমারি/ব্যাংক) ক্র্যাশ কোর্স বা স্পেশাল ব্যাচ।",
    price: { monthly: 1500, yearly: 1200 }, // Flat rate usually, but keeping structure
    features: [
      "Everything in Pro Learner",
      "Live Zoom Classes (Weekly)",
      "Dedicated Mentor Guidance",
      "Hardcopy Lecture Sheet Delivery",
      "Private WhatsApp Group",
    ],
    notIncluded: [],
    cta: "Join Special Batch",
    popular: false,
  },
];

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className="py-24 bg-muted/30 relative" id="pricing">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 dark:bg-black dark:[background:radial-gradient(#1f2937_1px,transparent_1px)]"></div>

      <div className="container mx-auto px-4">
        {/* --- Header --- */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            সিম্পল প্রাইসিং, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              সর্বোচ্চ ভ্যালু।
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            লুকানো কোনো চার্জ নেই। আপনার প্রস্তুতির ধরন অনুযায়ী সেরা প্যাকেজটি
            বেছে নিন।
          </p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span
              className={cn(
                "text-sm font-bold",
                !isYearly ? "text-primary" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span
              className={cn(
                "text-sm font-bold",
                isYearly ? "text-primary" : "text-muted-foreground"
              )}
            >
              Yearly{" "}
              <Badge
                variant="secondary"
                className="ml-1 text-[10px] bg-green-100 text-green-700"
              >
                -20% OFF
              </Badge>
            </span>
          </div>
        </div>

        {/* --- Pricing Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={cn(
                "relative flex flex-col transition-all duration-300 hover:-translate-y-2",
                plan.popular
                  ? "border-primary shadow-2xl scale-105 z-10 bg-background"
                  : "border-border shadow-sm bg-background/50 hover:shadow-lg"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white px-4 py-1 text-sm font-bold shadow-lg">
                    <Sparkles className="w-3 h-3 mr-2 fill-current" /> Most
                    Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-10">
                <h3 className="text-xl font-bold text-foreground">
                  {plan.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black tracking-tight">
                    ৳{isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-muted-foreground font-medium">
                    /month
                  </span>
                </div>
                {isYearly && plan.price.monthly > 0 && (
                  <p className="text-xs text-green-600 font-bold mt-1">
                    Billed ৳{plan.price.yearly * 12} yearly
                  </p>
                )}
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4 text-sm">
                  {/* Included Features */}
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-full bg-primary/10 p-1 text-primary">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground/80">{feature}</span>
                    </li>
                  ))}

                  {/* Not Included Features (Disabled style) */}
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 opacity-50">
                      <div className="mt-0.5 rounded-full bg-muted p-1 text-muted-foreground">
                        <X className="w-3 h-3" />
                      </div>
                      <span className="text-muted-foreground line-through decoration-muted-foreground/50">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pb-8">
                <Button
                  className={cn(
                    "w-full font-bold h-12 rounded-xl text-base transition-all",
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                      : "bg-white border-2 border-primary text-primary hover:bg-primary/5"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}{" "}
                  {plan.popular && (
                    <Zap className="w-4 h-4 ml-2 fill-current" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust Note */}
        <p className="text-center text-sm text-muted-foreground mt-12 flex items-center justify-center gap-2">
          <Shield className="w-4 h-4" /> Secure payment via bKash, Nagad, Rocket
          & Cards.
        </p>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Shield,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

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
import { useData } from "@/app/hooks/use-data";
import { LoginModal } from "@/app/components/auth/login-modal";

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  // 🔥 State for Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<{
    id: string;
    price: number;
    title: string;
  } | null>(null);

  const userPlan = session?.user?.plan || "free";

  // Fetch Pricing Plans
  const { data: responseData, isLoading } = useData<any>(
    ["public-pricing-plans"],
    "/api/pricing"
  );

  const plans = responseData?.data || [];

  // --- Helper: Redirect to Checkout ---
  const goToCheckout = (planId: string, price: number, title: string) => {
    const billingType = isYearly ? "yearly" : "monthly";
    router.push(
      `/checkout/${planId}?price=${price}&billing=${billingType}&title=${encodeURIComponent(
        title
      )}`
    );
  };

  // 🔥 Handle Subscribe Click
  const handleSubscribe = (planId: string, price: number, title: string) => {
    // 1. If Logged In -> Go directly to checkout
    if (session) {
      goToCheckout(planId, price, title);
    } else {
      // 2. If Not Logged In -> Save plan details & Open Modal
      setPendingPlan({ id: planId, price, title });
      setIsLoginModalOpen(true);
      toast.info("Please login to continue subscription.");
    }
  };

  // 🔥 Callback after successful login
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    if (pendingPlan) {
      toast.success("Login successful! Redirecting to checkout...");
      // Small delay to ensure session is updated
      setTimeout(() => {
        goToCheckout(pendingPlan.id, pendingPlan.price, pendingPlan.title);
        setPendingPlan(null); // Reset
      }, 500);
    }
  };

  return (
    <>
      <section
        className="py-12 md:py-24 bg-muted/30 relative overflow-hidden"
        id="pricing"
      >
        {/* Background Decor */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50 dark:[background:radial-gradient(#1f2937_1px,transparent_1px)]"></div>

        <div className="container mx-auto px-4 md:px-6">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
              Simple Pricing,{" "}
              <span className="text-primary">Maximum Value</span>
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground px-4">
              No hidden charges. Choose the best package for your preparation.
            </p>

            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-3 mt-8">
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
                className="data-[state=checked]:bg-primary shadow-sm scale-90 md:scale-100"
              />
              <span
                className={cn(
                  "text-sm font-bold flex items-center gap-1.5",
                  isYearly ? "text-primary" : "text-muted-foreground"
                )}
              >
                Yearly{" "}
                <Badge
                  variant="secondary"
                  className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 border-green-200"
                >
                  Save 20%
                </Badge>
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-muted-foreground animate-pulse">
                Loading plans...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-7xl mx-auto items-stretch">
              {plans.map((plan: any) => {
                const monthlyPrice = plan.price;
                const totalYearlyPrice = plan.yearlyPrice || plan.price * 12;

                const displayPrice = isYearly
                  ? Math.round(totalYearlyPrice / 12)
                  : monthlyPrice;

                const actualPayableAmount = isYearly
                  ? totalYearlyPrice
                  : monthlyPrice;

                const isActivePlan = !!session && userPlan === plan.planId;

                return (
                  <Card
                    key={plan._id}
                    className={cn(
                      "relative flex flex-col w-full h-full transition-all duration-300",
                      isActivePlan
                        ? "border-green-500 ring-2 ring-green-500 shadow-xl bg-green-50/50 z-20 scale-100 md:scale-105 transform-gpu"
                        : plan.isPopular
                        ? "border-primary/50 shadow-2xl z-10 bg-background scale-100 md:scale-105 transform-gpu"
                        : "border-border shadow-sm bg-card hover:shadow-lg md:hover:-translate-y-2"
                    )}
                  >
                    {/* Active Badge */}
                    {isActivePlan && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center z-30">
                        <Badge className="bg-green-600 text-white px-4 py-1 text-xs md:text-sm font-bold shadow-md flex items-center gap-1 uppercase tracking-wide">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Current Plan
                        </Badge>
                      </div>
                    )}

                    {/* Popular Badge */}
                    {!isActivePlan && (plan.isPopular || plan.customBadge) && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center z-30">
                        <Badge
                          className={cn(
                            "text-white px-4 py-1 text-xs md:text-sm font-bold shadow-md uppercase tracking-wide",
                            plan.isPopular
                              ? "bg-gradient-to-r from-primary to-blue-600 border-none"
                              : "bg-zinc-800"
                          )}
                        >
                          {plan.isPopular && (
                            <Sparkles className="w-3.5 h-3.5 mr-1.5 fill-current" />
                          )}
                          {plan.customBadge || "Most Popular"}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-8 pt-10 px-4">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {plan.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-2 min-h-[40px] px-2 line-clamp-2">
                        {plan.description}
                      </p>
                      <div className="mt-6 flex items-baseline justify-center gap-1">
                        <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                          {plan.currency}
                          {displayPrice}
                        </span>
                        <span className="text-muted-foreground font-medium text-base">
                          /mo
                        </span>
                      </div>
                      {isYearly && (
                        <p className="text-xs text-green-600 font-bold mt-2 bg-green-100 px-3 py-1 rounded-full inline-block">
                          Billed {plan.currency}
                          {totalYearlyPrice} yearly
                        </p>
                      )}
                    </CardHeader>

                    <CardContent className="flex-1 px-6 md:px-8">
                      <div className="w-full h-px bg-border/60 mb-6"></div>
                      <ul className="space-y-4 text-sm">
                        {plan.features.map((feature: any, i: number) => (
                          <li
                            key={i}
                            className={cn(
                              "flex items-start gap-3",
                              !feature.included && "opacity-50 grayscale"
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 shrink-0 rounded-full p-1 w-5 h-5 flex items-center justify-center",
                                feature.included
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              {feature.included ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <X className="w-3 h-3" />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-foreground/90 leading-relaxed",
                                !feature.included &&
                                  "line-through decoration-muted-foreground/40"
                              )}
                            >
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="pb-8 pt-4 px-6 md:px-8 mt-auto">
                      <Button
                        onClick={() =>
                          handleSubscribe(
                            plan._id,
                            actualPayableAmount,
                            plan.title
                          )
                        }
                        disabled={isActivePlan}
                        className={cn(
                          "w-full font-bold h-12 rounded-xl text-base shadow-sm transition-all duration-200",
                          isActivePlan
                            ? "bg-green-600 text-white opacity-100 cursor-default hover:bg-green-600"
                            : plan.isPopular
                            ? "bg-primary hover:bg-primary/90 hover:scale-[1.02] shadow-primary/25"
                            : "bg-background border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary"
                        )}
                        variant={
                          isActivePlan
                            ? "default"
                            : plan.isPopular
                            ? "default"
                            : "outline"
                        }
                      >
                        {isActivePlan ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" /> Active Plan
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            {plan.buttonText || "Subscribe Now"}
                            {plan.isPopular && (
                              <Zap className="w-4 h-4 fill-current" />
                            )}
                          </span>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 pb-8 text-center">
            <p className="text-sm text-muted-foreground inline-flex items-center gap-2 bg-background/80 px-4 py-2 rounded-full border border-border/50 shadow-sm backdrop-blur-sm">
              <Shield className="w-4 h-4 text-green-600" />
              Secure payment via bKash, Nagad & Cards.
            </p>
          </div>
        </div>
      </section>

      {/* 🔥 Login Modal Integration */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={setIsLoginModalOpen}
        preventRedirect={true} // Redirect না করে Checkout এ পাঠাবো
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
}

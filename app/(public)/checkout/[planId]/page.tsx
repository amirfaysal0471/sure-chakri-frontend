"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Loader2,
  Copy,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Hash,
  Wallet,
  CreditCard,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Types
interface PaymentMethod {
  _id: string;
  name: string;
  logo: string;
  accountNumber: string;
  instruction: string;
  charge: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // ✅ হুক ব্যবহার করা হয়েছে

  // Plan ID from URL (It is now the MongoDB _id)
  const planId = params?.planId as string;

  // Parsing Search Params
  const rawPrice = searchParams.get("price");
  const planPrice = rawPrice ? Number(rawPrice) : 0;
  const billingType = searchParams.get("billing") || "monthly";
  const planName = searchParams.get("title") || "Subscription Plan";

  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    senderNumber: "",
    trxId: "",
  });

  // 1. Fetch Payment Methods
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const res = await fetch("/api/payment-methods/public");
        const data = await res.json();
        if (data.success) {
          setMethods(data.data);
        }
      } catch (error) {
        toast.error("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };
    fetchMethods();
  }, []);

  // 2. Submit Logic
  const handleSubmit = async () => {
    if (!selectedMethod || !formData.senderNumber || !formData.trxId) {
      toast.error("Please fill all payment details");
      return;
    }

    if (!planId) {
      toast.error("Plan ID missing. Please try again from pricing page.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/payment-methods/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: planId, // ✅ MongoDB ObjectId (from URL)
          amount:
            selectedMethod.charge > 0
              ? Math.round(
                  planPrice + (planPrice * selectedMethod.charge) / 100
                )
              : planPrice,
          paymentMethod: selectedMethod.name,
          senderNumber: formData.senderNumber,
          trxId: formData.trxId,
          billingCycle: billingType,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Payment submitted successfully!");
        router.push("/payment/success");
      } else {
        toast.error(data.error || "Submission failed");
        router.push("/payment/failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculations
  const gatewayCharge = selectedMethod
    ? Math.round((planPrice * selectedMethod.charge) / 100)
    : 0;
  const finalAmount = planPrice + gatewayCharge;

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading Secure Gateway...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20 pt-8 md:py-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Page Title */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Complete Payment
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Securely upgrade to{" "}
            <span className="font-semibold text-primary">{planName}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          {/* --- LEFT SIDE: Order Summary --- */}
          <div className="md:col-span-5 lg:col-span-4 order-1 md:order-2">
            <div className="md:sticky md:top-24 space-y-4">
              {/* Plan Details Card */}
              <Card className="border-none shadow-md bg-gradient-to-br from-primary/10 via-primary/5 to-background border-l-4 border-l-primary overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                        Selected Plan
                      </p>
                      <CardTitle className="text-xl font-bold">
                        {planName}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="mt-2 capitalize bg-background/50 border-primary/20"
                      >
                        {billingType} Billing
                      </Badge>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black text-foreground">
                        ৳{planPrice}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>৳{planPrice}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Gateway Charge</span>
                      <span
                        className={cn(
                          selectedMethod && "text-orange-600 font-medium"
                        )}
                      >
                        {selectedMethod ? `+ ৳${gatewayCharge}` : "--"}
                      </span>
                    </div>
                    <Separator className="my-2 bg-primary/10" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-foreground">
                        Total Payable
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ৳{finalAmount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Note */}
              <div className="hidden md:flex items-start gap-3 p-4 rounded-lg border bg-blue-50/50 border-blue-100 text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <p className="text-blue-900 leading-snug">
                  Payments are manually verified. Activation takes 10-30
                  minutes.
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Payment Process --- */}
          <div className="md:col-span-7 lg:col-span-8 order-2 md:order-1 space-y-6">
            {/* 1. Payment Method Selection */}
            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="bg-card border-b px-5 py-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-muted-foreground" /> Select
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <RadioGroup
                  onValueChange={(val) =>
                    setSelectedMethod(
                      methods.find((m) => m.name === val) || null
                    )
                  }
                  className="grid grid-cols-2 sm:grid-cols-3 gap-3"
                >
                  {methods.map((method) => {
                    const isSelected = selectedMethod?.name === method.name;
                    // 🔥 SAFE PATH LOGIC FOR MOBILE
                    const logoSrc = method.logo
                      ? method.logo.startsWith("/")
                        ? method.logo
                        : `/${method.logo}`
                      : null;

                    return (
                      <div key={method._id} className="relative">
                        <RadioGroupItem
                          value={method.name}
                          id={method.name}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={method.name}
                          className={cn(
                            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 h-24 relative hover:bg-muted/30",
                            isSelected
                              ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                              : "border-muted/60 bg-card"
                          )}
                        >
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 text-primary animate-in zoom-in duration-300">
                              <CheckCircle2 className="w-4 h-4 fill-primary/10" />
                            </div>
                          )}

                          {logoSrc ? (
                            <div className="relative h-10 w-16">
                              <Image
                                src={logoSrc}
                                alt={method.name}
                                fill
                                className="object-contain"
                                unoptimized={true} // ✅ Mobile Fix
                              />
                            </div>
                          ) : (
                            <CreditCard className="h-8 w-8 text-muted-foreground" />
                          )}
                          <span
                            className={cn(
                              "text-xs font-semibold",
                              isSelected
                                ? "text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            {method.name}
                          </span>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* 2. Instructions & Form */}
            {selectedMethod ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Step 1: Send Money */}
                <div className="relative rounded-xl border border-blue-200 bg-blue-50/30 p-5 dark:border-blue-900 dark:bg-blue-900/10">
                  <div className="absolute -top-3 left-4 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    STEP 1
                  </div>
                  <div className="mt-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-blue-900 dark:text-blue-100">
                        Send Money
                      </h3>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedMethod.instruction ||
                        "Please send the exact amount to the number below."}
                    </p>

                    <div className="flex items-center justify-between gap-3 bg-background border border-blue-100 rounded-lg p-3 shadow-sm max-w-sm">
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                          {selectedMethod.name} Number
                        </p>
                        <p className="font-mono text-xl font-bold tracking-wider text-foreground">
                          {selectedMethod.accountNumber}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-9 px-3 shrink-0 active:scale-95 transition-transform"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            selectedMethod.accountNumber
                          );
                          toast.success("Number Copied!");
                        }}
                      >
                        <Copy className="h-4 w-4 mr-1.5" /> Copy
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Step 2: Verify */}
                <Card className="border-none shadow-sm overflow-hidden">
                  <CardHeader className="bg-card border-b px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary text-primary-foreground h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        2
                      </Badge>
                      <CardTitle className="text-lg">Payment Details</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 space-y-5">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
                        Sender Number <Info className="w-3 h-3" />
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="01xxxxxxxxx"
                          className="pl-9 h-11 text-base bg-muted/20 focus:bg-background transition-colors"
                          value={formData.senderNumber}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              senderNumber: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-muted-foreground">
                        Transaction ID (TrxID)
                      </Label>
                      <div className="relative group">
                        <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="8HG..."
                          className="pl-9 h-11 text-base font-mono uppercase placeholder:normal-case bg-muted/20 focus:bg-background transition-colors"
                          value={formData.trxId}
                          onChange={(e) =>
                            setFormData({ ...formData, trxId: e.target.value })
                          }
                        />
                      </div>
                      <p className="text-[11px] text-muted-foreground">
                        * Enter the TrxID you received after sending money.
                      </p>
                    </div>

                    <Button
                      className="w-full h-12 text-base font-bold shadow-lg shadow-primary/20 mt-2"
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                          Verifying...
                        </>
                      ) : (
                        <>
                          Confirm Payment{" "}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>

                    {/* Mobile Security Note */}
                    <div className="md:hidden flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Secure & Encrypted Connection
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Empty State Placeholder
              <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed border-muted">
                <div className="bg-background p-3 rounded-full shadow-sm mb-3">
                  <Wallet className="w-6 h-6 text-muted-foreground/50" />
                </div>
                <p className="font-medium">Choose a Method</p>
                <p className="text-sm max-w-xs mx-auto mt-1">
                  Select Bkash, Nagad or Rocket to see the payment number and
                  instructions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { CheckCircle2, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="max-w-md w-full border-green-200 shadow-xl overflow-hidden relative">
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

        <CardContent className="pt-10 pb-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            {/* Animated Ping Effect */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-green-700">
              Payment Submitted!
            </h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              We have received your payment request. Our team will verify the
              Transaction ID and activate your plan within <b>10-30 minutes</b>.
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-sm text-green-800">
            <p>You will receive a notification once your plan is active.</p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 bg-muted/30 p-6">
          <Button
            asChild
            className="w-full h-11 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200"
          >
            <Link href="/user-dashboard">
              Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="w-full text-muted-foreground"
          >
            <Link href="/">
              <Home className="mr-2 w-4 h-4" /> Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

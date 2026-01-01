"use client";

import Link from "next/link";
import { XCircle, RefreshCw, MessageCircleQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="max-w-md w-full border-red-200 shadow-xl overflow-hidden relative">
        {/* Top Decorative Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-red-500"></div>

        <CardContent className="pt-10 pb-6 text-center space-y-6">
          {/* Failed Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-in zoom-in duration-300">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-red-700">Payment Failed!</h1>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              We couldn't process your payment submission. This might be due to
              a network issue or the Transaction ID is already used.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 bg-muted/30 p-6">
          <Button
            asChild
            className="w-full h-11 text-base font-semibold bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
          >
            <Link href="/pricing">
              <RefreshCw className="mr-2 w-4 h-4" /> Try Again
            </Link>
          </Button>

          <div className="relative w-full py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-muted/30 px-2 text-muted-foreground">
                Need Help?
              </span>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="w-full border-red-200 hover:bg-red-50 text-red-700"
          >
            <Link href="/contact">
              <MessageCircleQuestion className="mr-2 w-4 h-4" /> Contact Support
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

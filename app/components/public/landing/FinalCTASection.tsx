"use client";

import Link from "next/link";
import { ArrowRight, Smartphone, Apple, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="relative rounded-3xl overflow-hidden bg-primary px-6 py-16 sm:px-12 sm:py-24 shadow-2xl">
        {/* --- Background Decorations --- */}
        <div className="absolute inset-0 -z-10 h-full w-full">
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>

          {/* Radial Gradient Glow */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md mb-8 border border-white/10 animate-in slide-in-from-bottom-4 fade-in duration-700">
            <span className="flex h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <span>১.৫ লক্ষ+ শিক্ষার্থীর আস্থার প্ল্যাটফর্ম</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
            স্বপ্ন পূরণের যাত্রা <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
              শুরু হোক আজ থেকেই।
            </span>
          </h2>

          {/* Subtext */}
          <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-10">
            আর দেরি কেন? এখনই ফ্রি রেজিস্ট্রেশন করুন এবং আপনার প্রস্তুতির লেভেল
            যাচাই করুন। আমাদের মোবাইল অ্যাপ ডাউনলোড করে প্রস্তুতি নিন যেকোনো
            সময়, যেকোনো স্থানে।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Primary Action */}
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-white text-primary hover:bg-blue-50 hover:text-primary shadow-xl rounded-full"
              asChild
            >
              <Link href="/register">
                Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* App Store Buttons (Mock) */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-14 px-6 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
              >
                <Apple className="mr-2 h-5 w-5" />
                <div className="text-left leading-none">
                  <div className="text-[10px] font-medium opacity-80">
                    Download on the
                  </div>
                  <div className="text-sm font-bold">App Store</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-14 px-6 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                <div className="text-left leading-none">
                  <div className="text-[10px] font-medium opacity-80">
                    Get it on
                  </div>
                  <div className="text-sm font-bold">Google Play</div>
                </div>
              </Button>
            </div>
          </div>

          {/* Trust Footer */}
          <p className="mt-8 text-sm text-blue-200/60 font-medium">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
  );
}

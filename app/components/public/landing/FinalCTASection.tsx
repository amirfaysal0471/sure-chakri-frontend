"use client";

import Link from "next/link";
import {
  ArrowRight,
  Laptop,
  Smartphone,
  Globe,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FinalCTASection() {
  return (
    <section className="py-20 container mx-auto px-4">
      <div className="relative rounded-[2.5rem] overflow-hidden bg-primary px-6 py-16 sm:px-12 sm:py-24 shadow-2xl ring-1 ring-white/10">
        {/* --- Background Decorations --- */}
        <div className="absolute inset-0 -z-10 h-full w-full">
          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)]"></div>

          {/* Glowing Orbs */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-white/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-80 h-80 bg-blue-400/30 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md mb-8 border border-white/20 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span>১.৫ লক্ষ+ শিক্ষার্থীর আস্থার প্ল্যাটফর্ম</span>
          </div>

          {/* Headline */}
          <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl mb-6 leading-tight">
            স্বপ্ন পূরণের যাত্রা <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-400">
              শুরু হোক আজ থেকেই।
            </span>
          </h2>

          {/* Subtext (Updated for Web Platform) */}
          <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-10 leading-relaxed">
            কোনো অ্যাপ ইন্সটলের ঝামেলা নেই! আপনার মোবাইল বা ল্যাপটপের ব্রাউজার
            থেকেই সবচেয়ে আধুনিক পরীক্ষার প্রস্তুতি নিন যেকোনো সময়, যেকোনো
            স্থানে।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            {/* Primary Action */}
            <Button
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-bold bg-white text-primary hover:bg-blue-50 hover:text-primary shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-all rounded-full group"
              asChild
            >
              <Link href="/register">
                রেজিস্ট্রেশন করুন ফ্রি-তে{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Secondary Action */}
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-14 px-8 text-base font-bold border-white/30 text-white bg-transparent hover:bg-white/10 hover:text-white rounded-full backdrop-blur-sm"
              asChild
            >
              <Link href="/courses">কোর্সসমূহ দেখুন</Link>
            </Button>
          </div>

          {/* Platform Compatibility Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-white/60 text-sm font-medium border-t border-white/10 pt-8 max-w-2xl mx-auto">
            <span className="uppercase tracking-widest text-[10px] opacity-50 w-full md:w-auto mb-2 md:mb-0">
              Supported On:
            </span>

            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Laptop className="w-5 h-5" />
              <span>Web Browser</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Smartphone className="w-5 h-5" />
              <span>Mobile Web</span>
            </div>
            <div className="flex items-center gap-2 hover:text-white transition-colors">
              <Globe className="w-5 h-5" />
              <span>Any Device</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

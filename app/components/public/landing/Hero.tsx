"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-background">
      {/* --- 1. Background Ambience --- */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>
      <div className="absolute inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- LEFT SIDE: Content --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 backdrop-blur-sm text-sm font-medium text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              Live: 46th BCS Model Test Ongoing
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
              Exam Hall-এর ভয়, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                এখন ঘরে বসেই জয়।
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              বাংলাদেশের একমাত্র প্ল্যাটফর্ম যেখানে{" "}
              <strong>Strict Timing</strong> এবং{" "}
              <strong>Negative Marking</strong> আপনাকে আসল যুদ্ধের জন্য প্রস্তুত
              করবে।
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Button
                size="lg"
                className="h-14 px-8 text-base font-bold rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                asChild
              >
                <Link href="/register">
                  Start Free Exam <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-bold rounded-full border-2 hover:bg-muted/50"
                asChild
              >
                <Link href="/leaderboard">
                  <Trophy className="mr-2 w-5 h-5 text-yellow-500" /> View
                  Leaderboard
                </Link>
              </Button>
            </div>

            {/* Social Proof Avatar Group */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <Avatar
                    key={i}
                    className="border-2 border-background w-10 h-10"
                  >
                    <AvatarImage
                      src={`https://i.pravatar.cc/100?u=${i + 10}`}
                    />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  +2k
                </div>
              </div>
              <div className="flex flex-col text-sm">
                <div className="flex text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-muted-foreground font-medium">
                  Trusted by top rankers
                </span>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Hero Image --- */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-[500px] lg:max-w-[600px] perspective-1000 animate-in fade-in zoom-in duration-1000 delay-200">
            {/* Background Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl -z-10 opacity-60" />

            {/* THE IMAGE COMPONENT */}
            {/* Make sure you have 'hero.png' inside your 'public' folder */}
            <Image
              src="/hero.png"
              alt="Students taking exam illustration"
              width={600}
              height={400}
              className="w-full h-auto rounded-3xl shadow-2xl border transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500"
              priority
            />

            {/* Floating Decoration Card */}
            <div className="absolute -right-6 top-20 p-4 bg-background/90 backdrop-blur-xl shadow-xl border rounded-2xl animate-bounce duration-[3000ms] hidden md:flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase">
                  Rank #1
                </p>
                <p className="font-bold text-sm">Sakib Al Hasan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

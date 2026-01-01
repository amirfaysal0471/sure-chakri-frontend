"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Trophy, Star, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// টাইপ ডিফাইন করা
interface Champion {
  name: string;
  image?: string;
  totalPoints: number;
}

export default function HeroSection() {
  const [champion, setChampion] = useState<Champion | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 API থেকে র‍্যাংক ১ এর ডাটা আনা
  useEffect(() => {
    const fetchChampion = async () => {
      try {
        const res = await fetch("/api/leaderboard/top");
        const data = await res.json();
        if (data.success) {
          setChampion(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch champion", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChampion();
  }, []);

  return (
    <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden bg-background">
      {/* ... Background Effects (Same as before) ... */}
      <div className="absolute top-0 right-0 -z-10 translate-x-1/2 -translate-y-1/2">
        <div className="h-[600px] w-[600px] rounded-full bg-primary/10 blur-[100px]" />
      </div>
      <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/2 translate-y-1/2">
        <div className="h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
      </div>
      <div className="absolute inset-0 -z-20 h-full w-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- LEFT SIDE (Same as before) --- */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border bg-muted/50 backdrop-blur-sm text-sm font-medium text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
              Live: 50th BCS Model Test Ongoing
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.15]">
              Exam Hall-এর ভয়, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600">
                এখন ঘরে বসেই জয়।
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              স্মার্ট এক্সাম সিস্টেমের মাধ্যমে নিজের ভুলগুলো শুধরে নিন এবং
              সাফল্যের পথে এক ধাপ এগিয়ে থাকুন।
            </p>

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

            {/* Social Proof (Static for now) */}
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

          {/* --- RIGHT SIDE: Hero Image with Dynamic Card --- */}
          <div className="relative mx-auto lg:ml-auto w-full max-w-[500px] lg:max-w-[600px] perspective-1000 animate-in fade-in zoom-in duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full blur-3xl -z-10 opacity-60" />

            <Image
              src="/hero.png"
              alt="Students taking exam illustration"
              width={600}
              height={400}
              className="w-full h-auto rounded-3xl shadow-2xl border transform rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-500"
              priority
            />

            {/* 🔥 DYNAMIC FLOATING CARD FOR RANK 1 🔥 */}
            <div className="absolute -right-6 top-20 p-3 pr-5 bg-background/95 backdrop-blur-xl shadow-2xl border rounded-full animate-bounce duration-[3000ms] hidden md:flex items-center gap-3 min-w-[180px]">
              {/* ১. লোডিং অবস্থা */}
              {loading ? (
                <div className="flex items-center gap-3 w-full">
                  <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                  <div className="space-y-1">
                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-3 w-24 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ) : champion ? (
                /* ২. ডাটা পেলে যা দেখাবে */
                <>
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-yellow-500">
                      <AvatarImage src={champion.image} alt={champion.name} />
                      <AvatarFallback className="font-bold text-primary">
                        {champion.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-1 -right-1 bg-yellow-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-background">
                      #1
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Current Champion
                    </p>
                    <p className="font-bold text-sm text-foreground truncate max-w-[120px]">
                      {champion.name}
                    </p>
                    <p className="text-[10px] font-medium text-primary">
                      {champion.totalPoints} Points
                    </p>
                  </div>
                </>
              ) : (
                /* ৩. ডাটা না থাকলে ডিফল্ট */
                <>
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <Trophy size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase">
                      Rank #1
                    </p>
                    <p className="font-bold text-sm">Be the First!</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

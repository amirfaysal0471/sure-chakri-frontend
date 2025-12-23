"use client";

import { useEffect, useRef, useState } from "react";
import {
  Trophy,
  Target,
  BarChart3,
  Users,
  BookOpen,
  Clock,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- 1. Custom Bento Grid Components ---
const BentoGrid = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-6", // Gap increased for better spacing
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className?: string;
  background: React.ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl", // More rounded
      "bg-background/50 border border-muted-foreground/10 shadow-sm backdrop-blur-sm", // Glassmorphism feel
      "transform-gpu transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-primary/20",
      className
    )}
  >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-2 p-8 transition-all duration-300 group-hover:-translate-y-10">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-foreground tracking-tight">
        {name}
      </h3>
      <p className="max-w-lg text-muted-foreground text-base leading-relaxed">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <Button
        size="sm"
        className="pointer-events-auto font-bold rounded-full px-6 shadow-lg shadow-primary/20"
      >
        {cta}
        <Zap className="ml-2 h-4 w-4" />
      </Button>
    </div>

    {/* Subtle Gradient Overlay */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-gradient-to-b from-transparent via-transparent to-primary/5" />
  </div>
);

// --- 2. Custom Number Ticker ---
const NumberTicker = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let start = 0;
          const end = value;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums tracking-wider">
      {count.toLocaleString()}
    </span>
  );
};

// --- 3. Updated Features Data (Based on Screenshots) ---
const features = [
  {
    Icon: Target,
    name: "Real Exam Simulation",
    description:
      "পরীক্ষার হলের ভীতি কাটান। নেগেটিভ মার্কিং, নির্দিষ্ট সময় এবং কঠোর রুলস মেনে পরীক্ষা দিয়ে নিজেকে আসল যুদ্ধের জন্য প্রস্তুত করুন।",
    href: "/exams",
    cta: "Start Free Exam",
    className: "md:col-span-2",
    background: (
      <div className="absolute right-0 top-0 h-[300px] w-[600px] opacity-10 [mask-image:linear-gradient(to_bottom,white,transparent)]">
        <svg viewBox="0 0 100 100" className="h-full w-full fill-primary/20">
          <gridPattern
            id="grid"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </gridPattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    ),
  },
  {
    Icon: BarChart3,
    name: "Detailed Analytics",
    description:
      "AI-এর মাধ্যমে আপনার দুর্বল টপিকগুলো চিহ্নিত করুন এবং সাবজেক্ট-ভিত্তিক পারফরম্যান্স গ্রাফ দেখুন।",
    href: "/analytics",
    cta: "View Sample Report",
    className: "md:col-span-1",
    background: (
      <div className="absolute absolute right-2 top-4 h-[300px] w-full border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-105">
        <div className="flex items-end gap-2 h-32 w-full px-6 opacity-20">
          <div className="w-4 h-12 bg-primary rounded-t animate-pulse"></div>
          <div className="w-4 h-20 bg-primary rounded-t"></div>
          <div className="w-4 h-16 bg-primary rounded-t animate-pulse delay-75"></div>
          <div className="w-4 h-24 bg-primary rounded-t"></div>
          <div className="w-4 h-32 bg-primary rounded-t animate-pulse delay-150"></div>
        </div>
      </div>
    ),
  },
  {
    Icon: Trophy,
    name: "National Leaderboard",
    description:
      "সারা দেশের হাজারো শিক্ষার্থীর সাথে মেধা তালিকায় নিজের অবস্থান যাচাই করুন এবং নিজেকে সেরা প্রমাণ করুন।",
    href: "/leaderboard",
    cta: "Check Live Ranking",
    className: "md:col-span-1",
    background: (
      <div className="absolute right-0 top-0 h-[200px] w-[200px] bg-gradient-to-bl from-yellow-500/20 to-transparent blur-[60px]" />
    ),
  },
  {
    Icon: BookOpen,
    name: "Exclusive PDF Notes",
    description:
      "বিসিএস ক্যাডার ও অভিজ্ঞ মেন্টরদের তৈরি এক্সক্লুসিভ নোটস ও সাজেশন্স, যা আপনার প্রস্তুতিকে করবে আরও সহজ।",
    href: "/notes",
    cta: "Download Notes",
    className: "md:col-span-2",
    background: (
      <div className="absolute right-0 bottom-0 h-[200px] w-[400px] bg-gradient-to-tr from-blue-500/10 to-transparent blur-[80px]" />
    ),
  },
];

export default function WhyUsSection() {
  return (
    <div className="bg-background relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

      {/* --- SECTION 1: Social Proof & Stats --- */}
      <section className="border-y bg-muted/20 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                <NumberTicker value={150} />
                k+
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Active Students
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
              <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900/20 text-orange-600 mb-2 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                <NumberTicker value={500} />+
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Daily Exams
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 mb-2 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                <NumberTicker value={12} />
                M+
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Questions Solved
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                <NumberTicker value={98} />%
              </h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: Why Choose Us (Bento Grid) --- */}
      <section className="py-24 container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <Badge
            variant="outline"
            className="px-4 py-1.5 text-sm font-semibold border-primary/20 bg-primary/5 text-primary rounded-full animate-in fade-in zoom-in duration-700"
          >
            <ShieldCheck className="w-4 h-4 mr-2" /> Why Choose Us?
          </Badge>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
            প্রস্তুতি যখন{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              স্মার্ট
            </span>
            , <br />
            সাফল্য তখন নিশ্চিত।
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            আমরা গতানুগতিক কোচিং সেন্টার নই। আমরা আপনার ব্যক্তিগত{" "}
            <span className="text-foreground font-semibold">Study Partner</span>
            , যে আপনাকে সবসময় সঠিক ট্র্যাকে রাখবে।
          </p>
        </div>

        {/* The Grid */}
        <BentoGrid>
          {features.map((feature, idx) => (
            <BentoCard key={idx} {...feature} />
          ))}
        </BentoGrid>
      </section>
    </div>
  );
}

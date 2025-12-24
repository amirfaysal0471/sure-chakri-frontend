"use client";

import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Zap,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function ComparisonSection() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="container px-4 mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Why Are We the Best Choice?
          </h2>
          <p className="text-lg text-muted-foreground">
            পুরোনো পদ্ধতির সাথে আধুনিক প্রযুক্তির তুলনা করুন এবং সঠিক সিদ্ধান্ত
            নিন।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          {/* --- Card 1: The "Old Way" (Negative Focus) --- */}
          <Card className="border-2 border-muted bg-slate-100/50 dark:bg-slate-900/50 shadow-none relative overflow-hidden">
            {/* Watermark Icon */}
            <ShieldAlert className="absolute -right-10 -bottom-10 w-40 h-40 text-slate-200 dark:text-slate-800 opacity-50 pointer-events-none" />

            <CardHeader>
              <CardTitle className="text-2xl text-muted-foreground flex items-center gap-2">
                <XCircle className="w-6 h-6" /> গতানুগতিক প্রস্তুতি
              </CardTitle>
              <CardDescription>
                যেভাবে সাধারণত সবাই প্রস্তুতি নেয় (এবং পিছিয়ে পড়ে)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 relative z-10">
              <NegativePoint text="বিক্ষিপ্ত রিসোর্স এবং নোটস" />
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <NegativePoint text="মান্ধাতার আমলের এক্সাম সিস্টেম (OMR)" />
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <NegativePoint text="নিজের দুর্বলতা জানার সুযোগ নেই" />
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <NegativePoint text="কোনো লাইভ র‍্যাঙ্কিং বা তুলনা নেই" />
              <Separator className="bg-slate-200 dark:bg-slate-800" />
              <NegativePoint text="সীমিত সংখ্যক মডেল টেস্ট" />
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground italic">
                ফলাফল: অনিশ্চিত সাফল্য এবং হতাশা।
              </p>
            </CardFooter>
          </Card>

          {/* --- Card 2: The "New Way" (Positive Focus - Highlighted) --- */}
          <Card className="border-2 border-primary/50 bg-white dark:bg-slate-900 shadow-2xl shadow-primary/10 relative overflow-hidden md:scale-105 z-10">
            {/* Highlight Badge */}
            <div className="absolute top-0 right-0">
              <Badge className="rounded-tl-none rounded-br-none px-4 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary">
                <Zap className="w-3 h-3 mr-1 fill-current" /> Recommended
              </Badge>
            </div>
            {/* Watermark Icon */}
            <ShieldCheck className="absolute -right-10 -bottom-10 w-40 h-40 text-primary/5 pointer-events-none" />

            <CardHeader>
              <CardTitle className="text-3xl text-primary flex items-center gap-2">
                <CheckCircle2 className="w-8 h-8 fill-primary/10" /> স্মার্ট
                ইকোসিস্টেম
              </CardTitle>
              <CardDescription className="text-primary/80 font-medium">
                সফলদের পছন্দ এবং আধুনিক প্রযুক্তি
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 relative z-10">
              <PositivePoint text="সবকিছু এক প্ল্যাটফর্মে (All-in-One)" />
              <Separator className="bg-primary/10" />
              <PositivePoint text="রিয়েল-টাইম এক্সাম সিমুলেশন" />
              <Separator className="bg-primary/10" />
              <PositivePoint
                text="AI-বেসড পারফরম্যান্স অ্যানালিটিক্স"
                subtitle="দুর্বলতা চিহ্নিতকরণ সহ"
              />
              <Separator className="bg-primary/10" />
              <PositivePoint text="লাইভ ন্যাশনাল লিডারবোর্ড" />
              <Separator className="bg-primary/10" />
              <PositivePoint text="আনলিমিটেড প্রশ্ন ব্যাংক ও নোটস" />
            </CardContent>
            <CardFooter className="flex flex-col gap-4 relative z-10 bg-primary/5 pt-6 -mx-6 -mb-6 px-6 pb-6 mt-4">
              <p className="text-sm font-medium text-primary text-center">
                ফলাফল: আত্মবিশ্বাসী এবং নিশ্চিত প্রস্তুতি।
              </p>
              <Button className="w-full text-lg h-12 font-bold shadow-lg shadow-primary/20 group">
                স্মার্ট প্রস্তুতি শুরু করুন{" "}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}

// --- Helper Components for clean code ---

// Negative Point Item
function NegativePoint({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 opacity-70">
      <XCircle className="w-5 h-5 text-rose-400 mt-0.5 shrink-0" />
      <span className="text-slate-600 dark:text-slate-400 font-medium">
        {text}
      </span>
    </div>
  );
}

// Positive Point Item
function PositivePoint({
  text,
  subtitle,
}: {
  text: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <CheckCircle2 className="w-6 h-6 text-primary fill-primary/20 mt-0.5 shrink-0" />
      <div>
        <span className="text-slate-900 dark:text-white font-bold text-lg">
          {text}
        </span>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

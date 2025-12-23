"use client";

import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Landmark,
  Train,
  School,
  Shield,
  BookOpen,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Mock Data: Categories ---
const CATEGORIES = [
  {
    id: "bcs",
    title: "BCS Preparation",
    subtitle: "প্রিলিমিনারি ও লিখিত",
    count: "120+ Exams",
    icon: GraduationCap,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    href: "/exams/bcs",
    featured: true,
  },
  {
    id: "bank",
    title: "Bank Jobs",
    subtitle: "সরকারি ও বেসরকারি ব্যাংক",
    count: "85+ Exams",
    icon: Landmark,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/exams/bank",
    featured: true,
  },
  {
    id: "primary",
    title: "Primary & NTRCA",
    subtitle: "শিক্ষক নিবন্ধন প্রস্তুতি",
    count: "200+ Exams",
    icon: School,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    href: "/exams/primary",
    featured: false,
  },
  {
    id: "railway",
    title: "Bangladesh Railway",
    subtitle: "গ্রুপ ডি ও অন্যান্য",
    count: "40+ Exams",
    icon: Train,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
    href: "/exams/railway",
    featured: false,
  },
  {
    id: "defense",
    title: "Defense & NSI",
    subtitle: "সেনাবাহিনী ও গোয়েন্দা সংস্থা",
    count: "35+ Exams",
    icon: Shield,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    href: "/exams/defense",
    featured: false,
  },
  {
    id: "job-solution",
    title: "Recent Job Solution",
    subtitle: "বিগত সালের প্রশ্ন ব্যাংক",
    count: "500+ Sets",
    icon: Briefcase,
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
    href: "/exams/job-solution",
    featured: true,
  },
  {
    id: "admission",
    title: "University Admission",
    subtitle: "ঢাকা বিশ্ববিদ্যালয় ও মেডিক্যাল",
    count: "Live Batch",
    icon: BookOpen,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/20",
    href: "/exams/admission",
    featured: false,
  },
  {
    id: "others",
    title: "Other Govt. Jobs",
    subtitle: "মন্ত্রণালয় ও অধিদপ্তর",
    count: "View All",
    icon: MoreHorizontal,
    color: "text-gray-600",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    href: "/exams/others",
    featured: false,
  },
];

export default function ExamCategories() {
  return (
    <section className="py-20 lg:py-28 bg-muted/20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none">
        <div className="absolute top-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* --- Header Section --- */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            জনপ্রিয় ক্যাটাগরিগুলো <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">
              ঘুরে দেখুন
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            আপনার লক্ষ্যের ওপর ভিত্তি করে প্রস্তুতি নিন। আমাদের এক্সাম লাইব্রেরি
            থেকে আপনার পছন্দের ক্যাটাগরি বেছে নিন।
          </p>
        </div>

        {/* --- Grid Section --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link href={cat.href} key={cat.id} className="group block h-full">
              <Card className="h-full border-muted/40 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-background hover:border-primary/50 relative overflow-hidden">
                {/* Featured Badge */}
                {cat.featured && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                      POPULAR
                    </div>
                  </div>
                )}

                <CardContent className="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${cat.bgColor} ${cat.color} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300`}
                  >
                    <cat.icon className="w-7 h-7" />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1 mb-4 flex-grow">
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Footer / Count */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                    <Badge
                      variant="secondary"
                      className="font-mono text-xs font-medium"
                    >
                      {cat.count}
                    </Badge>
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* --- Bottom CTA --- */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="lg"
            className="rounded-full border-dashed border-2 px-8"
          >
            View All Categories
          </Button>
        </div>
      </div>
    </section>
  );
}

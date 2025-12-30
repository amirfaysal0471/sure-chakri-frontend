"use client";

import { useState } from "react";
import {
  Trophy,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ChevronRight,
  CalendarDays,
  ArrowUpRight,
  Eye,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// --- Mock Data (API ইন্টিগ্রেশনের সময় এটি রিপ্লেস করবেন) ---
const MOCK_RESULTS = [
  {
    id: "1",
    title: "BCS Preliminary Model Test 01",
    examDate: "2025-12-28T10:00:00",
    totalMarks: 100,
    obtainedMarks: 75.5,
    correct: 80,
    wrong: 18,
    skipped: 2,
    negativeMarking: 0.25,
    isPassed: true,
    rank: 120,
  },
  {
    id: "2",
    title: "Primary Assistant Teacher Exam",
    examDate: "2025-12-25T15:30:00",
    totalMarks: 80,
    obtainedMarks: 32,
    correct: 40,
    wrong: 32,
    skipped: 8,
    negativeMarking: 0.25,
    isPassed: false,
    rank: null,
  },
  {
    id: "3",
    title: "Bank Math Special Quiz",
    examDate: "2025-12-20T09:00:00",
    totalMarks: 50,
    obtainedMarks: 48,
    correct: 48,
    wrong: 0,
    skipped: 2,
    negativeMarking: 0.5,
    isPassed: true,
    rank: 5,
  },
];

export default function ResultsPage() {
  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-bold tracking-tight">Results & Stats</h1>
        <p className="text-muted-foreground text-sm">
          Track your performance history.
        </p>
      </div>

      {/* --- Top Stats Overview (Horizontal Scroll on Mobile) --- */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Exams"
          value={MOCK_RESULTS.length}
          icon={Target}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Passed"
          value={MOCK_RESULTS.filter((r) => r.isPassed).length}
          icon={CheckCircle2}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Avg. Score"
          value="68%"
          icon={TrendingUp}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* --- Results List --- */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-1">
          Recent History
        </h3>

        {MOCK_RESULTS.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    </div>
  );
}

// --- Component: Simple Stat Card ---
function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-card">
      <CardContent className="p-3 flex flex-col items-center justify-center text-center gap-2">
        <div className={cn("p-2 rounded-full", bg)}>
          <Icon className={cn("w-4 h-4", color)} />
        </div>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-[10px] text-muted-foreground uppercase font-semibold">
            {label}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Component: Main Result Card ---
function ResultCard({ result }: { result: any }) {
  // Percentage Calculation
  const percentage = Math.round(
    (result.obtainedMarks / result.totalMarks) * 100
  );
  const formattedDate = new Date(result.examDate).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <Card className="overflow-hidden border-none shadow-sm ring-1 ring-border/60 transition-all active:scale-[0.99]">
      {/* Header Section */}
      <CardHeader className="p-4 pb-2 bg-muted/20">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-bold text-base leading-snug line-clamp-1">
              {result.title}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
          </div>

          {/* Rank Badge (If available) */}
          {result.rank && (
            <Badge
              variant="secondary"
              className="bg-background shadow-sm text-[10px] h-6 px-2 gap-1 border"
            >
              <Trophy className="w-3 h-3 text-amber-500" />
              Rank: {result.rank}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-3">
        <div className="flex items-center gap-4">
          {/* Left: Score Circle */}
          <div className="relative flex items-center justify-center size-20 shrink-0">
            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
              {/* Background Circle */}
              <path
                className="text-muted/30"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              {/* Progress Circle */}
              <path
                className={cn(
                  result.isPassed ? "text-green-500" : "text-red-500"
                )}
                strokeDasharray={`${percentage}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className={cn(
                  "text-lg font-bold",
                  result.isPassed ? "text-green-600" : "text-red-600"
                )}
              >
                {result.obtainedMarks}
              </span>
              <span className="text-[10px] text-muted-foreground">
                / {result.totalMarks}
              </span>
            </div>
          </div>

          {/* Right: Detailed Stats Grid */}
          <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-2">
            <StatItem
              icon={CheckCircle2}
              label="Correct"
              value={result.correct}
              color="text-green-600"
            />
            <StatItem
              icon={XCircle}
              label="Wrong"
              value={result.wrong}
              color="text-red-600"
            />
            <StatItem
              icon={MinusCircle}
              label="Skipped"
              value={result.skipped}
              color="text-gray-500"
            />
            <StatItem
              icon={ArrowUpRight}
              label="Accuracy"
              value={`${percentage}%`}
              color="text-blue-600"
            />
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] mb-1.5 font-medium uppercase text-muted-foreground">
            <span>Result Status</span>
            <span
              className={cn(
                result.isPassed ? "text-green-600" : "text-red-600"
              )}
            >
              {result.isPassed ? "PASSED" : "FAILED"}
            </span>
          </div>
          <Progress
            value={percentage}
            className={cn(
              "h-1.5",
              result.isPassed
                ? "bg-green-100 [&>div]:bg-green-500"
                : "bg-red-100 [&>div]:bg-red-500"
            )}
          />
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="p-3 flex gap-3 bg-muted/5">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 h-9 text-xs font-semibold"
        >
          <Share2 className="w-3.5 h-3.5 mr-2" /> Share
        </Button>
        <Button
          size="sm"
          className="flex-1 h-9 text-xs font-bold bg-primary hover:bg-primary/90"
        >
          <Eye className="w-3.5 h-3.5 mr-2" /> View Solution
        </Button>
      </CardFooter>
    </Card>
  );
}

// Helper for Stats Grid
function StatItem({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={cn("w-3.5 h-3.5", color)} />
      <div className="flex flex-col leading-none">
        <span className="text-sm font-bold">{value}</span>
        <span className="text-[9px] text-muted-foreground uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}

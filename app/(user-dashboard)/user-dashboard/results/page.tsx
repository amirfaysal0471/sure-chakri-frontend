"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  MinusCircle,
  CalendarDays,
  ArrowUpRight,
  Eye,
  Share2,
  Loader2,
  AlertCircle,
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
import { useData } from "@/app/hooks/use-data"; // আপনার হুক

// --- Types ---
interface Result {
  _id: string;
  exam: {
    title: string;
    examDate: string;
  };
  totalMarks: number;
  obtainedMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  isPassed: boolean;
  createdAt: string;
}

export default function ResultsPage() {
  const router = useRouter();

  // 1. Data Fetching
  const {
    data: response,
    isLoading,
    error,
  } = useData<{ data: Result[] }>(["user-results"], "/api/results");

  const results = response?.data || [];

  // 2. Calculate Stats Dynamically
  const stats = useMemo(() => {
    if (!results.length) return { total: 0, passed: 0, avgScore: 0 };

    const total = results.length;
    const passed = results.filter((r) => r.isPassed).length;

    const totalPercentage = results.reduce((acc, curr) => {
      const pct = (curr.obtainedMarks / curr.totalMarks) * 100;
      return acc + pct;
    }, 0);

    const avgScore = Math.round(totalPercentage / total);

    return { total, passed, avgScore };
  }, [results]);

  // 3. Loading State
  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Loading your achievements...
        </p>
      </div>
    );
  }

  // 4. Empty State
  if (!isLoading && results.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center flex-col gap-4 text-center px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Target className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold">No Exams Taken Yet</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Participate in model tests to track your progress here.
        </p>
        <Button onClick={() => router.push("/user-dashboard/exams")}>
          Browse Exams
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto animate-in fade-in duration-500">
      {/* --- Page Header --- */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-bold tracking-tight">Results & Stats</h1>
        <p className="text-muted-foreground text-sm">
          Track your performance history.
        </p>
      </div>

      {/* --- Top Stats Overview --- */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Exams"
          value={stats.total}
          icon={Target}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Passed"
          value={stats.passed}
          icon={CheckCircle2}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Avg. Score"
          value={`${stats.avgScore}%`}
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

        {results.map((result) => (
          <ResultCard key={result._id} result={result} />
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
function ResultCard({ result }: { result: Result }) {
  const router = useRouter();

  // Percentage Calculation
  const percentage = Math.round(
    (result.obtainedMarks / result.totalMarks) * 100
  );

  // Date Formatting (Using createdAt or examDate if available in DB)
  const formattedDate = new Date(result.createdAt).toLocaleDateString("en-US", {
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
              {result.exam?.title || "Unknown Exam"}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              {formattedDate}
            </div>
          </div>

          {/* Rank Badge (Optional: If backend provides rank) */}
          {/* <Badge
            variant="secondary"
            className="bg-background shadow-sm text-[10px] h-6 px-2 gap-1 border"
          >
            <Trophy className="w-3 h-3 text-amber-500" />
            Rank: 12
          </Badge> 
          */}
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
              value={result.correctCount}
              color="text-green-600"
            />
            <StatItem
              icon={XCircle}
              label="Wrong"
              value={result.wrongCount}
              color="text-red-600"
            />
            <StatItem
              icon={MinusCircle}
              label="Skipped"
              value={result.skippedCount}
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
          // Share functionality can be added here
        >
          <Share2 className="w-3.5 h-3.5 mr-2" /> Share
        </Button>
        <Button
          size="sm"
          className="flex-1 h-9 text-xs font-bold bg-primary hover:bg-primary/90"
          onClick={() => router.push(`/user-dashboard/results/${result._id}`)}
        >
          <Eye className="w-3.5 h-3.5 mr-2" /> View Details
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

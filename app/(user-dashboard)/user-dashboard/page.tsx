"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Trophy,
  Target,
  Zap,
  PlayCircle,
  CalendarDays,
  ChevronRight,
  BrainCircuit,
  Crown,
  Loader2,
  Clock,
  Lock,
  Eye,
  Timer,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useData } from "@/app/hooks/use-data";
import { useRouter } from "next/navigation";

// --- Types ---
interface Result {
  _id: string;
  exam: { _id: string; title: string; totalMarks: number } | string;
  obtainedMarks: number;
  isPassed: boolean;
  createdAt: string;
}

interface Exam {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  examDate: string;
  isPremium: boolean;
  totalMarks?: number;
}

interface RankResponse {
  rank: number;
  myPoints: number;
}

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;
  const userPlan = user?.plan || "free";

  const router = useRouter();
  const [now, setNow] = useState(new Date());

  // --- 1. Fetch Data ---

  // A. Results
  const { data: resultsData, isLoading: resultsLoading } = useData<{
    data: Result[];
  }>(["dashboard-results"], "/api/results");

  // B. Public Exams
  const { data: examsData, isLoading: examsLoading } = useData<{
    data: Exam[];
  }>(["dashboard-exams"], "/api/exams/public");

  // C. 🔥 Fetch Real Rank (New API)
  const { data: rankData, isLoading: rankLoading } = useData<RankResponse>(
    ["user-rank"],
    "/api/rank"
  );

  // --- 2. Calculate Statistics ---
  const stats = useMemo(() => {
    const results = resultsData?.data || [];
    const totalExams = results.length;

    let totalPercentage = 0;
    results.forEach((r) => {
      const totalMarks =
        typeof r.exam === "object" && r.exam?.totalMarks
          ? r.exam.totalMarks
          : 100;
      totalPercentage += (r.obtainedMarks / totalMarks) * 100;
    });

    const avgAccuracy =
      totalExams > 0 ? Math.round(totalPercentage / totalExams) : 0;

    return {
      totalExams,
      avgAccuracy,
      // 🔥 Real Rank Use Kora Holo
      rank: rankData?.rank ? `#${rankData.rank}` : "--",
    };
  }, [resultsData, rankData]); // Re-calculate when rankData changes

  // --- 3. Hero Card Logic ---
  const featuredExam = useMemo(() => {
    const exams = examsData?.data || [];
    const results = resultsData?.data || [];

    const live = exams.find((exam) => {
      const examDate = new Date(exam.examDate);
      const [startH, startM] = exam.startTime.split(":");
      const [endH, endM] = exam.endTime.split(":");
      const start = new Date(examDate);
      start.setHours(Number(startH), Number(startM));
      const end = new Date(examDate);
      end.setHours(Number(endH), Number(endM));
      return now >= start && now <= end;
    });

    let selectedExam = live ? { type: "LIVE", data: live } : null;

    if (!selectedExam) {
      const upcoming = exams.find((exam) => {
        const examDate = new Date(exam.examDate);
        const [startH, startM] = exam.startTime.split(":");
        const start = new Date(examDate);
        start.setHours(Number(startH), Number(startM));
        return now < start && examDate.toDateString() === now.toDateString();
      });
      if (upcoming) selectedExam = { type: "UPCOMING", data: upcoming };
    }

    if (!selectedExam) return null;

    const examId = selectedExam.data._id;
    const result = results.find((r) => {
      const rExamId = typeof r.exam === "string" ? r.exam : r.exam._id;
      return rExamId === examId;
    });
    const hasParticipated = !!result;
    const isLocked =
      selectedExam.data.isPremium && !["pro", "premium"].includes(userPlan);

    return {
      ...selectedExam,
      hasParticipated,
      resultId: result?._id,
      isLocked,
    };
  }, [examsData, resultsData, now, userPlan]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const recentResults = resultsData?.data.slice(0, 3) || [];
  const isLoading = resultsLoading || examsLoading || rankLoading;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <section className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Hi, {user?.name?.split(" ")[0] || "Student"}!{" "}
            <span className="text-xl">👋</span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Overview of your learning journey.
          </p>
        </div>
      </section>

      {/* --- HERO CARD --- */}
      <section>
        {featuredExam ? (
          <Card
            className={`border-none shadow-lg text-white relative overflow-hidden transition-all ${
              featuredExam.hasParticipated
                ? "bg-gradient-to-r from-emerald-600 to-emerald-700"
                : featuredExam.isLocked
                ? "bg-gradient-to-r from-gray-700 to-gray-800"
                : featuredExam.type === "LIVE"
                ? "bg-gradient-to-r from-red-600 to-red-700"
                : "bg-gradient-to-r from-blue-600 to-blue-700"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <CardContent className="p-6 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 backdrop-blur-md">
                      {featuredExam.hasParticipated
                        ? "✅ COMPLETED"
                        : featuredExam.type === "LIVE"
                        ? "🔴 LIVE NOW"
                        : "🔵 UPCOMING"}
                    </Badge>
                    {featuredExam.data.isPremium && (
                      <Badge className="bg-amber-400/20 text-amber-100 border-amber-400/50">
                        <Crown className="w-3 h-3 mr-1" /> Premium
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold leading-tight">
                    {featuredExam.data.title}
                  </h3>

                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredExam.type === "LIVE"
                      ? `Ends at ${formatTime(featuredExam.data.endTime)}`
                      : `Starts at ${formatTime(featuredExam.data.startTime)}`}
                  </p>
                </div>

                {/* Buttons */}
                {featuredExam.hasParticipated ? (
                  <Button
                    size="lg"
                    onClick={() =>
                      router.push(
                        `/user-dashboard/results/${featuredExam.resultId}`
                      )
                    }
                    className="w-full md:w-auto bg-white text-emerald-700 hover:bg-emerald-50 font-bold border-0"
                  >
                    View Result <Eye className="ml-2 w-5 h-5" />
                  </Button>
                ) : featuredExam.isLocked ? (
                  <Button
                    size="lg"
                    onClick={() => router.push("/pricing")}
                    className="w-full md:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold border-0"
                  >
                    Upgrade to Unlock <Lock className="ml-2 w-4 h-4" />
                  </Button>
                ) : featuredExam.type === "LIVE" ? (
                  <Button
                    size="lg"
                    onClick={() =>
                      router.push(
                        `/user-dashboard/exams/${featuredExam.data._id}`
                      )
                    }
                    className="w-full md:w-auto bg-white text-red-600 hover:bg-red-50 font-bold border-0 animate-pulse"
                  >
                    Join Exam Now <PlayCircle className="ml-2 w-5 h-5" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="w-full md:w-auto bg-white/20 text-white cursor-not-allowed hover:bg-white/20"
                  >
                    Wait for Start <Timer className="ml-2 w-5 h-5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-none shadow-md bg-gray-900 text-white relative overflow-hidden">
            <CardContent className="p-6 relative z-10 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">No Active Exams</h3>
                <p className="text-gray-400 text-sm mt-1">
                  Check routine for future exams.
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={() => router.push("/user-dashboard/routine")}
              >
                View Routine
              </Button>
            </CardContent>
          </Card>
        )}
      </section>

      {/* --- 🔥 STATS GRID (WITH REAL RANK) --- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Exams Taken"
          value={stats.totalExams}
          icon={BookOpen}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          label="Avg. Accuracy"
          value={`${stats.avgAccuracy}%`}
          icon={Target}
          color="text-green-600"
          bg="bg-green-50"
        />
        <StatCard
          label="Global Rank"
          value={stats.rank}
          icon={Trophy}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </section>

      {/* --- Recent & Insights --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-bold">Recent Results</h3>
            <Link
              href="/user-dashboard/results"
              className="text-xs text-primary font-bold hover:underline flex items-center"
            >
              View All <ChevronRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentResults.length > 0 ? (
              recentResults.map((result) => (
                <Card
                  key={result._id}
                  className="border-none shadow-sm hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/user-dashboard/results/${result._id}`)
                  }
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        result.isPassed
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {Math.round(
                        (result.obtainedMarks /
                          (typeof result.exam === "object"
                            ? result.exam.totalMarks || 100
                            : 100)) *
                          100
                      )}
                      %
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">
                        {typeof result.exam === "object"
                          ? result.exam.title
                          : "Unknown"}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <CalendarDays className="w-3 h-3" />{" "}
                        {new Date(result.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={result.isPassed ? "default" : "destructive"}
                        className={
                          result.isPassed
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }
                      >
                        {result.isPassed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 border rounded-xl bg-gray-50 text-muted-foreground text-sm">
                No exams taken yet.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold px-1">AI Insights</h3>
          <Card className="border border-purple-100 bg-gradient-to-b from-purple-50/50 to-white shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <BrainCircuit className="w-4 h-4" /> Performance Analysis
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {stats.avgAccuracy > 70
                    ? "Great job! Keep maintaining consistency."
                    : "Focus more on basic concepts to improve score."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Zap className="w-3.5 h-3.5 mr-2" /> View Report
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white border-none shadow-md">
            <CardContent className="p-5 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold flex items-center gap-2 text-white">
                    <Crown className="w-4 h-4 text-amber-400" /> Go Premium
                  </h4>
                  <Badge
                    variant="secondary"
                    className="bg-white/10 text-white hover:bg-white/20 text-[10px] border-0 uppercase tracking-wide"
                  >
                    {userPlan} Plan
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mt-1 mb-3">
                  Unlock all features.
                </p>
                <Button
                  size="sm"
                  onClick={() => router.push("/pricing")}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold border-0 h-8"
                >
                  Upgrade Plan
                </Button>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helpers
function StatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm bg-card hover:shadow-md transition-all">
      <CardContent className="p-4 flex flex-col items-start gap-3">
        <div className={`p-2.5 rounded-xl ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <span className="text-2xl font-bold block">{value}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

const formatTime = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

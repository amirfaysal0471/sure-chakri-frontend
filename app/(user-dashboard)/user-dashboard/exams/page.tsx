"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  PlayCircle,
  Loader2,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Trophy,
  Crown,
  Eye,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/app/hooks/use-data";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

// --- Types ---

type ExamStatus = "LIVE" | "UPCOMING" | "ENDED";

interface ExamSettings {
  passMarks?: number;
  negativeMarking?: boolean;
  negativeMarkValue?: number;
}

interface Exam {
  _id: string;
  title: string;
  topic: string;
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  totalMarks: number;
  isPremium: boolean;
  settings?: ExamSettings;
}

interface UserResult {
  exam: string | { _id: string };
  _id: string;
}

interface ExamApiResponse {
  data: Exam[];
}

interface ResultsApiResponse {
  data: UserResult[];
}

// =========================================================
// MAIN PAGE COMPONENT
// =========================================================

export default function LiveExamsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [now, setNow] = useState<Date>(new Date());

  // Get User Plan (Default to 'free')
  const userPlan = session?.user?.plan || "free";

  // --- Data Fetching ---
  const { data: examsResponse, isLoading: isLoadingExams } =
    useData<ExamApiResponse>(["live-exams-list"], "/api/exams/public");

  const allExams: Exam[] = examsResponse?.data || [];

  // 🔥 FIX: Cast null as any to bypass TypeScript error on conditional fetching
  const { data: resultsResponse, isLoading: isLoadingResults } =
    useData<ResultsApiResponse>(
      ["user-results-check", session?.user?.id],
      session?.user?.id ? `/api/results` : (null as any)
    );

  const userResults: UserResult[] = resultsResponse?.data || [];

  // Map Results
  const examParticipationMap = useMemo(() => {
    const map = new Map<string, string>();
    userResults.forEach((result) => {
      const examId =
        typeof result.exam === "string" ? result.exam : result.exam._id;
      map.set(examId, result._id);
    });
    return map;
  }, [userResults]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(timer);
  }, []);

  // Status Helper
  const getExamStatus = useCallback(
    (exam: Exam): ExamStatus => {
      try {
        const examDate = new Date(exam.examDate);
        const [startH, startM] = exam.startTime.split(":");
        const startDateTime = new Date(examDate);
        startDateTime.setHours(Number(startH), Number(startM), 0);

        const [endH, endM] = exam.endTime.split(":");
        const endDateTime = new Date(examDate);
        endDateTime.setHours(Number(endH), Number(endM), 0);

        if (now > endDateTime) return "ENDED";
        if (now >= startDateTime && now <= endDateTime) return "LIVE";
        return "UPCOMING";
      } catch {
        return "UPCOMING";
      }
    },
    [now]
  );

  // Filter & Sort
  const sortedExams = useMemo(() => {
    const todaysExams = allExams.filter((exam) => {
      const examDate = new Date(exam.examDate);
      return examDate.toDateString() === now.toDateString();
    });

    return todaysExams.sort((a, b) => {
      const statusA = getExamStatus(a);
      const statusB = getExamStatus(b);
      if (statusA === "LIVE" && statusB !== "LIVE") return -1;
      if (statusB === "LIVE" && statusA !== "LIVE") return 1;
      if (statusA === "UPCOMING" && statusB === "ENDED") return -1;
      if (statusA === "ENDED" && statusB === "UPCOMING") return 1;
      return 0;
    });
  }, [allExams, now, getExamStatus]);

  if (isLoadingExams || (session?.user?.id && isLoadingResults)) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Checking Schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24">
      {/* Header */}
      <div className="sticky top-16 z-30 border-b bg-background/95 py-3 backdrop-blur md:top-0 md:border-none">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
              Exam Center
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Today&apos;s Schedule
            </p>
          </div>
          <div className="rounded-lg border bg-muted/50 px-3 py-1.5 text-right">
            <div className="text-xs font-bold text-foreground">
              {now.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-2.5 w-2.5" />
              {now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4">
        {sortedExams.length > 0 ? (
          sortedExams.map((exam) => {
            const resultId = examParticipationMap.get(exam._id);
            return (
              <MobileExamCard
                key={exam._id}
                exam={exam}
                status={getExamStatus(exam)}
                hasParticipated={!!resultId}
                resultId={resultId}
                userPlan={userPlan}
                onStart={() => router.push(`/user-dashboard/exams/${exam._id}`)}
                onViewResult={() =>
                  router.push(`/user-dashboard/results/${resultId}`)
                }
                onUpgrade={() => router.push(`/pricing`)}
              />
            );
          })
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

// =========================================================
// MOBILE EXAM CARD (With Premium Logic)
// =========================================================

interface MobileExamCardProps {
  exam: Exam;
  status: ExamStatus;
  hasParticipated: boolean;
  resultId?: string;
  userPlan: string;
  onStart: () => void;
  onViewResult: () => void;
  onUpgrade: () => void;
}

function MobileExamCard({
  exam,
  status,
  hasParticipated,
  resultId,
  userPlan,
  onStart,
  onViewResult,
  onUpgrade,
}: MobileExamCardProps) {
  const isLive = status === "LIVE";
  const isEnded = status === "ENDED";

  // PREMIUM LOGIC
  const hasValidPlan = ["pro", "premium"].includes(userPlan);
  const isLocked = exam.isPremium && !hasValidPlan;

  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", ".");
  };

  const handleWait = () => {
    toast.info(`Wait! Exam starts at ${formatTime(exam.startTime)}`);
  };

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-sm transition-all active:scale-[0.99]",
        isLive && !hasParticipated && !isLocked
          ? "bg-red-50/50 ring-2 ring-red-500 dark:bg-red-900/10"
          : hasParticipated
          ? "bg-green-50/30 ring-1 ring-green-200"
          : isLocked
          ? "bg-gray-50 ring-1 ring-gray-200 opacity-90"
          : "bg-card ring-1 ring-border/50"
      )}
    >
      {/* Indicators */}
      {isLive && !hasParticipated && !isLocked && (
        <div className="absolute left-0 right-0 top-0 z-10 h-1 animate-pulse bg-red-500" />
      )}
      {hasParticipated && (
        <div className="absolute left-0 right-0 top-0 z-10 h-1 bg-green-500" />
      )}

      <CardContent className="flex flex-col gap-3 p-4">
        {/* Top Row */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="h-5 max-w-[150px] truncate border-border bg-background/50 px-2 text-[10px] font-normal text-muted-foreground"
            >
              {exam.topic}
            </Badge>

            {exam.isPremium ? (
              <Badge className="h-5 gap-1 border-amber-200 bg-amber-100 px-2 text-[10px] text-amber-700 hover:bg-amber-100">
                <Crown className="h-3 w-3 fill-amber-700" /> Premium
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="h-5 border-green-200 bg-green-100 px-2 text-[10px] text-green-700 hover:bg-green-100"
              >
                Free
              </Badge>
            )}
          </div>

          {/* Status Badge */}
          {hasParticipated ? (
            <Badge className="h-5 bg-green-600 px-2 text-[10px] hover:bg-green-700">
              Done
            </Badge>
          ) : isLive ? (
            <Badge className="h-5 animate-pulse bg-red-600 px-2 text-[10px] hover:bg-red-700">
              LIVE
            </Badge>
          ) : isEnded ? (
            <Badge variant="secondary" className="h-5 text-[10px]">
              Ended
            </Badge>
          ) : (
            <Badge className="h-5 bg-blue-600 px-2 text-[10px] hover:bg-blue-700">
              Upcoming
            </Badge>
          )}
        </div>

        {/* Title */}
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {isLocked && <Lock className="w-4 h-4 text-gray-400" />}{" "}
            <h3 className="line-clamp-2 text-lg font-bold leading-snug">
              {exam.title}
            </h3>
          </div>
          <div
            className={cn(
              "flex items-center gap-1.5 text-sm font-bold",
              isLive && !hasParticipated && !isLocked
                ? "text-red-600"
                : "text-foreground"
            )}
          >
            <Clock className="h-3.5 w-3.5" />
            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
          </div>
        </div>

        {/* Details Grid */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/30 p-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-blue-500" />{" "}
            <span className="font-medium">{exam.duration}m Duration</span>
          </div>
          <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/30 p-1.5 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5 text-purple-500" />{" "}
            <span className="font-medium">{exam.totalMarks} Marks</span>
          </div>
          {exam.settings?.passMarks && (
            <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/30 p-1.5 text-xs text-muted-foreground">
              <Trophy className="h-3.5 w-3.5 text-amber-500" />{" "}
              <span className="font-medium">
                Pass: {exam.settings.passMarks}%
              </span>
            </div>
          )}
          {exam.settings?.negativeMarking && (
            <div className="flex items-center gap-1.5 rounded border border-red-100 bg-red-50 p-1.5 text-xs text-red-600">
              <AlertTriangle className="h-3.5 w-3.5" />{" "}
              <span className="font-bold">
                -{exam.settings.negativeMarkValue} Negative
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Logic */}
        <div className="mt-2 border-t border-dashed pt-3">
          {
            // Case 1: Exam is Locked (Premium & User is Free)
            isLocked ? (
              <Button
                size="sm"
                className="h-10 w-full rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm"
                onClick={onUpgrade}
              >
                <Lock className="mr-2 h-4 w-4" /> Upgrade to Unlock
              </Button>
            ) : // Case 2: Already Participated
            hasParticipated ? (
              <Button
                size="sm"
                variant="outline"
                className="h-10 w-full rounded-lg border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800"
                onClick={onViewResult}
              >
                <Eye className="mr-2 h-4 w-4" /> View Result
              </Button>
            ) : // Case 3: Live Exam (Accessible)
            isLive ? (
              <Button
                size="sm"
                className="h-10 w-full animate-in fade-in zoom-in rounded-lg bg-red-600 px-5 text-sm font-bold shadow-md shadow-red-200 hover:bg-red-700 dark:shadow-none"
                onClick={onStart}
              >
                Start Exam{" "}
                <PlayCircle className="ml-2 h-4 w-4 fill-white text-red-600" />
              </Button>
            ) : // Case 4: Ended Exam
            isEnded ? (
              <Button
                size="sm"
                variant="ghost"
                className="h-9 w-full text-xs text-muted-foreground"
                disabled
              >
                Exam Time Over
              </Button>
            ) : (
              // Case 5: Upcoming Exam
              <Button
                size="sm"
                variant="secondary"
                className="h-9 w-full rounded-lg border border-blue-100 bg-blue-50 px-4 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                onClick={handleWait}
              >
                Wait for Start
              </Button>
            )
          }
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================
// EMPTY STATE
// =========================================================

function EmptyState() {
  const router = useRouter();
  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-muted/5 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-background p-4 shadow-sm ring-1 ring-border">
        <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <h3 className="text-lg font-bold text-foreground">All Clear!</h3>
      <p className="mt-2 max-w-[250px] text-sm leading-relaxed text-muted-foreground">
        No exams scheduled for today. Take a break or prepare for upcoming
        tests.
      </p>
      <Button
        variant="outline"
        className="mt-6 w-full max-w-xs rounded-xl"
        onClick={() => router.push("/user-dashboard/routine")}
      >
        <Calendar className="mr-2 h-4 w-4" /> View Routine
      </Button>
    </div>
  );
}

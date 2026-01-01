"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  FileText,
  PlayCircle,
  Timer,
  Loader2,
  Trophy,
  AlertTriangle,
  Crown,
  CalendarDays,
  History,
  CheckCircle2,
  Eye,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useData } from "@/app/hooks/use-data";
import { useSession } from "next-auth/react";

// --- Types ---

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
  syllabus?: string;
  settings?: ExamSettings;
}

interface ExamApiResponse {
  success: boolean;
  data: Exam[];
  hasMore: boolean;
  page: number;
}

interface UserResult {
  exam: string | { _id: string };
  _id: string;
}

interface ResultsApiResponse {
  data: UserResult[];
}

type ExamStatus = "LIVE" | "UPCOMING" | "ENDED";
type TabType = "upcoming" | "archive";

// =========================================================
// 1. MAIN PAGE COMPONENT
// =========================================================

export default function RoutinePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-bold tracking-tight">My Routine</h1>
        <p className="text-sm text-muted-foreground">
          Your exam timeline & history.
        </p>
      </div>

      {/* Tabs System */}
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="sticky top-[64px] z-30 bg-background/95 py-2 backdrop-blur">
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-muted/60 p-1">
            <TabsTrigger
              value="upcoming"
              className="rounded-lg text-xs font-bold data-[state=active]:shadow-sm"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="rounded-lg text-xs font-bold data-[state=active]:shadow-sm"
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Isolated Components for State Management */}
        <div className="mt-4 min-h-[300px]">
          <TabsContent value="upcoming" className="mt-0">
            <ExamListView type="upcoming" />
          </TabsContent>

          <TabsContent value="archive" className="mt-0">
            <ExamListView type="archive" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// =========================================================
// 2. EXAM LIST VIEW (🔥 FIXED LOGIC)
// =========================================================

function ExamListView({ type }: { type: TabType }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [now, setNow] = useState<Date>(new Date());

  const userPlan = session?.user?.plan || "free";

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const { data: responseData, isLoading } = useData<ExamApiResponse>(
    [`routine`, type, page],
    `/api/exams/public?page=${page}&limit=10&type=${type}`
  );

  const { data: resultsResponse } = useData<ResultsApiResponse>(
    ["user-results-check-routine", session?.user?.id],
    session?.user?.id ? `/api/results` : (null as any)
  );

  const userResults = resultsResponse?.data || [];

  const examParticipationMap = useMemo(() => {
    const map = new Map<string, string>();
    userResults.forEach((result) => {
      const examId =
        typeof result.exam === "string" ? result.exam : result.exam._id;
      map.set(examId, result._id);
    });
    return map;
  }, [userResults]);

  useEffect(() => {
    if (responseData?.data) {
      if (page === 1) {
        setExams(responseData.data);
      } else {
        setExams((prev) => {
          const newIds = new Set(responseData.data.map((e) => e._id));
          const filteredPrev = prev.filter((e) => !newIds.has(e._id));
          return [...filteredPrev, ...responseData.data];
        });
      }
      setHasMore(responseData.hasMore);
    }
  }, [responseData, page]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastExamRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const getStatus = useCallback(
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

  // --- Section Grouping Logic ---
  const groupedExams = useMemo(() => {
    const filtered = exams.filter((exam) => {
      const status = getStatus(exam);
      return type === "upcoming"
        ? status === "UPCOMING" || status === "LIVE"
        : status === "ENDED";
    });

    const groups = filtered.reduce((acc, exam) => {
      const dateKey = new Date(exam.examDate).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(exam);
      return acc;
    }, {} as Record<string, Exam[]>);

    const sortedDateKeys = Object.keys(groups).sort((a, b) => {
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return type === "archive" ? dateB - dateA : dateA - dateB;
    });

    return sortedDateKeys.map((dateKey) => ({
      dateLabel: dateKey,
      items: groups[dateKey],
    }));
  }, [exams, type, getStatus]);

  const getSectionTitle = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "long",
    });
  };

  // 🔥 FIX: Check groupedExams length instead of raw exams length
  // This ensures Empty State shows if filtering removed all items
  const showEmptyState = !isLoading && groupedExams.length === 0;

  if (showEmptyState) {
    return <EmptyState type={type} />;
  }

  return (
    <div className="space-y-8 duration-300 animate-in fade-in zoom-in">
      {groupedExams.map((group) => (
        <div key={group.dateLabel} className="space-y-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-bold shadow-sm",
                getSectionTitle(group.dateLabel) === "Today"
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground"
              )}
            >
              {getSectionTitle(group.dateLabel)}
            </div>
            <div className="h-[1px] flex-1 bg-border" />
          </div>

          <div className="grid gap-4">
            {group.items.map((exam) => {
              const resultId = examParticipationMap.get(exam._id);
              return (
                <AppExamCard
                  key={exam._id}
                  exam={exam}
                  router={router}
                  status={getStatus(exam)}
                  hasParticipated={!!resultId}
                  resultId={resultId}
                  userPlan={userPlan}
                />
              );
            })}
          </div>
        </div>
      ))}

      <div ref={lastExamRef} className="flex min-h-[40px] justify-center py-6">
        {isLoading && (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        )}
      </div>
    </div>
  );
}

// =========================================================
// 3. EXAM CARD COMPONENT
// =========================================================

function AppExamCard({
  exam,
  router,
  status,
  hasParticipated,
  resultId,
  userPlan,
}: {
  exam: Exam;
  router: ReturnType<typeof useRouter>;
  status: ExamStatus;
  hasParticipated: boolean;
  resultId?: string;
  userPlan: string;
}) {
  const isLive = status === "LIVE";
  const isEnded = status === "ENDED";

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

  const handleStart = () => router.push(`/user-dashboard/exams/${exam._id}`);
  const handleViewResult = () =>
    router.push(`/user-dashboard/results/${resultId}`);
  const handleWait = () =>
    toast.info(`Exam starts at ${formatTime(exam.startTime)}`);
  const handleUpgrade = () => router.push("/pricing");

  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-sm transition-all active:scale-[0.99]",
        isLive && !hasParticipated && !isLocked
          ? "bg-red-50/50 ring-1 ring-red-200 dark:bg-red-900/10"
          : hasParticipated
          ? "bg-green-50/30 ring-1 ring-green-200"
          : isLocked
          ? "bg-gray-50 ring-1 ring-gray-200 opacity-90"
          : "bg-card ring-1 ring-border/50"
      )}
    >
      <div
        className={cn(
          "absolute bottom-0 left-0 top-0 w-1",
          hasParticipated
            ? "bg-green-500"
            : isLive && !isLocked
            ? "bg-red-500"
            : isEnded
            ? "bg-muted-foreground/30"
            : "bg-blue-500"
        )}
      />

      <CardContent className="flex flex-col gap-3 p-4 pl-5">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="h-5 max-w-[120px] truncate border-border bg-background/50 px-2 text-[10px] font-normal text-muted-foreground"
            >
              {exam.topic}
            </Badge>
            {exam.isPremium ? (
              <Badge className="h-5 gap-1 border-amber-200 bg-amber-100 px-2 text-[10px] text-amber-700">
                <Crown className="h-3 w-3" /> Premium
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="h-5 border-green-200 bg-green-100 px-2 text-[10px] text-green-700"
              >
                Free
              </Badge>
            )}
          </div>

          {hasParticipated ? (
            <Badge className="h-5 bg-green-600 px-2 text-[10px]">Done</Badge>
          ) : isLive ? (
            <Badge className="h-5 animate-pulse bg-red-600 px-2 text-[10px]">
              LIVE NOW
            </Badge>
          ) : isEnded ? (
            <Badge variant="secondary" className="h-5 px-2 text-[10px]">
              Ended
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="h-5 border-blue-200 px-2 text-[10px] text-blue-600"
            >
              Upcoming
            </Badge>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            {isLocked && <Lock className="w-4 h-4 text-gray-400" />}
            <h3 className="line-clamp-2 text-base font-bold leading-snug">
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

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/40 p-1.5 text-[11px] text-muted-foreground">
            <Timer className="h-3 w-3 text-blue-500" />{" "}
            <span className="font-medium">{exam.duration}m Time</span>
          </div>
          <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/40 p-1.5 text-[11px] text-muted-foreground">
            <Trophy className="h-3 w-3 text-amber-500" />{" "}
            <span className="font-medium">{exam.totalMarks} Marks</span>
          </div>
          {exam.settings?.passMarks && (
            <div className="flex items-center gap-1.5 rounded border border-dashed bg-muted/40 p-1.5 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 text-green-600" /> Pass:{" "}
              {exam.settings.passMarks}%
            </div>
          )}
          {exam.settings?.negativeMarking && (
            <div className="flex items-center gap-1.5 rounded border border-red-100 bg-red-50/50 p-1.5 text-[11px] text-red-600">
              <AlertTriangle className="h-3 w-3" /> -
              {exam.settings.negativeMarkValue} Neg.
            </div>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between border-t border-dashed pt-3">
          {exam.syllabus ? (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary">
                  <FileText className="h-3.5 w-3.5" /> Syllabus
                </button>
              </DialogTrigger>
              <DialogContent className="w-[90%] rounded-xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Exam Syllabus</DialogTitle>
                  <DialogDescription>
                    Overview for {exam.title}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="mt-2 max-h-[50vh] pr-2">
                  <div className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                    {exam.syllabus}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-xs italic text-muted-foreground/50">
              No syllabus
            </span>
          )}

          <div>
            {(() => {
              if (isLocked)
                return (
                  <Button
                    size="sm"
                    className="h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white px-3 text-xs font-bold"
                    onClick={handleUpgrade}
                  >
                    <Lock className="mr-1 h-3 w-3" /> Unlock
                  </Button>
                );

              if (hasParticipated)
                return (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 rounded-full border-green-200 bg-green-50 px-3 text-xs font-bold text-green-700 hover:bg-green-100"
                    onClick={handleViewResult}
                  >
                    View Result <Eye className="ml-1 h-3 w-3" />
                  </Button>
                );

              if (isLive)
                return (
                  <Button
                    size="sm"
                    className="h-8 rounded-full bg-red-600 px-4 text-xs font-bold shadow-md hover:bg-red-700"
                    onClick={handleStart}
                  >
                    Start <PlayCircle className="ml-1 h-3 w-3" />
                  </Button>
                );

              if (isEnded)
                return (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 cursor-not-allowed px-3 text-xs text-muted-foreground"
                    disabled
                  >
                    Finished
                  </Button>
                );

              return (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 rounded-full bg-blue-50 px-4 text-xs font-semibold text-blue-700"
                  onClick={handleWait}
                >
                  Wait <Timer className="ml-1 h-3 w-3" />
                </Button>
              );
            })()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================
// 4. EMPTY STATE (UPDATED MESSAGE)
// =========================================================

function EmptyState({ type }: { type: TabType }) {
  const isUpcoming = type === "upcoming";
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-muted/5 px-4 py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        {isUpcoming ? (
          <CalendarDays className="h-8 w-8 text-muted-foreground" />
        ) : (
          <History className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-bold">
        {isUpcoming ? "There is no exam right now" : "No history found"}
      </h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
        {isUpcoming
          ? "Check back later for new schedules."
          : "You haven't taken any exams yet."}
      </p>
    </div>
  );
}

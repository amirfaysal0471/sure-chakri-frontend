"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  BookOpen,
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

// --- Types ---
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
  settings?: any;
}

export default function RoutinePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [now, setNow] = useState<Date>(new Date());

  // --- States for Infinite Scroll ---
  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // --- Real-time Clock (Every 30s) ---
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000); // 30s interval
    return () => clearInterval(timer);
  }, []);

  // Observer Ref
  const observer = useRef<IntersectionObserver | null>(null);
  const lastExamRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // --- Fetch Data Function ---
  const fetchExams = async (
    pageNum: number,
    type: string,
    isNewTab = false
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/exams/public?page=${pageNum}&limit=10&type=${type}`
      );
      const data = await res.json();

      if (data.success) {
        setExams((prev) => (isNewTab ? data.data : [...prev, ...data.data]));
        setHasMore(data.hasMore);
      }
    } catch (error) {
      console.error("Failed to load exams");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExams(page, activeTab);
  }, [page]);

  useEffect(() => {
    setExams([]);
    setPage(1);
    setHasMore(true);
    fetchExams(1, activeTab, true);
  }, [activeTab]);

  // --- 🔥 Strict Status Helper ---
  const getStatus = useCallback(
    (exam: Exam) => {
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
      } catch (e) {
        return "UPCOMING";
      }
    },
    [now]
  );

  // --- 🔥 Filter & Grouping Logic ---
  const groupedExams = useMemo(() => {
    // ১. প্রথমে বর্তমান সময়ের উপর ভিত্তি করে ফিল্টার করা হচ্ছে
    const filteredList = exams.filter((exam) => {
      const status = getStatus(exam);
      if (activeTab === "upcoming") {
        // Upcoming ট্যাবে শুধুমাত্র Upcoming বা Live এক্সাম থাকবে
        return status === "UPCOMING" || status === "LIVE";
      } else {
        // Archive ট্যাবে শুধুমাত্র Ended এক্সাম থাকবে
        return status === "ENDED";
      }
    });

    // ২. ডেট অনুযায়ী গ্রুপ করা
    const groups: { [key: string]: Exam[] } = {};
    filteredList.forEach((exam) => {
      const dateKey = new Date(exam.examDate).toISOString().split("T")[0];
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(exam);
    });

    // ৩. সর্টিং (Upcoming -> Ascending, Archive -> Descending)
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      return activeTab === "archive"
        ? new Date(b).getTime() - new Date(a).getTime()
        : new Date(a).getTime() - new Date(b).getTime();
    });

    return sortedKeys.map((dateKey) => ({
      date: dateKey,
      exams: groups[dateKey],
    }));
  }, [exams, activeTab, getStatus]);

  return (
    <div className="space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-2xl font-bold tracking-tight">My Routine</h1>
        <p className="text-muted-foreground text-sm">
          Your exam timeline & history.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Sticky Tabs */}
        <div className="sticky top-[64px] z-30 bg-background/95 backdrop-blur py-2">
          <TabsList className="grid w-full grid-cols-2 h-11 rounded-xl bg-muted/60 p-1">
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

        {/* Content Area */}
        <div className="mt-4 space-y-6">
          {groupedExams.length > 0
            ? groupedExams.map((group) => (
                <ExamGroupSection
                  key={group.date}
                  date={group.date}
                  exams={group.exams}
                  router={router}
                  getStatus={getStatus}
                />
              ))
            : !isLoading && <EmptyState type={activeTab} />}

          {/* Loading Indicator */}
          <div
            ref={lastExamRef}
            className="flex justify-center py-4 min-h-[50px]"
          >
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
              </div>
            )}
          </div>
        </div>
      </Tabs>
    </div>
  );
}

// --- Component: Date Group Section ---
function ExamGroupSection({ date, exams, router, getStatus }: any) {
  const formatDateHeader = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

    return d.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 px-1">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background">
          {formatDateHeader(date)}
        </h3>
        <div className="h-[1px] bg-border flex-1" />
      </div>

      <div className="grid gap-4">
        {exams.map((exam: Exam) => (
          <AppExamCard
            key={exam._id}
            exam={exam}
            router={router}
            status={getStatus(exam)}
          />
        ))}
      </div>
    </div>
  );
}

// --- Component: App Style Exam Card ---
function AppExamCard({
  exam,
  router,
  status,
}: {
  exam: Exam;
  router: any;
  status: string;
}) {
  const isLive = status === "LIVE";
  const isEnded = status === "ENDED";

  // Format Time: 1.00 PM
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(Number(h));
    d.setMinutes(Number(m));
    return d
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .replace(":", ".");
  };

  return (
    <Card
      className={cn(
        "border-none shadow-sm relative overflow-hidden transition-all active:scale-[0.99]",
        isLive
          ? "bg-red-50/50 dark:bg-red-900/10 ring-1 ring-red-200"
          : "bg-card ring-1 ring-border/50"
      )}
    >
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1",
          isLive
            ? "bg-red-500"
            : isEnded
            ? "bg-muted-foreground/30"
            : "bg-blue-500"
        )}
      />

      <CardContent className="p-4 pl-5 flex flex-col gap-3">
        {/* Top: Tags */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-background/50 text-[10px] h-5 px-2 font-normal text-muted-foreground truncate max-w-[120px]"
            >
              {exam.topic}
            </Badge>
            {exam.isPremium ? (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] h-5 px-2 gap-1">
                <Crown className="w-3 h-3 fill-amber-700" /> Premium
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 text-[10px] h-5 px-2"
              >
                Free
              </Badge>
            )}
          </div>

          {/* Status Badge */}
          {isLive ? (
            <Badge className="bg-red-600 animate-pulse px-2 h-5 text-[10px]">
              LIVE NOW
            </Badge>
          ) : isEnded ? (
            <Badge variant="secondary" className="px-2 h-5 text-[10px]">
              Ended
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="border-blue-200 text-blue-600 bg-blue-50 px-2 h-5 text-[10px]"
            >
              Upcoming
            </Badge>
          )}
        </div>

        {/* Title & Time */}
        <div>
          <h3 className="font-bold text-base leading-snug line-clamp-2 mb-1">
            {exam.title}
          </h3>
          <div
            className={cn(
              "text-sm font-bold flex items-center gap-1.5",
              isLive ? "text-red-600" : "text-foreground"
            )}
          >
            <Clock className="w-3.5 h-3.5" />
            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded border border-dashed">
            <Timer className="w-3 h-3 text-blue-500" />{" "}
            <span className="font-medium">{exam.duration}m Time</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded border border-dashed">
            <Trophy className="w-3 h-3 text-amber-500" />{" "}
            <span className="font-medium">{exam.totalMarks} Marks</span>
          </div>
          {exam.settings?.passMarks && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 p-1.5 rounded border border-dashed">
              <CheckCircle2 className="w-3 h-3 text-green-600" /> Pass:{" "}
              {exam.settings.passMarks}%
            </div>
          )}
          {exam.settings?.negativeMarking && (
            <div className="flex items-center gap-1.5 text-[11px] text-red-600 bg-red-50/50 p-1.5 rounded border border-red-100">
              <AlertTriangle className="w-3 h-3" /> -
              {exam.settings.negativeMarkValue} Neg.
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-dashed">
          {/* Syllabus */}
          {exam.syllabus ? (
            <Dialog>
              <DialogTrigger asChild>
                <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1">
                  <FileText className="w-3.5 h-3.5" /> Syllabus
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md w-[90%] rounded-xl">
                <DialogHeader>
                  <DialogTitle>Exam Syllabus</DialogTitle>
                  <DialogDescription>
                    Overview for {exam.title}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[50vh] mt-2 pr-2">
                  <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/50 p-3 rounded-lg">
                    {exam.syllabus}
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          ) : (
            <span className="text-xs text-muted-foreground/50 italic">
              No syllabus
            </span>
          )}

          {/* Action Button */}
          <div>
            {isLive ? (
              <Button
                size="sm"
                className="h-8 bg-red-600 hover:bg-red-700 font-bold px-4 text-xs rounded-full shadow-md"
                onClick={() => router.push(`/user-dashboard/exams/${exam._id}`)}
              >
                Start <PlayCircle className="w-3 h-3 ml-1" />
              </Button>
            ) : isEnded ? (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-3 text-xs text-muted-foreground cursor-not-allowed"
                disabled
              >
                Finished
              </Button>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 px-4 text-xs rounded-full font-semibold text-blue-700 bg-blue-50"
                onClick={() =>
                  toast.info(`Exam starts at ${formatTime(exam.startTime)}`)
                }
              >
                Wait <Timer className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// --- Empty State ---
function EmptyState({ type }: { type: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-xl bg-muted/5">
      <div className="p-4 bg-muted rounded-full mb-4">
        {type === "upcoming" ? (
          <CalendarDays className="w-8 h-8 text-muted-foreground" />
        ) : (
          <History className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="font-bold text-lg">
        Empty {type === "upcoming" ? "Schedule" : "History"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs leading-relaxed">
        {type === "upcoming"
          ? "You're all caught up! No upcoming exams found."
          : "You haven't participated in any exams yet."}
      </p>
    </div>
  );
}

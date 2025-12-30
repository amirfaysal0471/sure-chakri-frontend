"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Clock,
  PlayCircle,
  Timer,
  Loader2,
  BookOpen,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Trophy,
  ShieldCheck,
  Crown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/app/hooks/use-data";
import { cn } from "@/lib/utils";

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
  settings?: ExamSettings;
}

export default function LiveExamsPage() {
  const router = useRouter();
  const [now, setNow] = useState<Date>(new Date());

  // --- Data Fetching ---
  const { data: responseData, isLoading } = useData<any>(
    ["live-exams-list"],
    "/api/exams/public"
  );

  const allExams: Exam[] = responseData?.data || [];

  // --- Real-time Clock ---
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 10000);
    return () => clearInterval(timer);
  }, []);

  // --- Filter Logic (Strictly Today) ---
  const todaysExams = useMemo(() => {
    return allExams.filter((exam) => {
      const examDate = new Date(exam.examDate);
      return (
        examDate.getDate() === now.getDate() &&
        examDate.getMonth() === now.getMonth() &&
        examDate.getFullYear() === now.getFullYear()
      );
    });
  }, [allExams, now]);

  // --- Dynamic Status Helper ---
  const getExamStatus = (exam: Exam) => {
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
    } catch (error) {
      return "UPCOMING";
    }
  };

  // Sort: LIVE -> UPCOMING -> ENDED
  const sortedExams = [...todaysExams].sort((a, b) => {
    const statusA = getExamStatus(a);
    const statusB = getExamStatus(b);
    if (statusA === "LIVE") return -1;
    if (statusB === "LIVE") return 1;
    if (statusA === "UPCOMING" && statusB === "ENDED") return -1;
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Checking Schedule...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-24 max-w-3xl mx-auto">
      {/* --- App Header (Sticky) --- */}
      <div className="sticky top-16 md:top-0 z-30 bg-background/95 backdrop-blur py-3 border-b md:border-none">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Exam Center
            </h1>
            <p className="text-xs text-muted-foreground font-medium">
              Today's Schedule
            </p>
          </div>

          {/* Date Widget */}
          <div className="bg-muted/50 px-3 py-1.5 rounded-lg border text-right">
            <div className="text-xs font-bold text-foreground">
              {now.toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1">
              <Clock className="w-2.5 h-2.5" />
              {now.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- Exam List --- */}
      <div className="grid gap-4">
        {sortedExams.length > 0 ? (
          sortedExams.map((exam) => (
            <MobileExamCard
              key={exam._id}
              exam={exam}
              status={getExamStatus(exam)}
              onStart={() => router.push(`/user-dashboard/exams/${exam._id}`)}
            />
          ))
        ) : (
          <EmptyState router={router} />
        )}
      </div>
    </div>
  );
}

// --- Component: Mobile App Style Card ---
function MobileExamCard({
  exam,
  status,
  onStart,
}: {
  exam: Exam;
  status: string;
  onStart: () => void;
}) {
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

  const isLive = status === "LIVE";
  const isEnded = status === "ENDED";

  return (
    <Card
      className={cn(
        "border-none shadow-sm relative overflow-hidden transition-all active:scale-[0.99]",
        isLive
          ? "bg-red-50/50 dark:bg-red-900/10 ring-2 ring-red-500"
          : "bg-card ring-1 ring-border/50"
      )}
    >
      {/* Live Indicator Strip */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500 animate-pulse z-10" />
      )}

      <CardContent className="p-4 flex flex-col gap-3">
        {/* Top Row: Tags & Premium Status */}
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-background/50 text-[10px] h-5 px-2 font-normal text-muted-foreground border-border truncate max-w-[150px]"
            >
              {exam.topic}
            </Badge>

            {/* Premium / Free Badge */}
            {exam.isPremium ? (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100 text-[10px] h-5 px-2 gap-1">
                <Crown className="w-3 h-3 fill-amber-700" /> Premium
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-[10px] h-5 px-2"
              >
                Free
              </Badge>
            )}
          </div>

          {/* Status Badge */}
          {isLive ? (
            <Badge className="bg-red-600 hover:bg-red-700 animate-pulse text-[10px] px-2 h-5">
              LIVE
            </Badge>
          ) : isEnded ? (
            <Badge variant="secondary" className="text-[10px] h-5">
              Ended
            </Badge>
          ) : (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] px-2 h-5">
              Upcoming
            </Badge>
          )}
        </div>

        {/* Title & Time */}
        <div className="flex flex-col gap-1 mt-1">
          <h3 className="font-bold text-lg leading-snug line-clamp-2">
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

        {/* --- Exam Details Grid (Mobile Friendly) --- */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {/* Duration */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-1.5 rounded border border-dashed">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium">{exam.duration}m Duration</span>
          </div>

          {/* Total Marks */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-1.5 rounded border border-dashed">
            <BookOpen className="w-3.5 h-3.5 text-purple-500" />
            <span className="font-medium">{exam.totalMarks} Marks</span>
          </div>

          {/* Pass Marks */}
          {exam.settings?.passMarks && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 p-1.5 rounded border border-dashed">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-medium">
                Pass: {exam.settings.passMarks}%
              </span>
            </div>
          )}

          {/* Negative Marking */}
          {exam.settings?.negativeMarking && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-1.5 rounded border border-red-100">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="font-bold">
                -{exam.settings.negativeMarkValue} Negative
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-2 pt-3 border-t border-dashed">
          {isLive ? (
            <Button
              size="sm"
              className="w-full h-10 bg-red-600 hover:bg-red-700 font-bold px-5 text-sm rounded-lg shadow-md shadow-red-200 dark:shadow-none animate-in fade-in zoom-in"
              onClick={onStart}
            >
              Start Exam{" "}
              <PlayCircle className="w-4 h-4 ml-2 fill-white text-red-600" />
            </Button>
          ) : isEnded ? (
            <Button
              size="sm"
              variant="ghost"
              className="w-full h-9 text-xs text-muted-foreground"
              disabled
            >
              Exam Time Over
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="w-full h-9 px-4 text-xs rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100"
              onClick={() =>
                toast.info(`Wait! Exam starts at ${formatTime(exam.startTime)}`)
              }
            >
              Wait for Start
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- Empty State ---
function EmptyState({ router }: { router: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed rounded-2xl bg-muted/5 mt-4">
      <div className="p-4 bg-background rounded-full mb-4 shadow-sm ring-1 ring-border">
        <CheckCircle2 className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 className="font-bold text-lg text-foreground">All Clear!</h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-[250px] leading-relaxed">
        No exams scheduled for today. Take a break or prepare for upcoming
        tests.
      </p>
      <Button
        variant="outline"
        className="mt-6 w-full max-w-xs rounded-xl"
        onClick={() => router.push("/user-dashboard/routine")}
      >
        <Calendar className="w-4 h-4 mr-2" /> View Routine
      </Button>
    </div>
  );
}

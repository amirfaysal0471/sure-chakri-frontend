"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Clock,
  Flame,
  ChevronRight,
  Calendar,
  Timer,
  Loader2,
  Lock,
  Eye,
  Crown,
  PlayCircle,
  LogIn,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Marquee } from "@/components/ui/marquee";

// 🔥 Hooks & Components
import { useData } from "@/app/hooks/use-data";
import { LoginModal } from "@/app/components/auth/login-modal";

// --- Types Definition ---
interface UserPreview {
  _id: string;
  image?: string;
  name?: string;
}

interface Exam {
  _id: string;
  title: string;
  category: string;
  examDate: string; // ISO String
  startTime: string; // "10:00"
  endTime: string; // "11:00"
  isPremium: boolean;
  usersJoined?: number;
  recentUsers?: UserPreview[];
}

interface ProcessedExam extends Exam {
  status: "live" | "upcoming" | "ended";
  progress: number;
  timeText: string;
}

export default function LiveTickerSection() {
  const { data: session } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // --- 1. Fetch Data ---
  const { data: examResponse, isLoading: examLoading } = useData<{
    data: Exam[];
  }>(["public-exams"], "/api/exams/public");

  const { data: resultResponse } = useData<{ data: any[] }>(
    ["user-results-ticker", session?.user?.id],
    session?.user?.id ? "/api/results" : "" // 🔥 FIX: Passed "" instead of null
  );

  const rawExams = examResponse?.data || [];
  const userResults = resultResponse?.data || [];

  // --- 2. Process & Sort Data ---
  const { live, upcoming, tickers } = useMemo(() => {
    const now = new Date();
    const liveList: ProcessedExam[] = [];
    const upcomingList: ProcessedExam[] = [];
    const tickerList: any[] = [];

    // Safely create Set of taken exams
    const takenExamIds = new Set(
      userResults?.map((r: any) =>
        typeof r.exam === "string" ? r.exam : r.exam?._id
      ) || []
    );

    // 🔥 Added Safety Checks to prevent ESLint/Runtime errors
    rawExams?.forEach((exam) => {
      // Guard Clause: If any required field is missing, skip this iteration
      if (!exam.examDate || !exam.startTime || !exam.endTime) return;

      const examDate = new Date(exam.examDate);
      const [startH, startM] = exam.startTime.split(":");
      const [endH, endM] = exam.endTime.split(":");

      // Validate Time Split
      if (!startH || !startM || !endH || !endM) return;

      const start = new Date(examDate);
      start.setHours(Number(startH), Number(startM));

      const end = new Date(examDate);
      end.setHours(Number(endH), Number(endM));

      if (now >= start && now <= end) {
        // LIVE
        const totalDuration = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();

        // Division by zero safety
        const progress =
          totalDuration > 0 ? Math.round((elapsed / totalDuration) * 100) : 0;

        const minutesLeft = Math.ceil((end.getTime() - now.getTime()) / 60000);

        liveList.push({
          ...exam,
          status: "live",
          progress,
          timeText: `Closing in ${minutesLeft}m`,
        });

        tickerList.push({
          text: `🔴 LIVE: ${exam.title} - ${minutesLeft}m left`,
          color: "text-red-600",
        });
      } else if (now < start) {
        // UPCOMING
        const isToday = now.toDateString() === start.toDateString();
        const timeText = isToday
          ? `Starts at ${formatTime(exam.startTime)}`
          : `Starts ${new Date(exam.examDate).toLocaleDateString()}`;

        upcomingList.push({
          ...exam,
          status: "upcoming",
          progress: 0,
          timeText,
        });
      }
    });

    if (tickerList.length === 0) {
      tickerList.push({
        text: "📢 Welcome to Exam Center! Check upcoming exams.",
        color: "text-blue-600",
      });
    }

    // 🔥 Sorting Logic: Not Taken First -> Then Time
    const sortExams = (a: ProcessedExam, b: ProcessedExam) => {
      const aTaken = takenExamIds.has(a._id);
      const bTaken = takenExamIds.has(b._id);

      if (aTaken !== bTaken) return aTaken ? 1 : -1; // Not Taken first

      const dateA = new Date(a.examDate + " " + a.startTime).getTime();
      const dateB = new Date(b.examDate + " " + b.startTime).getTime();
      return dateA - dateB;
    };

    liveList.sort(sortExams);
    upcomingList.sort(sortExams);

    return { live: liveList, upcoming: upcomingList, tickers: tickerList };
  }, [rawExams, userResults]);

  if (examLoading) {
    return (
      <div className="py-20 flex justify-center bg-muted/5">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-8 bg-muted/5 overflow-hidden">
      {/* Ticker */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background border-y py-3 mb-12 shadow-sm">
        <Marquee pauseOnHover className="[--duration:35s]">
          {tickers.map((item, i) => (
            <div
              key={i}
              className={`mx-8 flex items-center gap-2 font-bold text-sm ${item.color}`}
            >
              <span>{item.text}</span>
            </div>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <Tabs
          defaultValue={live.length > 0 ? "live" : "upcoming"}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-black flex items-center gap-2 mb-2 tracking-tight">
                Happening Now{" "}
                <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
              </h2>
              <p className="text-muted-foreground">
                Join thousands of students competing in real-time.
              </p>
            </div>
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="live">
                🔴 Live Now ({live.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming">
                🗓️ Upcoming ({upcoming.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="live"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            {live.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {live.map((exam) => (
                  <ExamCard
                    key={exam._id}
                    exam={exam}
                    results={userResults}
                    onOpenLogin={() => setIsLoginOpen(true)}
                  />
                ))}
              </div>
            ) : (
              <EmptyState type="live" />
            )}
          </TabsContent>

          <TabsContent
            value="upcoming"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcoming.slice(0, 6).map((exam) => (
                <ExamCard
                  key={exam._id}
                  exam={exam}
                  results={userResults}
                  onOpenLogin={() => setIsLoginOpen(true)}
                />
              ))}

              {/* Promo Card */}
              <Card className="bg-primary/5 border-dashed border-primary/30 flex flex-col items-center justify-center text-center p-6 hover:bg-primary/10 transition-colors cursor-pointer min-h-[250px]">
                <div className="p-3 bg-background rounded-full mb-4 shadow-sm">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-bold text-lg">View Full Schedule</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-[200px]">
                  Check out all exams scheduled for this month.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/user-dashboard/routine">See Calendar</Link>
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 🔥 Login Modal */}
      <LoginModal preventRedirect={true} />
    </section>
  );
}

// =========================================================
// EXAM CARD COMPONENT
// =========================================================
function ExamCard({
  exam,
  results,
  onOpenLogin,
}: {
  exam: ProcessedExam;
  results: any[];
  onOpenLogin: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const isLive = exam.status === "live";

  // Check Participation
  const participation = results.find((r) => {
    const rExamId = typeof r.exam === "string" ? r.exam : r.exam?._id;
    return rExamId === exam._id;
  });
  const hasParticipated = !!participation;

  const userPlan = session?.user?.plan || "free";
  const isLocked = exam.isPremium && !["pro", "premium"].includes(userPlan);

  // Logic to show real users or placeholders
  const displayUsers =
    exam.recentUsers && exam.recentUsers.length > 0
      ? exam.recentUsers
      : [1, 2, 3];

  const handleButtonClick = () => {
    if (!session) {
      onOpenLogin();
      return;
    }
    if (hasParticipated) {
      router.push(`/user-dashboard/results/${participation._id}`);
      return;
    }
    if (isLocked) {
      router.push("/pricing");
      return;
    }
    if (isLive) {
      router.push(`/user-dashboard/exams/${exam._id}`);
    } else {
      router.push("/user-dashboard/routine");
    }
  };

  return (
    <Card
      className={`group relative overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card flex flex-col h-full ${
        hasParticipated
          ? "opacity-75 grayscale-[0.3] hover:grayscale-0 hover:opacity-100"
          : ""
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="secondary"
            className="font-bold text-[10px] uppercase tracking-wider"
          >
            {exam.category || "General"}
          </Badge>

          {hasParticipated ? (
            <Badge className="bg-green-600 px-2 py-0.5 text-[10px]">
              ✅ Done
            </Badge>
          ) : isLive ? (
            <Badge
              variant="destructive"
              className="bg-red-600 animate-pulse px-2 py-0.5 text-[10px]"
            >
              ● LIVE
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5"
            >
              {new Date(exam.examDate).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
              })}
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] flex items-center gap-2">
          {exam.isPremium && (
            <Crown className="w-4 h-4 text-amber-500 inline fill-amber-500/20" />
          )}
          {exam.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4 space-y-4 flex-1">
        {/* User Avatars Row */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {displayUsers.slice(0, 3).map((user: any, i: number) => (
              <Avatar
                key={i}
                className="w-7 h-7 border-2 border-background ring-1 ring-muted"
              >
                {typeof user === "object" ? (
                  <>
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback className="text-[9px] bg-primary/10 font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </>
                ) : (
                  <AvatarFallback className="text-[9px] bg-muted text-muted-foreground">
                    ?
                  </AvatarFallback>
                )}
              </Avatar>
            ))}

            {/* Dynamic Count */}
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-background ring-1 ring-muted">
              +{formatUserCount(exam.usersJoined || 0)}
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {exam.usersJoined || 0} Joined
          </span>
        </div>

        {isLive ? (
          <div className="space-y-1.5 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span className="text-red-600 font-bold flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> {exam.timeText}
              </span>
              <span>{exam.progress}% Done</span>
            </div>
            <Progress
              value={exam.progress}
              className="h-2 bg-red-200 [&>div]:bg-red-600"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-dashed">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-xs">{exam.timeText}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={handleButtonClick}
          className={`w-full font-bold h-10 transition-all text-sm ${
            !session
              ? "bg-primary text-white hover:bg-primary/90"
              : hasParticipated
              ? "bg-white border-2 border-green-600 text-green-700 hover:bg-green-50"
              : isLocked
              ? "bg-amber-500 hover:bg-amber-600 text-black border-none"
              : isLive
              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-md shadow-red-500/20 text-white border-none"
              : "bg-background border-2 border-primary/20 text-primary hover:bg-primary hover:text-white"
          }`}
        >
          {/* Button Text Logic */}
          {!session ? (
            <>
              Enter Exam Hall <LogIn className="w-4 h-4 ml-2" />
            </>
          ) : hasParticipated ? (
            <>
              View Result <Eye className="w-4 h-4 ml-2" />
            </>
          ) : isLocked ? (
            <>
              Upgrade to Pro <Lock className="w-4 h-4 ml-2" />
            </>
          ) : isLive ? (
            <>
              Start Exam <PlayCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Set Reminder <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

// --- Helpers ---

function EmptyState({ type }: { type: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl bg-muted/5 text-center">
      <div className="bg-background p-4 rounded-full shadow-sm mb-3">
        {type === "live" ? (
          <Clock className="w-8 h-8 text-muted-foreground" />
        ) : (
          <Calendar className="w-8 h-8 text-muted-foreground" />
        )}
      </div>
      <h3 className="font-bold text-lg text-muted-foreground">
        No {type} exams right now
      </h3>
      <p className="text-sm text-muted-foreground/70 max-w-xs mt-1">
        Please check the upcoming schedule or routine for future exams.
      </p>
    </div>
  );
}

const formatTime = (time: string) => {
  const [h, m] = time.split(":");
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatUserCount = (count: number) => {
  if (!count) return "0";
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "k";
  }
  return count.toString();
};

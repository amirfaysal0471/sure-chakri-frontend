"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  Users,
  Zap,
  CheckCircle2,
  Loader2,
  BookOpen,
  AlertTriangle,
  Trophy,
  X,
  ChevronRight,
  FileText,
  Lock,
  Eye,
  PlayCircle,
  LogIn,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useData } from "@/app/hooks/use-data";
import { LoginModal } from "@/app/components/auth/login-modal";

// --- Types ---
interface ExamSettings {
  passMarks?: number;
  negativeMarking?: boolean;
  negativeMarkValue?: number;
}

interface ExamCategory {
  name: string;
}

interface Exam {
  _id: string;
  title: string;
  topic: string;
  examDate: string;
  startTime: string;
  endTime: string;
  status: "Upcoming" | "Live" | "Ended";
  duration: number;
  totalMarks: number;
  isPremium: boolean;
  syllabus?: string;
  examCategoryId?: ExamCategory;
  settings?: ExamSettings;
}

interface ApiResponse {
  data: Exam[];
}

interface ResultsApiResponse {
  data: { _id: string; exam: string | { _id: string } }[];
}

export default function PublicSchedulePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [now, setNow] = useState<Date>(new Date());
  const { data: session } = useSession();

  // 1. Fetch Public Exams
  const { data: responseData, isLoading } = useData<ApiResponse>(
    ["public-exams-schedule"],
    "/api/exams/public"
  );

  // 2. Fetch User Results
  const { data: resultsResponse } = useData<ResultsApiResponse>(
    ["user-results-check-schedule", session?.user?.id],
    session?.user?.id ? `/api/results` : ""
  );

  const allExams = responseData?.data || [];
  const userResults = resultsResponse?.data || [];

  useEffect(() => {
    setIsMounted(true);
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Status Checker Logic
  const getDynamicStatus = useCallback(
    (exam: Exam): "Upcoming" | "Live" | "Ended" => {
      try {
        const examDate = new Date(exam.examDate);
        const [startH, startM] = exam.startTime.split(":");
        const startDateTime = new Date(examDate);
        startDateTime.setHours(Number(startH), Number(startM), 0);

        const [endH, endM] = exam.endTime.split(":");
        const endDateTime = new Date(examDate);
        endDateTime.setHours(Number(endH), Number(endM), 0);

        if (now > endDateTime) return "Ended";
        if (now >= startDateTime && now <= endDateTime) return "Live";
        return "Upcoming";
      } catch (error) {
        return exam.status;
      }
    },
    [now]
  );

  // Date Filter Logic
  const filteredByDate = useMemo(() => {
    if (!date) return allExams;
    return allExams.filter((exam) => {
      const examDate = new Date(exam.examDate);
      return (
        examDate.getDate() === date.getDate() &&
        examDate.getMonth() === date.getMonth() &&
        examDate.getFullYear() === date.getFullYear()
      );
    });
  }, [date, allExams]);

  // 🔥 CORE SORTING LOGIC FIXED HERE 🔥
  const { upcomingExams, pastExams, currentLiveExam } = useMemo(() => {
    const upcoming: Exam[] = [];
    const past: Exam[] = [];

    // 1. Separate based on dynamic status
    filteredByDate.forEach((exam) => {
      const status = getDynamicStatus(exam);
      if (status === "Live" || status === "Upcoming") {
        upcoming.push(exam);
      } else if (status === "Ended") {
        past.push(exam);
      }
    });

    // 2. Sort Upcoming & Live Exams
    // Logic: Live exams first, then Upcoming exams sorted by nearest date
    upcoming.sort((a, b) => {
      const statusA = getDynamicStatus(a);
      const statusB = getDynamicStatus(b);

      // Priority 1: LIVE Exams always on top
      if (statusA === "Live" && statusB !== "Live") return -1;
      if (statusA !== "Live" && statusB === "Live") return 1;

      // Priority 2: Sort by Date Ascending (Nearest First)
      const dateA = new Date(a.examDate);
      const [hA, mA] = a.startTime.split(":");
      dateA.setHours(Number(hA), Number(mA));

      const dateB = new Date(b.examDate);
      const [hB, mB] = b.startTime.split(":");
      dateB.setHours(Number(hB), Number(mB));

      return dateA.getTime() - dateB.getTime();
    });

    // 3. Sort Past Exams (Descending - Most recent ended first)
    past.sort((a, b) => {
      const dateA = new Date(a.examDate);
      const dateB = new Date(b.examDate);
      return dateB.getTime() - dateA.getTime();
    });

    // Find global live exam for Hero Section
    const live = allExams.find((e) => getDynamicStatus(e) === "Live");

    return {
      upcomingExams: upcoming,
      pastExams: past,
      currentLiveExam: live,
    };
  }, [filteredByDate, allExams, getDynamicStatus]);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* Hero Section */}
      <section className="bg-muted/30 border-b py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Users className="w-3.5 h-3.5 mr-2" />
                {upcomingExams.length} Active Exams
              </Badge>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Your Exam Routine & <br />
                <span className="text-primary">Live Schedule</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Check the schedule below. Exams automatically move to archive
                after the ending time.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="font-semibold shadow-lg"
                  onClick={() => {
                    const scheduleSection = document.getElementById("schedule");
                    scheduleSection?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Schedule <ChevronRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Dynamic Live Card */}
            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-sm bg-background shadow-2xl border-primary/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CardHeader className="bg-muted/40 border-b pb-4">
                  <CardTitle className="text-sm uppercase text-muted-foreground font-bold flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          currentLiveExam ? "bg-green-400" : "bg-blue-400"
                        }`}
                      ></span>
                      <span
                        className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                          currentLiveExam ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></span>
                    </span>
                    {currentLiveExam ? "Happening Now" : "Up Next"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-primary" />
                    </div>
                  ) : currentLiveExam || upcomingExams[0] ? (
                    <>
                      <div>
                        <h3 className="text-xl font-bold leading-tight line-clamp-2">
                          {currentLiveExam?.title || upcomingExams[0]?.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {currentLiveExam?.topic || upcomingExams[0]?.topic}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium bg-muted/30 p-3 rounded-md">
                        <span>Status</span>
                        <Badge
                          variant={currentLiveExam ? "default" : "secondary"}
                          className={
                            currentLiveExam
                              ? "bg-green-600 hover:bg-green-700"
                              : ""
                          }
                        >
                          {currentLiveExam ? "Live Now" : "Upcoming"}
                        </Badge>
                      </div>
                      <ExamActionButton
                        exam={currentLiveExam || upcomingExams[0]}
                        dynamicStatus={currentLiveExam ? "Live" : "Upcoming"}
                        userResults={userResults}
                      />
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No active exams.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* --- Main Content --- */}
      <div
        id="schedule"
        className="container mx-auto px-4 md:px-6 max-w-7xl mt-12"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <Alert className="border-primary/20 bg-primary/5">
              <Zap className="h-4 w-4 text-primary" />
              <AlertTitle>Strict Timing</AlertTitle>
              <AlertDescription className="text-xs text-muted-foreground">
                Exams will strictly follow the schedule. Once ended, they move
                to archive.
              </AlertDescription>
            </Alert>

            {/* Calendar */}
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">
                  Calendar
                </CardTitle>
                {date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDate(undefined)}
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    Reset <X className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex justify-center p-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border shadow-sm"
                    modifiers={{
                      hasExam: (d) =>
                        allExams.some(
                          (exam) =>
                            new Date(exam.examDate).toDateString() ===
                            d.toDateString()
                        ),
                    }}
                    modifiersStyles={{
                      hasExam: {
                        fontWeight: "bold",
                        textDecoration: "underline",
                        textDecorationColor: "hsl(var(--primary))",
                        textUnderlineOffset: "4px",
                      },
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardContent className="p-6 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Total
                  </div>
                  <p className="text-2xl font-bold">{allExams.length}</p>
                </div>
                <div className="space-y-1 border-l pl-4">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs uppercase font-bold">
                    <Users className="w-4 h-4 text-blue-500" /> Students
                  </div>
                  <p className="text-2xl font-bold">12k+</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Tabs */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {date
                      ? `Schedule: ${date.toLocaleDateString()}`
                      : "All Schedules"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Browse exams by status.
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming & Live</TabsTrigger>
                  <TabsTrigger value="archive">Archive (Ended)</TabsTrigger>
                </TabsList>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground text-sm">
                    Loading schedule...
                  </p>
                </div>
              )}

              {!isLoading && (
                <>
                  <TabsContent value="upcoming" className="space-y-4">
                    {upcomingExams.length > 0 ? (
                      upcomingExams.map((exam) => (
                        <PublicExamCard
                          key={exam._id}
                          exam={exam}
                          dynamicStatus={getDynamicStatus(exam)}
                          userResults={userResults}
                        />
                      ))
                    ) : (
                      <EmptyState
                        date={date}
                        reset={() => setDate(undefined)}
                      />
                    )}
                  </TabsContent>

                  <TabsContent value="archive" className="space-y-4">
                    {pastExams.length > 0 ? (
                      pastExams.map((exam) => (
                        <PublicExamCard
                          key={exam._id}
                          exam={exam}
                          dynamicStatus="Ended"
                          userResults={userResults}
                        />
                      ))
                    ) : (
                      <div className="text-center py-12 border rounded-lg bg-muted/10">
                        <p className="text-muted-foreground">
                          No past exams found.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Logic Packed Button ---
function ExamActionButton({
  exam,
  dynamicStatus,
  userResults,
}: {
  exam: Exam;
  dynamicStatus: string;
  userResults?: any[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const currentStatus = dynamicStatus || exam.status;

  // Check Participation
  const participation = userResults?.find((r) => {
    const rExamId = typeof r.exam === "string" ? r.exam : r.exam?._id;
    return rExamId === exam._id;
  });
  const hasParticipated = !!participation;

  // Check Premium
  const userPlan = session?.user?.plan || "free";
  const isLocked = exam.isPremium && !["pro", "premium"].includes(userPlan);

  const getFormattedSchedule = () => {
    try {
      const dateObj = new Date(exam.examDate);
      const [hours, minutes] = exam.startTime.split(":");
      dateObj.setHours(Number(hours));
      dateObj.setMinutes(Number(minutes));

      return dateObj.toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return exam.startTime;
    }
  };

  const handleStartExam = () => {
    if (currentStatus === "Upcoming") {
      return toast.warning("Exam has not started yet.", {
        description: `Starts at: ${getFormattedSchedule()}`,
      });
    }

    if (currentStatus === "Live") {
      toast.success("Entering Exam Hall...", { description: "Good luck!" });
      router.push(`/user-dashboard/exams/${exam._id}`);
    } else {
      toast.error("This exam has ended.");
    }
  };

  // Not Logged In
  if (!session) {
    return (
      <LoginModal preventRedirect={true}>
        <Button className="w-full sm:w-auto font-bold shadow-sm">
          Enter Exam Hall <LogIn className="w-4 h-4 ml-2" />
        </Button>
      </LoginModal>
    );
  }

  // Already Participated
  if (hasParticipated) {
    return (
      <Button
        className="w-full sm:w-auto font-bold shadow-sm border-2 border-green-600 bg-white text-green-700 hover:bg-green-50"
        onClick={() =>
          router.push(`/user-dashboard/results/${participation._id}`)
        }
      >
        View Result <Eye className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  // Premium Locked
  if (isLocked) {
    return (
      <Button
        className="w-full sm:w-auto font-bold shadow-sm bg-amber-500 hover:bg-amber-600 text-white"
        onClick={() => router.push("/pricing")}
      >
        Unlock Premium <Lock className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  // Live Exam
  if (currentStatus === "Live") {
    return (
      <Button
        className="w-full sm:w-auto font-bold shadow-sm bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white animate-pulse"
        onClick={handleStartExam}
      >
        Start Exam <PlayCircle className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  // Ended
  if (currentStatus === "Ended") {
    return (
      <Button
        variant="ghost"
        disabled
        className="w-full sm:w-auto text-muted-foreground"
      >
        Exam Ended
      </Button>
    );
  }

  // Upcoming
  return (
    <Button
      variant="outline"
      className="w-full sm:w-auto font-bold shadow-sm text-primary border-primary/20"
      onClick={() =>
        toast.info(`Exam starts at ${getFormattedSchedule()}`, {
          description: "Please check back later.",
        })
      }
    >
      Set Reminder <ChevronRight className="w-4 h-4 ml-2" />
    </Button>
  );
}

// --- Empty State ---
function EmptyState({
  date,
  reset,
}: {
  date: Date | undefined;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border-2 border-dashed rounded-lg bg-muted/5">
      <div className="p-3 bg-muted rounded-full mb-4">
        <CalendarIcon className="w-6 h-6 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg">No exams found</h3>
      <p className="text-sm text-muted-foreground mt-1 max-w-xs">
        {date ? "No exams for this date." : "No upcoming exams."}
      </p>
      {date && (
        <Button variant="link" onClick={reset} className="mt-2">
          View All Exams
        </Button>
      )}
    </div>
  );
}

// --- Exam Card ---
function PublicExamCard({
  exam,
  dynamicStatus,
  userResults,
}: {
  exam: Exam;
  dynamicStatus: string;
  userResults?: any[];
}) {
  const isLive = dynamicStatus === "Live";
  const isClosed = dynamicStatus === "Ended";

  const examDateObj = new Date(exam.examDate);
  const isToday = new Date().toDateString() === examDateObj.toDateString();

  const formattedDate = examDateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(Number(h));
    d.setMinutes(Number(m));
    const timeString = d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return timeString.replace(":", ".");
  };

  return (
    <Card
      className={`group transition-all hover:shadow-md border-l-4 overflow-hidden ${
        isLive
          ? "border-l-green-500"
          : isClosed
          ? "border-l-muted"
          : "border-l-primary"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Date Box */}
        <div className="bg-muted/20 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 md:w-48 md:min-w-[190px] border-b md:border-b-0 md:border-r">
          <Badge
            variant="outline"
            className="bg-background shadow-sm truncate max-w-[120px]"
          >
            {exam.examCategoryId?.name || "Exam"}
          </Badge>

          <div className="text-center">
            <span className="text-xs font-semibold text-muted-foreground block md:hidden">
              {formattedDate}
            </span>

            <span
              className={`text-xl md:text-3xl font-black uppercase tracking-tight ${
                isLive ? "text-green-600" : ""
              }`}
            >
              {isToday
                ? "TODAY"
                : examDateObj.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                  })}
            </span>

            <span className="hidden md:block text-[10px] font-bold text-muted-foreground mt-2 bg-background px-2 py-1 rounded border whitespace-nowrap">
              {formattedDate} <br /> {formatTime(exam.startTime)} -{" "}
              {formatTime(exam.endTime)}
            </span>
          </div>

          <div className="md:hidden text-[10px] font-bold bg-background px-2 py-1 rounded border">
            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h3 className="font-bold text-lg md:text-xl leading-tight group-hover:text-primary transition-colors">
              {exam.title}
            </h3>
            {isLive ? (
              <Badge className="bg-green-600 hover:bg-green-700 animate-pulse">
                LIVE NOW
              </Badge>
            ) : isClosed ? (
              <Badge variant="outline" className="text-muted-foreground">
                Ended
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className={
                  exam.isPremium
                    ? "bg-amber-100 text-amber-800"
                    : "bg-green-100 text-green-800"
                }
              >
                {exam.isPremium ? "Premium" : "Free"}
              </Badge>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/20 p-2.5 rounded-md">
              <BookOpen className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
              <div className="space-y-1 w-full">
                <span className="font-medium text-foreground block">
                  Topic: {exam.topic}
                </span>

                {exam.syllabus ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline font-medium mt-1 transition-all w-fit">
                        <FileText className="w-3 h-3" />
                        See Syllabus
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Exam Syllabus</DialogTitle>
                        <DialogDescription>
                          Topics covered in <strong>{exam.title}</strong>
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] mt-2 pr-4">
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                          {exam.syllabus}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No specific syllabus provided.
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" /> {exam.duration}m
              </div>
              <div className="flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-purple-500" />{" "}
                {exam.totalMarks} Marks
              </div>
              {exam.settings?.passMarks && (
                <div className="flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-yellow-600" /> Pass:{" "}
                  {exam.settings.passMarks}%
                </div>
              )}
              {exam.settings?.negativeMarking && (
                <div className="flex items-center gap-1.5 text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> -
                  {exam.settings.negativeMarkValue}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 mt-auto">
            <ExamActionButton
              exam={exam}
              dynamicStatus={dynamicStatus}
              userResults={userResults}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

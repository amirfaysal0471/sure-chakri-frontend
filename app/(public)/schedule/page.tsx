"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useData } from "@/app/hooks/use-data";
import { LoginModal } from "@/app/components/auth/login-modal";

export default function PublicSchedulePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const { data: responseData, isLoading } = useData<any>(
    ["public-exams-schedule"],
    "/api/exams/public"
  );

  const allExams = responseData?.data || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const filteredByDate = date
    ? allExams.filter((exam: any) => {
        const examDate = new Date(exam.examDate);
        return (
          examDate.getDate() === date.getDate() &&
          examDate.getMonth() === date.getMonth() &&
          examDate.getFullYear() === date.getFullYear()
        );
      })
    : allExams;

  const upcomingExams = filteredByDate.filter(
    (e: any) => e.status === "Upcoming" || e.status === "Live"
  );

  const pastExams = filteredByDate.filter((e: any) => e.status === "Ended");
  const currentLiveExam = allExams.find((e: any) => e.status === "Live");

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* --- 1. Dynamic Hero Section --- */}
      <section className="bg-muted/30 border-b py-12 md:py-20 px-4 md:px-6 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                <Users className="w-3.5 h-3.5 mr-2" />
                {allExams.length > 0
                  ? `${allExams.length}+ Active Exams`
                  : "Exam Schedule"}
              </Badge>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Your Exam Routine & <br />
                <span className="text-primary">Live Schedule</span>
              </h1>

              <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-lg">
                Stay disciplined with our strict timing system. Check the
                calendar below and prepare for your next challenge.
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
                <Button size="lg" variant="outline" className="font-semibold">
                  Download Routine
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
                        >
                          {currentLiveExam ? "Live Now" : "Upcoming"}
                        </Badge>
                      </div>
                      <ExamActionButton
                        exam={currentLiveExam || upcomingExams[0]}
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

      {/* --- 2. Main Content Layout --- */}
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
                Exam gates close automatically after the specific entry time.
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
                      hasExam: (date) =>
                        allExams.some(
                          (exam: any) =>
                            new Date(exam.examDate).toDateString() ===
                            date.toDateString()
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
                <div className="bg-muted/30 p-3 text-center text-xs text-muted-foreground border-t">
                  Underlined dates indicate scheduled exams.
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

          {/* Right Side */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {date
                      ? `Schedule: ${date.toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}`
                      : "All Schedules"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {date
                      ? `Found ${filteredByDate.length} exams for this date.`
                      : "Browse upcoming and past exams."}
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="archive">Archive</TabsTrigger>
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
                      upcomingExams.map((exam: any) => (
                        <PublicExamCard key={exam._id} exam={exam} />
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
                      pastExams.map((exam: any) => (
                        <PublicExamCard key={exam._id} exam={exam} />
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

// --- Action Button ---
function ExamActionButton({ exam }: { exam: any }) {
  const { data: session } = useSession();
  const router = useRouter();

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
      return `${new Date(exam.examDate).toLocaleDateString()} at ${
        exam.startTime
      }`;
    }
  };

  const handleStartExam = () => {
    if (exam.status === "Upcoming") {
      return toast.warning("Exam has not started yet.", {
        description: `Starts at: ${getFormattedSchedule()}`,
      });
    }

    if (exam.status === "Live") {
      toast.success("Entering Exam Hall...", {
        description: "Good luck!",
      });
      router.push(`/user-dashboard/exams/${exam._id}`);
    } else {
      toast.error("This exam is not accessible right now.");
    }
  };

  if (!session) {
    return (
      <LoginModal preventRedirect={true}>
        <Button className="w-full sm:w-auto font-bold shadow-sm">
          Start Exam
        </Button>
      </LoginModal>
    );
  }

  return (
    <Button
      className="w-full sm:w-auto font-bold shadow-sm"
      onClick={handleStartExam}
    >
      Start Exam
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
        {date
          ? "There are no exams scheduled for this specific date."
          : "There are no upcoming exams at the moment."}
      </p>
      {date && (
        <Button variant="link" onClick={reset} className="mt-2">
          View All Exams
        </Button>
      )}
    </div>
  );
}

// --- 🔥 Updated Exam Card with Start & End Time ---
function PublicExamCard({ exam }: { exam: any }) {
  const isLive = exam.status === "Live";
  const isClosed = exam.status === "Ended";

  const examDateObj = new Date(exam.examDate);
  const isToday = new Date().toDateString() === examDateObj.toDateString();

  // 🔥 Helper to format HH:MM to 12h AM/PM
  const formatTime = (time: string) => {
    if (!time) return "";
    const [h, m] = time.split(":");
    const d = new Date();
    d.setHours(Number(h));
    d.setMinutes(Number(m));
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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
        <div className="bg-muted/20 p-4 md:p-6 flex flex-row md:flex-col items-center justify-between md:justify-center gap-3 md:w-40 md:min-w-[160px] border-b md:border-b-0 md:border-r">
          <Badge
            variant="outline"
            className="bg-background shadow-sm truncate max-w-[120px]"
          >
            {exam.examCategoryId?.name || "Exam"}
          </Badge>

          <div className="text-center">
            <span className="text-xs font-semibold text-muted-foreground block md:hidden">
              {examDateObj.toLocaleDateString()}
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
            {/* 🔥 Desktop Time: Start - End */}
            <span className="hidden md:block text-[10px] font-bold text-muted-foreground mt-1 bg-background px-2 py-1 rounded border whitespace-nowrap">
              {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
            </span>
          </div>

          {/* 🔥 Mobile Time: Start - End */}
          <div className="md:hidden text-[10px] font-bold bg-background px-2 py-1 rounded border">
            {formatTime(exam.startTime)} - {formatTime(exam.endTime)}
          </div>
        </div>

        {/* Content Box */}
        <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h3 className="font-bold text-lg md:text-xl leading-tight group-hover:text-primary transition-colors">
              {exam.title}
            </h3>
            {isLive ? (
              <Badge className="bg-green-600 hover:bg-green-700 animate-pulse">
                LIVE
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
              <div className="space-y-0.5">
                <span className="font-medium text-foreground block">
                  {exam.topic}
                </span>
                {exam.syllabus && (
                  <p className="text-xs line-clamp-1 opacity-80">
                    {exam.syllabus}
                  </p>
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
            {isLive ? (
              <ExamActionButton exam={exam} />
            ) : isClosed ? (
              <Button
                size="sm"
                variant="ghost"
                disabled
                className="text-muted-foreground"
              >
                Exam Ended
              </Button>
            ) : (
              <ExamActionButton exam={exam} />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

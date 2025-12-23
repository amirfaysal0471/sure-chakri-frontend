"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar as CalendarIcon,
  Clock,
  AlertCircle,
  ChevronRight,
  Lock,
  BellRing,
  Users,
  Zap,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// --- Mock Data (Public View) ---
const PUBLIC_EXAMS = [
  {
    id: 1,
    title: "BCS 46th Preliminary Model Test",
    category: "BCS",
    type: "Free for All",
    date: "Today",
    time: "06:00 PM - 10:00 PM",
    duration: "2 Hours",
    marks: 200,
    participants: "1.2k+",
    status: "live",
  },
  {
    id: 2,
    title: "Bank Job Math Special",
    category: "Bank",
    type: "Premium",
    date: "Tomorrow",
    time: "07:00 PM - 09:00 PM",
    duration: "1 Hour",
    marks: 100,
    participants: "850+",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Primary Teacher Recruitment Test",
    category: "Primary",
    type: "Free for All",
    date: "25 Dec, 2025",
    time: "04:00 PM - 05:00 PM",
    duration: "45 Mins",
    marks: 80,
    participants: "2k+",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Weekly General Knowledge",
    category: "General",
    type: "Free for All",
    date: "Yesterday",
    time: "06:00 PM - 08:00 PM",
    duration: "1 Hour",
    marks: 50,
    participants: "3.5k",
    status: "closed",
  },
];

export default function PublicSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-20">
      {/* --- 1. Public Hero Section (CTA Focused) --- */}
      <section className="bg-muted/30 border-b pt-12 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <Badge
                variant="secondary"
                className="border-primary/20 text-primary bg-background px-3 py-1"
              >
                <Users className="w-3 h-3 mr-2" /> 5,000+ Students Competing
                Today
              </Badge>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Exam Schedule & <br />
                <span className="text-primary">Live Routine</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                সহজ শিক্ষায় প্রতিটি পরীক্ষার সময় নির্দিষ্ট। ডিসিপ্লিন মেইনটেইন
                করতে আমরা কঠোর টাইমিং মেনে চলি। নিচের রুটিন দেখে আজই আপনার
                প্রস্তুতি শুরু করুন।
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Button
                  size="lg"
                  className="font-bold shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link href="/register">Join Free Exam</Link>
                </Button>
                <Button size="lg" variant="outline" className="font-bold">
                  Download Routine (PDF)
                </Button>
              </div>
            </div>

            {/* Live Count Card (FOMO Creator) */}
            <Card className="w-full md:w-80 bg-background shadow-xl border-primary/20 animate-in slide-in-from-right-8 duration-700">
              <CardHeader className="pb-2 bg-muted/30">
                <CardTitle className="text-sm uppercase text-muted-foreground font-bold flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  Happening Now
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="text-3xl font-black tabular-nums">
                  BCS Model Test
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  46th Prelim Standard
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between text-sm font-medium">
                  <span>Participants:</span>
                  <span className="text-primary">1,240 Live</span>
                </div>
                <Button className="w-full mt-4 font-bold" size="sm" asChild>
                  <Link href="/login">Login to Join</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* --- 2. Main Content Grid --- */}
      <div className="container mx-auto px-4 max-w-6xl mt-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* --- Left Sidebar: Info & Calendar (4 Cols) --- */}
          <div className="lg:col-span-4 space-y-6">
            {/* Why Strict Timing? (Educational Content) */}
            <Alert className="bg-primary/5 border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-bold">
                Why Strict Timing?
              </AlertTitle>
              <AlertDescription className="text-muted-foreground text-sm mt-1">
                আসল পরীক্ষার হলের পরিবেশ তৈরি করতে আমাদের "Gate Closing" সিস্টেম
                রয়েছে। ১০টার পর আর কেউ ঢুকতে পারে না।
              </AlertDescription>
            </Alert>

            {/* Calendar Widget */}
            <Card className="border shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Exam Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border mx-auto"
                />
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card className="bg-muted/30 border-none">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-full shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">150+</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      Exams Conducted
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-full shadow-sm">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">12k+</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      Active Students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- Right Side: Public Exam List (8 Cols) --- */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="upcoming" className="w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Upcoming Schedule</h2>
                  <p className="text-sm text-muted-foreground">
                    Select an exam to see syllabus details
                  </p>
                </div>
                <TabsList>
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="archive">Past Exams</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="upcoming" className="space-y-4">
                {PUBLIC_EXAMS.filter((e) => e.status !== "closed").map(
                  (exam) => (
                    <PublicExamCard key={exam.id} exam={exam} />
                  )
                )}
              </TabsContent>

              <TabsContent value="archive">
                <div className="space-y-4">
                  {PUBLIC_EXAMS.filter((e) => e.status === "closed").map(
                    (exam) => (
                      <PublicExamCard key={exam.id} exam={exam} />
                    )
                  )}

                  <div className="p-6 bg-muted/20 rounded-xl text-center border border-dashed">
                    <Lock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <h3 className="font-bold text-foreground">
                      View Full Archive?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Past exams are available for Premium users only.
                    </p>
                    <Button variant="outline">View Pricing</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Component: Public Exam Card ---
function PublicExamCard({ exam }: { exam: any }) {
  const isLive = exam.status === "live";
  const isClosed = exam.status === "closed";

  return (
    <Card
      className={`group transition-all duration-300 hover:shadow-lg border-l-4 ${
        isLive
          ? "border-l-green-500 ring-1 ring-green-500/20"
          : isClosed
          ? "border-l-muted opacity-75"
          : "border-l-primary"
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Date Section */}
        <div className="p-6 flex flex-row sm:flex-col items-center sm:justify-center gap-2 sm:w-36 bg-muted/20 sm:border-r">
          <Badge variant="outline" className="bg-background text-xs mb-1">
            {exam.category}
          </Badge>
          <div className="text-center">
            <span className="text-sm font-semibold block sm:hidden">
              {exam.date}
            </span>
            <span
              className={`text-xl sm:text-2xl font-black ${
                isLive ? "text-green-600" : ""
              }`}
            >
              {exam.date === "Today" ? "TODAY" : exam.date.split(" ")[0]}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block mt-1">
              {exam.time.split(" -")[0]}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="flex-1 p-5 flex flex-col justify-center">
          <div className="flex flex-wrap items-start justify-between mb-2 gap-2">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {exam.title}
            </h3>
            {isLive ? (
              <Badge className="bg-green-600 hover:bg-green-700 animate-pulse">
                LIVE
              </Badge>
            ) : exam.type === "Free for All" ? (
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700"
              >
                Free
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-amber-100 text-amber-700"
              >
                Premium
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-5">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {exam.duration}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> {exam.participants} expected
            </div>
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> {exam.marks} Marks
            </div>
          </div>

          {/* Public Action Buttons */}
          <div className="flex items-center gap-3">
            {isLive ? (
              <Button
                className="bg-green-600 hover:bg-green-700 font-bold w-full sm:w-auto shadow-md"
                asChild
              >
                <Link href="/login">Login to Join Now</Link>
              </Button>
            ) : isClosed ? (
              <Button
                variant="ghost"
                disabled
                className="w-full sm:w-auto justify-start px-0"
              >
                Exam Ended
              </Button>
            ) : (
              <>
                <Button className="font-semibold w-full sm:w-auto" asChild>
                  <Link href="/register">Register to Participate</Link>
                </Button>
                <Button
                  variant="outline"
                  className="font-semibold w-full sm:w-auto"
                >
                  See Syllabus
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

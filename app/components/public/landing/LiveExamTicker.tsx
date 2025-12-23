"use client";

import Link from "next/link";
import { Clock, Flame, ChevronRight, Calendar, Timer } from "lucide-react";

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
// 👇 Import Path চেক করে নিন (আপনার ফোল্ডার অনুযায়ী)
import { Marquee } from "@/components/ui/marquee";
// --- Ticker Data ---
const TICKER_ITEMS = [
  {
    text: "🔴 LIVE: 46th BCS Model Test - 20 mins left",
    color: "text-red-600",
  },
  {
    text: "🔥 HOT: Bank Job Math Special just started",
    color: "text-orange-600",
  },
  {
    text: "⚡ TRENDING: 1.5k students joined Primary Teacher Exam",
    color: "text-yellow-600",
  },
  {
    text: "📢 NOTICE: Railway Group D Exam starts at 4 PM",
    color: "text-blue-600",
  },
  {
    text: "🔴 LIVE: 46th BCS Model Test - 20 mins left",
    color: "text-red-600",
  },
];

const EXAMS = {
  live: [
    {
      id: 1,
      title: "46th BCS Preliminary Exclusive Model Test",
      category: "BCS",
      users: 1240,
      totalSeats: 1500,
      progress: 75,
      timeText: "Closing in 12m",
      status: "live",
    },
    {
      id: 2,
      title: "Bangladesh Bank AD - General Knowledge",
      category: "Bank",
      users: 850,
      totalSeats: 1000,
      progress: 40,
      timeText: "45m Remaining",
      status: "live",
    },
    {
      id: 3,
      title: "Primary Assistant Teacher Recruitment",
      category: "Primary",
      users: 2100,
      totalSeats: 3000,
      progress: 90,
      timeText: "Ending Soon",
      status: "live",
    },
  ],
  upcoming: [
    {
      id: 4,
      title: "NSI Field Officer - Full Mock",
      category: "NSI",
      users: 500,
      timeText: "Starts at 4:00 PM",
      status: "upcoming",
      date: "Today",
    },
    {
      id: 5,
      title: "Railway Group D Special",
      category: "Railway",
      users: 320,
      timeText: "Starts Tomorrow",
      status: "upcoming",
      date: "24 Dec",
    },
  ],
};

export default function LiveTickerSection() {
  return (
    <section className="py-8 bg-muted/5 overflow-hidden">
      {/* --- 1. Magic UI Marquee Section (FIXED) --- */}
      {/* bg-background ব্যবহার করা হয়েছে যাতে gradient ঠিকভাবে মিশে যায় */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background border-y py-3 mb-12 shadow-sm">
        <Marquee pauseOnHover className="[--duration:35s]">
          {TICKER_ITEMS.map((item, i) => (
            <div
              key={i}
              className={`mx-8 flex items-center gap-2 font-bold text-sm ${item.color}`}
            >
              {/* Optional: Icon based on color/type if needed */}
              <span>{item.text}</span>
            </div>
          ))}
        </Marquee>

        {/* Gradient Fades: এখন এটি ব্যাকগ্রাউন্ডের সাথে স্মুথলি মিশে যাবে */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* --- 2. Interactive Header with Tabs --- */}
        <Tabs defaultValue="live" className="w-full">
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
              <TabsTrigger value="live">🔴 Live Now</TabsTrigger>
              <TabsTrigger value="upcoming">🗓️ Upcoming</TabsTrigger>
            </TabsList>
          </div>

          {/* --- LIVE EXAMS CONTENT --- */}
          <TabsContent
            value="live"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EXAMS.live.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </TabsContent>

          {/* --- UPCOMING EXAMS CONTENT --- */}
          <TabsContent
            value="upcoming"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {EXAMS.upcoming.map((exam) => (
                <ExamCard key={exam.id} exam={exam} />
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
                <Button variant="outline" size="sm">
                  See Calendar
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

// --- Sub-Component: Exam Card ---
function ExamCard({ exam }: { exam: any }) {
  const isLive = exam.status === "live";

  return (
    <Card className="group relative overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
      {/* Top Border Highlight on Hover */}
      <div className="absolute inset-x-0 top-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <CardHeader className="pb-3 pt-5">
        <div className="flex justify-between items-start mb-3">
          <Badge
            variant="secondary"
            className="font-bold text-[10px] uppercase tracking-wider"
          >
            {exam.category}
          </Badge>
          {isLive ? (
            <Badge
              variant="destructive"
              className="bg-red-600 animate-pulse shadow-md shadow-red-500/20 px-2 py-0.5 text-[10px]"
            >
              ● LIVE
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5"
            >
              {exam.date}
            </Badge>
          )}
        </div>

        <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]">
          {exam.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <Avatar
                key={i}
                className="w-7 h-7 border-2 border-background ring-1 ring-muted"
              >
                <AvatarImage
                  src={`https://i.pravatar.cc/100?u=${exam.id + i}`}
                />
                <AvatarFallback className="text-[9px]">U</AvatarFallback>
              </Avatar>
            ))}
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border-2 border-background ring-1 ring-muted">
              +{(exam.users / 100).toFixed(0)}k
            </div>
          </div>
          <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {exam.users} Joined
          </span>
        </div>

        {isLive && (
          <div className="space-y-1.5 bg-red-50 dark:bg-red-950/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
            <div className="flex justify-between text-[11px] font-medium text-muted-foreground">
              <span className="text-red-600 font-bold flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" /> {exam.timeText}
              </span>
              <span>{exam.progress}% Done</span>
            </div>
            {/* Progress Bar Custom Color */}
            <Progress
              value={exam.progress}
              className="h-2 bg-red-200 [&>div]:bg-red-600"
            />
          </div>
        )}

        {!isLive && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 p-2.5 rounded-lg border border-dashed">
            <Clock className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-xs">{exam.timeText}</span>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full font-bold h-10 transition-all text-sm ${
            isLive
              ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 shadow-md shadow-red-500/20 text-white"
              : "bg-background border-2 border-primary/20 text-primary hover:bg-primary hover:text-white"
          }`}
          asChild
        >
          <Link href="/login">
            {isLive ? "Enter Exam Hall" : "Set Reminder"}
            <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

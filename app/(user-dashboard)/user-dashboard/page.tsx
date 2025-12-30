"use client";

import { useSession } from "next-auth/react";
import {
  ArrowUpRight,
  BookOpen,
  Trophy,
  Target,
  Zap,
  PlayCircle,
  CalendarDays,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Crown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function UserDashboardPage() {
  const { data: session } = useSession();
  const user = session?.user;

  // Mock Stats Data (Project Aligned)
  const stats = [
    {
      label: "Exams Taken",
      value: "42",
      icon: BookOpen,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Avg. Accuracy",
      value: "68%",
      icon: Target,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Global Rank",
      value: "#120",
      icon: Trophy,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "AI Credits",
      value: "150",
      icon: Zap,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      {/* --- 1. Welcome Header --- */}
      <section className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Hi, {user?.name?.split(" ")[0] || "Student"}!{" "}
            <span className="text-xl">👋</span>
          </h2>
          <p className="text-sm text-muted-foreground font-medium">
            Ready to crack your next exam?
          </p>
        </div>
        <Link href="/user-dashboard/profile">
          <Avatar className="h-10 w-10 border shadow-sm cursor-pointer">
            <AvatarImage src={user?.image || ""} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </Link>
      </section>

      {/* --- 2. Hero: Live Exam Card (Priority Action) --- */}
      <section>
        <Card className="border-none shadow-lg bg-gradient-to-r from-red-600 to-red-700 text-white relative overflow-hidden">
          {/* Abstract Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

          <CardContent className="p-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <Badge className="bg-white/20 hover:bg-white/20 text-white border-0 backdrop-blur-md animate-pulse">
                  🔴 LIVE NOW
                </Badge>
                <h3 className="text-xl md:text-2xl font-bold leading-tight">
                  BCS Preliminary Model Test 2025
                </h3>
                <p className="text-red-100 text-sm flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" /> Ends in 02 hours 15 mins
                </p>
              </div>
              <Button
                size="lg"
                className="w-full md:w-auto bg-white text-red-600 hover:bg-red-50 font-bold shadow-md border-0"
              >
                Join Exam Now <PlayCircle className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* --- 3. Stats Grid --- */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-none shadow-sm bg-card hover:shadow-md transition-all"
          >
            <CardContent className="p-4 flex flex-col items-start gap-3">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <span className="text-2xl font-bold block">{stat.value}</span>
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* --- 4. Content Split: Performance & Activity --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Activity (2 Cols) */}
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
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="border-none shadow-sm hover:bg-muted/20 transition-colors"
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {80 - i * 5}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">
                      Bank Job Math Special Quiz {i}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <CalendarDays className="w-3 h-3" /> 2{i} Dec, 2025
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge
                      variant={i === 1 ? "default" : "secondary"}
                      className={i === 1 ? "bg-green-600" : ""}
                    >
                      {i === 1 ? "Passed" : "Average"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right: AI Insights / Upgrade Banner (1 Col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold px-1">AI Insights</h3>

          <Card className="border border-purple-100 bg-gradient-to-b from-purple-50/50 to-white shadow-sm overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <BrainCircuit className="w-4 h-4" /> Performance Analysis
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>General Knowledge</span>
                    <span className="text-red-500">Weak (42%)</span>
                  </div>
                  <Progress
                    value={42}
                    className="h-1.5 bg-red-100 [&>div]:bg-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span>English Literature</span>
                    <span className="text-green-600">Strong (85%)</span>
                  </div>
                  <Progress
                    value={85}
                    className="h-1.5 bg-green-100 [&>div]:bg-green-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Our AI suggests you to focus more on{" "}
                  <strong>GK International Affairs</strong> to improve your
                  rank.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Zap className="w-3.5 h-3.5 mr-2" /> Improve with AI
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Banner */}
          <Card className="bg-gray-900 text-white border-none shadow-md">
            <CardContent className="p-5 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-bold flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" /> Go Premium
                </h4>
                <p className="text-xs text-gray-400 mt-1 mb-3">
                  Unlock unlimited exams and advanced routine features.
                </p>
                <Button
                  size="sm"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold border-0 h-8"
                >
                  Upgrade Plan
                </Button>
              </div>
              {/* Decor */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Simple Clock Icon Component
function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

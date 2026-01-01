"use client";

import { useState } from "react";
import {
  Trophy,
  Crown,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Target,
  BookOpen,
  Loader2,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useData } from "@/app/hooks/use-data"; // Custom Hook

// --- Interfaces ---
interface LeaderboardUser {
  _id: string;
  rank: number;
  name: string;
  image?: string;
  role: string;
  points: number;
  exams: number;
  accuracy: number;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState("all"); // 'all', 'weekly', 'monthly'
  const [searchTerm, setSearchTerm] = useState("");

  // 🔥 Fetch Real Data
  const { data: response, isLoading } = useData<{ data: LeaderboardUser[] }>(
    ["leaderboard", filter],
    `/api/leaderboard?filter=${filter}`
  );

  const leaderboardData = response?.data || [];

  // Filter Search Logic (Client Side for speed)
  const filteredUsers = leaderboardData.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topThree = leaderboardData.slice(0, 3);
  const otherUsers = filteredUsers.slice(3); // Show remaining in list

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-foreground font-sans pb-24">
      {/* --- 1. Header Section --- */}
      <div className="bg-white dark:bg-slate-900 border-b pt-10 pb-20 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Global Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top performers based on exam results. Earn points to climb the
            ranks! <Crown className="inline w-4 h-4 text-yellow-500 mb-1" />
          </p>
        </div>
      </div>

      {/* --- 2. Podium Section (Top 3) --- */}
      {topThree.length > 0 && (
        <div className="container mx-auto px-4 -mt-12 relative z-10 mb-12">
          <div className="flex flex-col md:flex-row justify-center items-end gap-4 md:gap-6">
            {/* Rank 2 */}
            {topThree[1] && (
              <PodiumCard
                user={topThree[1]}
                rank={2}
                color="bg-slate-200"
                border="border-slate-200"
              />
            )}

            {/* Rank 1 (Champion) */}
            {topThree[0] && (
              <div className="order-first md:order-none w-full md:w-1/3 z-20">
                <div className="relative pt-12">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-bounce duration-1000">
                    <Crown
                      size={48}
                      className="text-yellow-400 fill-yellow-400 drop-shadow-lg"
                    />
                  </div>

                  <Card className="border-t-4 border-t-yellow-400 shadow-xl bg-white dark:bg-slate-900 overflow-visible relative mt-4">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                      <div className="relative">
                        <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-900 shadow-md ring-4 ring-yellow-100">
                          <AvatarImage src={topThree[0].image} />
                          <AvatarFallback className="text-2xl font-bold bg-yellow-50 text-yellow-600">
                            {topThree[0].name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 px-3 shadow-sm border-2 border-white pointer-events-none">
                          Champion
                        </Badge>
                      </div>
                    </div>

                    <CardHeader className="pt-16 pb-2 text-center">
                      <CardTitle className="text-2xl font-bold line-clamp-1">
                        {topThree[0].name}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="w-fit mx-auto mt-1 uppercase text-[10px]"
                      >
                        {topThree[0].role}
                      </Badge>
                    </CardHeader>

                    <CardContent className="text-center pb-8">
                      <div className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-4">
                        {topThree[0].points}
                      </div>
                      <div className="flex justify-center gap-6 text-sm text-muted-foreground border-t pt-4 mx-4 border-dashed">
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white text-lg">
                            {topThree[0].exams}
                          </span>
                          Exams
                        </div>
                        <div>
                          <span className="block font-bold text-slate-900 dark:text-white text-lg">
                            {topThree[0].accuracy}%
                          </span>
                          Accuracy
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Rank 3 */}
            {topThree[2] && (
              <PodiumCard
                user={topThree[2]}
                rank={3}
                color="bg-orange-100"
                border="border-orange-200"
              />
            )}
          </div>
        </div>
      )}

      {/* --- 3. Controls & List --- */}
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student..."
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[140px] bg-white dark:bg-slate-900">
                <SelectValue placeholder="Timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leaderboard List Table */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-slate-50/50 dark:bg-slate-900 text-xs font-bold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2 sm:col-span-1 text-center">Rank</div>
            <div className="col-span-6 sm:col-span-5">User</div>
            <div className="col-span-2 hidden sm:block text-center">
              Accuracy
            </div>
            <div className="col-span-2 hidden sm:block text-center">Exams</div>
            <div className="col-span-4 sm:col-span-2 text-right pr-4">
              Points
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {leaderboardData.length > 0 ? (
              // If searching, show all matches. Else show from rank 4 downwards
              (searchTerm ? filteredUsers : otherUsers).map((user) => (
                <div
                  key={user._id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  {/* Rank */}
                  <div className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      #{user.rank}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                    <Avatar className="h-9 w-9 border bg-slate-100">
                      <AvatarImage src={user.image} />
                      <AvatarFallback className="text-xs font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors line-clamp-1">
                        {user.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground uppercase">
                        {user.role}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="col-span-2 hidden sm:flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Target size={14} /> {user.accuracy}%
                  </div>
                  <div className="col-span-2 hidden sm:flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <BookOpen size={14} /> {user.exams}
                  </div>

                  {/* Points */}
                  <div className="col-span-4 sm:col-span-2 text-right pr-4 font-bold text-slate-900 dark:text-white">
                    {user.points}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                No ranking data available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function PodiumCard({
  user,
  rank,
  color,
  border,
}: {
  user: LeaderboardUser;
  rank: number;
  color: string;
  border: string;
}) {
  return (
    <div className="w-full md:w-1/3 pt-12">
      <Card className="border shadow-lg bg-white dark:bg-slate-900 relative overflow-visible mt-2 group hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div className="relative">
            <Avatar
              className={cn(
                "w-20 h-20 border-4 border-white dark:border-slate-900 shadow-md",
                rank === 2 ? "ring-4 ring-slate-100" : "ring-4 ring-orange-50"
              )}
            >
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-xl font-bold text-slate-500 bg-slate-100">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Badge
              variant="secondary"
              className={cn(
                "absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 shadow-sm border-2 border-white min-w-[2rem] justify-center",
                color
              )}
            >
              #{rank}
            </Badge>
          </div>
        </div>

        <CardHeader className="pt-14 pb-2 text-center">
          <CardTitle className="text-lg font-bold line-clamp-1">
            {user.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground uppercase">{user.role}</p>
        </CardHeader>

        <CardContent className="text-center pb-6">
          <div className="text-3xl font-black text-slate-800 dark:text-white tabular-nums">
            {user.points}
          </div>
          <p className="text-xs text-muted-foreground mt-1 font-medium">
            Points
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

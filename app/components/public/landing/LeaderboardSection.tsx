"use client";

import Link from "next/link";
import {
  Trophy,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
  Medal,
  ArrowRight,
  Shield,
  Star,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// --- Mock Data: Top Rankers ---
const LEADERS = [
  {
    rank: 1,
    name: "Sadia Afrin",
    points: 2450,
    exam: "46th BCS",
    change: "up",
    avatar: "https://i.pravatar.cc/150?u=1",
    badge: "Grandmaster",
  },
  {
    rank: 2,
    name: "Rakib Hassan",
    points: 2380,
    exam: "Bank AD",
    change: "same",
    avatar: "https://i.pravatar.cc/150?u=2",
    badge: "Master",
  },
  {
    rank: 3,
    name: "Fatema Tuz Zohra",
    points: 2350,
    exam: "Primary Asst.",
    change: "down",
    avatar: "https://i.pravatar.cc/150?u=3",
    badge: "Diamond",
  },
  {
    rank: 4,
    name: "Tanvir Ahmed",
    points: 2100,
    exam: "NSI Field",
    change: "up",
    avatar: "https://i.pravatar.cc/150?u=4",
    badge: "Platinum",
  },
  {
    rank: 5,
    name: "Abdullah Al Mamun",
    points: 1950,
    exam: "Railway",
    change: "up",
    avatar: "https://i.pravatar.cc/150?u=5",
    badge: "Gold",
  },
];

export default function LeaderboardSection() {
  return (
    <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* --- LEFT SIDE: Content --- */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-muted/50 text-sm font-medium text-muted-foreground animate-in slide-in-from-left-4 duration-700">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Weekly Top Performers</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              সেরাদের তালিকায় <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-600">
                নিজের নাম দেখুন
              </span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
              প্রতিটি পরীক্ষার পর রিয়েল-টাইম মেরিট লিস্ট। দেখুন আপনার অবস্থান
              কোথায় এবং অর্জন করুন এক্সক্লুসিভ ব্যাজ ও রিওয়ার্ড।
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
                  <Medal className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Exclusive Badges</p>
                  <p className="text-xs text-muted-foreground">
                    For Top 10 Rankers
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border border-border/50">
                <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                  <Star className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">Reward Points</p>
                  <p className="text-xs text-muted-foreground">
                    Redeem for discounts
                  </p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="rounded-full px-8 font-bold shadow-xl shadow-yellow-500/20"
              asChild
            >
              <Link href="/leaderboard">
                See Full Leaderboard <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* --- RIGHT SIDE: Leaderboard Card --- */}
          <div className="relative mx-auto w-full max-w-md lg:ml-auto">
            {/* Floating Crown Decoration */}
            <div className="absolute -top-8 -right-8 animate-bounce duration-[3000ms] hidden md:block">
              <Crown className="w-16 h-16 text-yellow-500 fill-yellow-500/20 rotate-12" />
            </div>

            <Card className="border-2 shadow-2xl bg-background/80 backdrop-blur-xl overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4 border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 hover:bg-green-100 animate-pulse"
                  >
                    ● Live Updating
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="divide-y">
                  {LEADERS.map((user, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group cursor-pointer relative",
                        index === 0
                          ? "bg-gradient-to-r from-yellow-500/5 to-transparent"
                          : ""
                      )}
                    >
                      {/* Rank Indicator */}
                      <div className="flex flex-col items-center justify-center w-8">
                        {index === 0 ? (
                          <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                        ) : index === 1 ? (
                          <Medal className="w-5 h-5 text-gray-400 fill-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="w-5 h-5 text-amber-700 fill-amber-700" />
                        ) : (
                          <span className="font-bold text-muted-foreground">
                            #{user.rank}
                          </span>
                        )}
                      </div>

                      {/* Avatar & Info */}
                      <Avatar
                        className={cn(
                          "w-10 h-10 border-2",
                          index === 0
                            ? "border-yellow-500 ring-2 ring-yellow-500/20"
                            : "border-background"
                        )}
                      >
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold truncate text-sm">
                            {user.name}
                          </p>
                          {index === 0 && (
                            <Badge className="text-[10px] h-4 px-1 bg-yellow-500 hover:bg-yellow-600">
                              TOP
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.badge} • {user.exam}
                        </p>
                      </div>

                      {/* Points & Trend */}
                      <div className="text-right">
                        <p className="font-bold font-mono text-sm">
                          {user.points}
                        </p>
                        <div className="flex items-center justify-end gap-1 text-[10px]">
                          {user.change === "up" && (
                            <TrendingUp className="w-3 h-3 text-green-500" />
                          )}
                          {user.change === "down" && (
                            <TrendingDown className="w-3 h-3 text-red-500" />
                          )}
                          {user.change === "same" && (
                            <Minus className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="text-muted-foreground">pts</span>
                        </div>
                      </div>

                      {/* Hover Highlight Bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                    </div>
                  ))}
                </div>

                {/* Sticky "Your Rank" Footer */}
                <div className="bg-primary/5 p-4 border-t border-primary/10">
                  <div className="flex items-center gap-4 opacity-50 filter blur-[1px] select-none">
                    <span className="font-bold text-muted-foreground w-8 text-center">
                      #124
                    </span>
                    <div className="w-10 h-10 rounded-full bg-muted/80" />
                    <div className="flex-1 space-y-2">
                      <div className="h-2 w-20 bg-muted rounded" />
                      <div className="h-2 w-12 bg-muted rounded" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-3 font-bold"
                    variant="outline"
                  >
                    Log in to see your rank
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Decorative Elements behind card */}
            <div className="absolute -z-10 top-10 -left-10 w-full h-full bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-3xl blur-2xl transform rotate-6 opacity-60" />
          </div>
        </div>
      </div>
    </section>
  );
}

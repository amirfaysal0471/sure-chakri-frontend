"use client";

import {
  Trophy,
  Crown,
  Search,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter,
  Target,
  BookOpen,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// --- Mock Data: Top 3 ---
const TOP_USERS = [
  {
    id: 1,
    name: "Sakib Al Hasan",
    points: 2450,
    avatar: "https://i.pravatar.cc/150?u=1",
    role: "BCS Master",
    accuracy: "92%",
    exams: 45,
  },
  {
    id: 2,
    name: "Tamim Iqbal",
    points: 2380,
    avatar: "https://i.pravatar.cc/150?u=2",
    role: "Bank Pro",
    accuracy: "88%",
    exams: 42,
  },
  {
    id: 3,
    name: "Mushfiqur Rahim",
    points: 2310,
    avatar: "https://i.pravatar.cc/150?u=3",
    role: "Math Genius",
    accuracy: "95%",
    exams: 38,
  },
];

// --- Mock Data: Others ---
const OTHER_USERS = [
  {
    rank: 4,
    name: "Mahmudullah Riyad",
    points: 2100,
    role: "General",
    change: "up",
    accuracy: "85%",
    exams: 35,
  },
  {
    rank: 5,
    name: "Taskin Ahmed",
    points: 2050,
    role: "Beginner",
    change: "up",
    accuracy: "82%",
    exams: 30,
  },
  {
    rank: 6,
    name: "Mustafizur Rahman",
    points: 1980,
    role: "Bank Pro",
    change: "down",
    accuracy: "78%",
    exams: 40,
  },
  {
    rank: 7,
    name: "Litton Das",
    points: 1950,
    role: "BCS Expert",
    change: "same",
    accuracy: "80%",
    exams: 33,
  },
  {
    rank: 8,
    name: "Mehidy Miraz",
    points: 1900,
    role: "General",
    change: "up",
    accuracy: "89%",
    exams: 28,
  },
  {
    rank: 9,
    name: "Soumya Sarkar",
    points: 1850,
    role: "Beginner",
    change: "down",
    accuracy: "75%",
    exams: 25,
  },
  {
    rank: 10,
    name: "Afif Hossain",
    points: 1820,
    role: "Math Genius",
    change: "same",
    accuracy: "84%",
    exams: 22,
  },
];

// --- Current User Data (Sticky Bottom) ---
const CURRENT_USER = {
  rank: 42,
  name: "You",
  points: 1250,
  change: "up",
  accuracy: "76%",
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans pb-32">
      {/* --- 1. Hero Section --- */}
      <section className="relative pt-12 pb-32 px-4 text-center border-b bg-muted/30">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="container mx-auto">
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            <Trophy className="w-3 h-3 mr-2 text-yellow-500" /> Weekly
            Championship
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Global <span className="text-primary">Leaderboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            সেরা মেধাবীদের তালিকায় নিজের নাম দেখুন। প্রতিটি পরীক্ষায় ভালো করলে
            আপনার র‍্যাংক বাড়বে।
          </p>
        </div>
      </section>

      {/* --- 2. Podium Section (Top 3) --- */}
      <div className="container mx-auto px-4 -mt-20 relative z-10 mb-16">
        <div className="flex flex-col md:flex-row justify-center items-end gap-6">
          {/* Rank 2 */}
          <Card className="w-full md:w-1/3 order-2 md:order-1 bg-card border-border shadow-lg hover:shadow-xl transition-all animate-in slide-in-from-bottom-8 duration-700">
            <CardHeader className="text-center pb-2 relative">
              <div className="mx-auto -mt-14 mb-3 relative w-fit">
                <Avatar className="w-20 h-20 border-4 border-slate-300 shadow-md">
                  <AvatarImage src={TOP_USERS[1].avatar} />
                  <AvatarFallback>TI</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-200 text-slate-800 hover:bg-slate-300 border-white px-3 shadow-sm">
                  #2
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold">
                {TOP_USERS[1].name}
              </CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="text-xs font-normal bg-muted/50"
                >
                  {TOP_USERS[1].role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-6 space-y-4">
              <div className="text-3xl font-black text-foreground tabular-nums">
                {TOP_USERS[1].points}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-4">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">
                    {TOP_USERS[1].exams}
                  </span>{" "}
                  Exams
                </div>
                <div className="flex flex-col border-l">
                  <span className="font-bold text-foreground">
                    {TOP_USERS[1].accuracy}
                  </span>{" "}
                  Accuracy
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank 1 (Winner) */}
          <Card className="w-full md:w-1/3 order-1 md:order-2 bg-gradient-to-b from-primary/10 to-card border-primary/30 shadow-2xl ring-1 ring-primary/20 z-20 pb-4 animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="text-center pb-2 pt-8 relative">
              <div className="mx-auto -mt-24 mb-4 relative w-fit">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-bounce">
                  <Crown
                    size={40}
                    className="text-yellow-500 fill-yellow-500"
                  />
                </div>
                <Avatar className="w-28 h-28 border-4 border-yellow-400 shadow-xl">
                  <AvatarImage src={TOP_USERS[0].avatar} />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-950 hover:bg-yellow-500 border-white px-4 py-1 shadow-sm text-sm">
                  Champion
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold">
                {TOP_USERS[0].name}
              </CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge variant="default" className="text-xs font-medium">
                  {TOP_USERS[0].role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-8 space-y-4">
              <div className="text-5xl font-black text-primary tabular-nums tracking-tight">
                {TOP_USERS[0].points}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground border-t border-primary/20 pt-4">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground text-lg">
                    {TOP_USERS[0].exams}
                  </span>{" "}
                  Exams
                </div>
                <div className="flex flex-col border-l border-primary/20">
                  <span className="font-bold text-foreground text-lg">
                    {TOP_USERS[0].accuracy}
                  </span>{" "}
                  Accuracy
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank 3 */}
          <Card className="w-full md:w-1/3 order-3 bg-card border-border shadow-lg hover:shadow-xl transition-all animate-in slide-in-from-bottom-8 duration-1000">
            <CardHeader className="text-center pb-2 relative">
              <div className="mx-auto -mt-14 mb-3 relative w-fit">
                <Avatar className="w-20 h-20 border-4 border-orange-400 shadow-md">
                  <AvatarImage src={TOP_USERS[2].avatar} />
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-orange-100 text-orange-700 hover:bg-orange-200 border-white px-3 shadow-sm">
                  #3
                </Badge>
              </div>
              <CardTitle className="text-lg font-bold">
                {TOP_USERS[2].name}
              </CardTitle>
              <div className="flex justify-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className="text-xs font-normal bg-muted/50"
                >
                  {TOP_USERS[2].role}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-center pb-6 space-y-4">
              <div className="text-3xl font-black text-foreground tabular-nums">
                {TOP_USERS[2].points}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground border-t pt-4">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">
                    {TOP_USERS[2].exams}
                  </span>{" "}
                  Exams
                </div>
                <div className="flex flex-col border-l">
                  <span className="font-bold text-foreground">
                    {TOP_USERS[2].accuracy}
                  </span>{" "}
                  Accuracy
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- 3. Filters & Full List --- */}
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 bg-card p-4 rounded-xl border shadow-sm">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="নাম দিয়ে খুঁজুন..."
              className="pl-9 bg-background"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select defaultValue="weekly">
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="bcs">
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bcs">BCS</SelectItem>
                <SelectItem value="bank">Bank Job</SelectItem>
                <SelectItem value="primary">Primary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* The List */}
        <Card className="overflow-hidden border shadow-sm">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[80px] text-center font-bold">
                  Rank
                </TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="hidden md:table-cell text-center">
                  Category
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Accuracy
                </TableHead>
                <TableHead className="hidden sm:table-cell text-center">
                  Exams
                </TableHead>
                <TableHead className="text-right font-bold pr-6">
                  Points
                </TableHead>
                <TableHead className="w-[80px] text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTHER_USERS.map((user) => (
                <TableRow
                  key={user.rank}
                  className="group hover:bg-muted/40 transition-colors h-16"
                >
                  <TableCell className="text-center font-medium text-muted-foreground">
                    #{user.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border bg-muted">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground md:hidden">
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-center">
                    <Badge
                      variant="outline"
                      className="font-normal text-xs bg-muted/50"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{user.accuracy}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium">{user.exams}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold tabular-nums pr-6 text-lg">
                    {user.points}
                  </TableCell>
                  <TableCell className="text-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {user.change === "up" && (
                            <div className="p-1 rounded bg-green-500/10">
                              <ArrowUp className="w-4 h-4 text-green-600" />
                            </div>
                          )}
                          {user.change === "down" && (
                            <div className="p-1 rounded bg-red-500/10">
                              <ArrowDown className="w-4 h-4 text-red-500" />
                            </div>
                          )}
                          {user.change === "same" && (
                            <div className="p-1 rounded bg-muted">
                              <Minus className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Rank{" "}
                            {user.change === "up"
                              ? "Improved"
                              : user.change === "down"
                              ? "Dropped"
                              : "Unchanged"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="p-4 border-t bg-muted/5 text-center">
            <Button variant="outline" size="sm" className="w-full sm:w-auto">
              Load more rankings
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

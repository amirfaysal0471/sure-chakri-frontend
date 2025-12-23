"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Clock,
  Users,
  ChevronRight,
  Lock,
  Target,
  Award,
  BookOpen,
  GraduationCap,
  Briefcase,
  Flame,
  CheckCircle2,
  Shield,
  Train,
  Scale,
  School,
  Stethoscope,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- Mock Data: Categories ---
const CATEGORIES = [
  { id: "all", label: "All Exams", icon: Target },
  { id: "bcs", label: "BCS Prelim", icon: GraduationCap },
  { id: "bank", label: "Bank Jobs", icon: Briefcase },
  { id: "primary", label: "Primary Teacher", icon: BookOpen },
  { id: "nsi", label: "NSI & Defences", icon: Shield },
  { id: "railway", label: "Railway", icon: Train },
  { id: "bar", label: "Bar Council", icon: Scale },
  { id: "admission", label: "Varsity Admission", icon: School },
  { id: "medical", label: "Medical", icon: Stethoscope },
];

// --- Mock Data: Exams ---
const EXAMS_DATA = [
  {
    id: 1,
    title: "46th BCS Preliminary Exclusive Model Test",
    category: "bcs",
    status: "live",
    type: "Premium",
    date: "Today",
    time: "06:00 PM",
    participants: 2540,
    marks: 200,
    fee: "৳50",
    tags: ["Negative Marking 0.5", "Full Syllabus"],
  },
  {
    id: 2,
    title: "Bangladesh Bank AD - Math Special",
    category: "bank",
    status: "upcoming",
    type: "Free",
    date: "Tomorrow",
    time: "07:00 PM",
    participants: 1200,
    marks: 100,
    fee: "Free",
    tags: ["Math Only", "Short Techniques"],
  },
  {
    id: 3,
    title: "Primary Assistant Teacher Recruitment",
    category: "primary",
    status: "upcoming",
    type: "Premium",
    date: "28 Dec",
    time: "03:00 PM",
    participants: 3100,
    marks: 80,
    fee: "৳20",
    tags: ["All Subjects", "Live Ranking"],
  },
  {
    id: 4,
    title: "NSI Field Officer General Knowledge",
    category: "nsi",
    status: "closed",
    type: "Free",
    date: "Yesterday",
    time: "Ended",
    participants: 4500,
    marks: 50,
    fee: "Free",
    tags: ["GK", "Current Affairs"],
  },
  {
    id: 5,
    title: "Dhaka University 'Ka' Unit Physics",
    category: "admission",
    status: "live",
    type: "Premium",
    date: "Ends in 2h",
    time: "Ongoing",
    participants: 800,
    marks: 60,
    fee: "৳100",
    tags: ["Physics", "Written + MCQ"],
  },
];

export default function PublicExamsPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredExams = EXAMS_DATA.filter((exam) => {
    const matchesCategory =
      activeCategory === "all" || exam.category === activeCategory;
    const matchesSearch = exam.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* --- 1. Hero Section --- */}
      <section className="bg-muted/30 border-b pt-12 pb-12 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
            <Flame className="w-3 h-3 mr-1" /> Over 50+ Exams Live Today
          </div>

          <h1 className="text-3xl md:text-6xl font-extrabold tracking-tight">
            Find Your <span className="text-primary">Battleground</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            হাজারো শিক্ষার্থীর সাথে প্রতিযোগিতা করুন। নিজের প্রস্তুতি যাচাই করতে
            বেছে নিন আপনার কাঙ্ক্ষিত ক্যাটাগরি।
          </p>

          <div className="relative max-w-xl mx-auto mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search exams (e.g. BCS, Math)..."
                className="pl-10 h-12 rounded-xl bg-background shadow-sm border-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- 2. Category Filter (STATIC - NO OVERLAP) --- */}
      {/* FIX: Removed 'sticky', 'top-x', 'z-x'. Now it flows naturally. */}
      <div className="bg-background border-b shadow-sm py-2">
        <div className="container mx-auto">
          <div className="w-full overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center gap-3 px-4 py-2 min-w-max">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`
                      shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all border select-none
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                          : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                      }
                    `}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- 3. Exam Grid Section --- */}
      <div className="container mx-auto px-4 max-w-7xl mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {activeCategory === "all"
              ? "All Live Exams"
              : CATEGORIES.find((c) => c.id === activeCategory)?.label}
            <Badge variant="secondary" className="ml-2 rounded-full">
              {filteredExams.length}
            </Badge>
          </h2>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Select defaultValue="newest">
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="free">Free First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => (
              <PublicExamCard key={exam.id} exam={exam} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-bold">No Exams Found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category or change your search term.
            </p>
            <Button
              variant="link"
              onClick={() => {
                setActiveCategory("all");
                setSearchTerm("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* --- 4. Call to Action --- */}
      <section className="mt-16 mb-16 container mx-auto px-4 max-w-5xl">
        <div className="bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-background/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-background/10 rounded-full -ml-10 -mb-10 blur-2xl" />

          <h2 className="text-2xl md:text-5xl font-black mb-4 relative z-10">
            Ready to Top the Leaderboard?
          </h2>
          <p className="text-base md:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8 relative z-10">
            Create your free account today and access 50+ free model tests.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Button
              size="lg"
              variant="secondary"
              className="font-bold text-lg px-8 h-12 md:h-14"
              asChild
            >
              <Link href="/register">Register Now - It's Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- Sub-Component: Exam Card ---
function PublicExamCard({ exam }: { exam: any }) {
  const isLive = exam.status === "live";
  const isClosed = exam.status === "closed";

  return (
    <Card
      className={`group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-t-4 ${
        isLive
          ? "border-t-green-500"
          : "border-t-transparent hover:border-t-primary"
      }`}
    >
      <CardHeader className="pb-3 pt-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <Badge
            variant="outline"
            className="uppercase text-[10px] font-bold tracking-wider"
          >
            {exam.category}
          </Badge>
          {isLive ? (
            <Badge className="bg-green-600 hover:bg-green-700 animate-pulse border-none">
              ● LIVE
            </Badge>
          ) : exam.type === "Free" ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Free
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              ৳ Premium
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
          {exam.title}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-3">
          {exam.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="text-[10px] px-2 py-1 bg-muted rounded font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pb-4">
        <Separator className="mb-4" />
        <div className="grid grid-cols-2 gap-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            <span>{isLive ? "Ends Soon" : exam.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span>{exam.participants} Joined</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span>{exam.marks} Marks</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>{exam.fee}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {isLive ? (
          <Button
            className="w-full font-bold bg-green-600 hover:bg-green-700 h-11"
            asChild
          >
            <Link href="/login">
              Enter Exam Hall <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        ) : isClosed ? (
          <Button variant="outline" disabled className="w-full h-11">
            <Lock className="w-4 h-4 mr-2" /> Exam Ended
          </Button>
        ) : (
          <Button variant="default" className="w-full h-11" asChild>
            <Link href="/register">Register Interest</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  RefreshCcw,
  ShieldAlert,
  Trophy,
  Menu,
  X,
  ChevronRight,
  Lightbulb,
  AlertTriangle,
  Zap,
  MousePointerClick,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // --- Scroll Spy Logic ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]");
      let current = "getting-started";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 150) {
          current = section.getAttribute("id") || "getting-started";
        }
      });
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
    setIsSidebarOpen(false);
  };

  const navItems = [
    { id: "getting-started", label: "শুরু করার আগে", icon: BookOpen },
    { id: "strict-timing", label: "সময়ানুবর্তিতা ও নিয়ম", icon: Clock },
    { id: "reset-mechanism", label: "রিসেট বা লেভেল ড্রপ", icon: RefreshCcw },
    { id: "anti-cheating", label: "অ্যান্টি-চিটিং সিস্টেম", icon: ShieldAlert },
    { id: "pro-features", label: "প্রো ফিচারস", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex items-start gap-10 py-10">
        {/* --- Sidebar (Sticky) --- */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-background/95 backdrop-blur border-r p-6 
            transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:border-none lg:bg-transparent lg:p-0 lg:w-64 shrink-0
            ${isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          `}
        >
          <div className="sticky top-24 h-[calc(100vh-8rem)]">
            <ScrollArea className="h-full pr-4">
              <div className="mb-6">
                <h4 className="font-bold text-lg tracking-tight">User Guide</h4>
                <p className="text-sm text-muted-foreground">
                  Sohoj Shikkha Manual
                </p>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-all group
                      ${
                        activeSection === item.id
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }
                    `}
                  >
                    <item.icon
                      size={18}
                      className={
                        activeSection === item.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }
                    />
                    {item.label}
                    {activeSection === item.id && (
                      <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    )}
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h5 className="font-semibold text-sm mb-2">
                    সাহায্য প্রয়োজন?
                  </h5>
                  <p className="text-xs text-muted-foreground mb-3">
                    আমাদের সাপোর্ট টিম ২৪/৭ প্রস্তুত।
                  </p>
                  <Button
                    size="sm"
                    variant="default"
                    className="w-full"
                    asChild
                  >
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 min-w-0 pb-20 space-y-16">
          {/* Header */}
          <div className="space-y-4 border-b pb-8">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-primary/20 text-primary"
              >
                Official Documentation
              </Badge>
              <span className="text-xs text-muted-foreground">
                Updated: Dec 2025
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              Platform Mechanics
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl">
              সহজ শিক্ষা প্ল্যাটফর্মে আপনাকে স্বাগতম। এটি সাধারণ কোনো ওয়েবসাইট
              নয়—এখানে টিকে থাকতে হলে আপনাকে কিছু কড়া নিয়ম বা{" "}
              <strong>"Discipline Protocol"</strong> মেনে চলতে হবে।
            </p>
          </div>

          {/* 1. Getting Started */}
          <section id="getting-started" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                1
              </span>
              শুরু করার আগে
            </h2>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="text-yellow-500" /> আমাদের ফিলোসফি
                </CardTitle>
                <CardDescription>কেন আমাদের নিয়মগুলো এত কড়া?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  চাকরি পাওয়ার জন্য পড়াশোনার চেয়েও বেশি জরুরি হলো{" "}
                  <strong>ধারাবাহিকতা (Consistency)</strong>। আমরা চাই আপনি
                  পরীক্ষার হলের আসল প্রেশারটা ঘরে বসেই অনুভব করুন। তাই আমাদের
                  সিস্টেমে "দেরি করা" বা "অলসতা"র কোনো স্থান নেই।
                </p>
                <Alert className="bg-primary/5 border-primary/20">
                  <Zap className="h-4 w-4" />
                  <AlertTitle>মনে রাখবেন</AlertTitle>
                  <AlertDescription>
                    এখানে একবার ভুল করলে আবার শুরু থেকে শুরু করতে হয়। এটি আপনাকে
                    প্রতিটি পদক্ষেপে সতর্ক রাখবে।
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </section>

          {/* 2. Strict Timing */}
          <section id="strict-timing" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                2
              </span>
              সময়ানুবর্তিতা ও নিয়ম
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="text-orange-500" size={20} /> ফিক্সড
                    শিডিউল
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    পরীক্ষার সময় সার্ভার থেকে নির্ধারিত (যেমন: সন্ধ্যা ৬টা থেকে
                    রাত ১০টা)। এই সময়ের বাইরে প্রশ্নপত্র অ্যাক্সেস করা সম্পূর্ণ
                    অসম্ভব।
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MousePointerClick className="text-red-500" size={20} />{" "}
                    বাটন লক সিস্টেম
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ১০টা বাজার সাথে সাথেই ড্যাশবোর্ডের{" "}
                    <strong>'Start Exam'</strong> বাটনটি অটোমেটিক
                    <Badge variant="secondary" className="mx-1">
                      Disabled
                    </Badge>
                    হয়ে যাবে। পেজ রিফ্রেশ দিলেও আর কাজ হবে না।
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 3. Reset Mechanism */}
          <section id="reset-mechanism" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                3
              </span>
              রিসেট মেকানিজম (Level Drop)
            </h2>

            <div className="bg-muted/50 p-6 rounded-xl border">
              <div className="flex items-start gap-4">
                <div className="bg-background p-3 rounded-full border shadow-sm text-destructive">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">পাস না করলে যা হবে</h3>
                  <p className="text-muted-foreground mb-4">
                    প্রতিটি পরীক্ষায় একটি নির্দিষ্ট <strong>Pass Mark</strong>{" "}
                    থাকে। আপনি যদি সেটি অর্জনে ব্যর্থ হন:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium bg-background p-3 rounded-lg border">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      আপনার বর্তমান লেভেল ০ (শূণ্য) হয়ে যাবে।
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium bg-background p-3 rounded-lg border">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      আগের সব প্রোগ্রেস আর্কাইভ হয়ে যাবে।
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium bg-background p-3 rounded-lg border">
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      আপনাকে আবার লেভেল ১ থেকে যাত্রা শুরু করতে হবে।
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Anti-Cheating */}
          <section id="anti-cheating" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                4
              </span>
              অ্যান্টি-চিটিং সিস্টেম
            </h2>
            <div className="grid gap-4">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>সতর্কতা</AlertTitle>
                <AlertDescription>
                  পরীক্ষা চলাকালীন অন্য ট্যাবে যাওয়া বা স্ক্রিনশট নেওয়া সম্পূর্ণ
                  নিষিদ্ধ।
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">
                      Full Screen Mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                    পরীক্ষা শুরুর সাথে সাথে ব্রাউজার অটোমেটিক ফুল স্ক্রিন মোডে
                    লক হয়ে যাবে।
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">Focus Tracking</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                    আপনি মাউস কার্সার উইন্ডোর বাইরে নিলেই সিস্টেম সেটি ডিটেক্ট
                    করবে এবং ওয়ার্নিং দিবে।
                  </CardContent>
                </Card>
                <Card className="bg-card">
                  <CardHeader className="p-4">
                    <CardTitle className="text-base">
                      Auto Termination
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                    ৩ বারের বেশি নিয়ম ভাঙলে আপনার পরীক্ষা বাতিল বলে গণ্য হবে।
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* 5. Features */}
          <section id="pro-features" className="scroll-mt-32">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold">
                5
              </span>
              প্রো ফিচারস
            </h2>
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl border border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-background rounded-lg shadow-sm">
                  <Trophy className="text-yellow-500" size={24} />
                </div>
                <h3 className="text-xl font-bold">
                  সোশ্যাল অ্যাচিভমেন্ট কার্ড
                </h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                ভালো রেজাল্ট করলে সিস্টেম আপনার জন্য একটি প্রিমিয়াম 'Achievement
                Card' জেনারেট করবে। এতে আপনার র‍্যাংক এবং পার্সেন্টাইল উল্লেখ
                থাকবে, যা আপনি এক ক্লিকে ফেসবুকে শেয়ার করতে পারবেন।
              </p>
              <Button>ডেমো দেখুন</Button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

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
  Lightbulb,
  Zap,
  MousePointerClick,
  CheckCircle2,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // --- Scroll Spy & Progress Logic ---
  useEffect(() => {
    const handleScroll = () => {
      // Spy Logic
      const sections = document.querySelectorAll("section[id]");
      let current = "getting-started";
      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute("id") || "getting-started";
        }
      });
      setActiveSection(current);

      // Progress Logic
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll));
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
    { id: "strict-timing", label: "সময়ানুবর্তিতা", icon: Clock },
    { id: "reset-mechanism", label: "লেভেল ড্রপ", icon: RefreshCcw },
    { id: "anti-cheating", label: "অ্যান্টি-চিটিং", icon: ShieldAlert },
    { id: "pro-features", label: "প্রো ফিচারস", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-foreground relative">
      {/* --- Top Reading Progress Bar --- */}
      <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-slate-200 dark:bg-slate-800">
        <div
          className="h-full bg-primary transition-all duration-150 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Mobile Menu Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50 animate-in zoom-in duration-300">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl bg-primary hover:bg-primary/90 transition-transform hover:scale-110"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      <div className="container mx-auto px-4 lg:px-8 max-w-7xl flex items-start gap-12 py-12">
        {/* --- Sidebar (Sticky) --- */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-background/80 backdrop-blur-md border-r p-6 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:block lg:border-none lg:bg-transparent lg:p-0 lg:w-64 shrink-0",
            isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
          )}
        >
          <div className="sticky top-24">
            <div className="mb-8 pl-2">
              <h4 className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                User Guide
              </h4>
              <p className="text-xs font-medium text-muted-foreground mt-1 uppercase tracking-widest">
                System Manual v2.0
              </p>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative overflow-hidden",
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                      : "text-muted-foreground hover:bg-white hover:shadow-sm dark:hover:bg-slate-900"
                  )}
                >
                  <item.icon
                    size={18}
                    className={cn(
                      "transition-colors",
                      activeSection === item.id
                        ? "text-white"
                        : "group-hover:text-primary"
                    )}
                  />
                  {item.label}
                  {activeSection === item.id && (
                    <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </button>
              ))}
            </nav>

            {/* Quick Support Box */}
            <div className="mt-10 p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/20 transition-all" />
              <h5 className="font-bold mb-1 relative z-10">সমস্যা হচ্ছে?</h5>
              <p className="text-xs text-slate-300 mb-4 relative z-10 leading-relaxed">
                যেকোনো টেকনিক্যাল সমস্যায় আমাদের সাপোর্ট টিম পাশে আছে।
              </p>
              <Button
                size="sm"
                variant="secondary"
                className="w-full font-bold shadow-lg"
                asChild
              >
                <Link href="/contact">Get Help</Link>
              </Button>
            </div>
          </div>
        </aside>

        {/* --- Main Content --- */}
        <main className="flex-1 min-w-0 pb-32 space-y-20">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 lg:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/30 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-4">
              <Badge className="bg-white/10 hover:bg-white/20 text-white border-0 backdrop-blur-md px-3 py-1">
                Official Documentation
              </Badge>
              <h1 className="text-3xl lg:text-5xl font-black tracking-tight leading-tight">
                Platform <span className="text-primary">Mechanics</span>
              </h1>
              <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
                সহজ শিক্ষা প্ল্যাটফর্মে আপনাকে স্বাগতম। এখানে টিকে থাকতে হলে
                আপনাকে কিছু কড়া নিয়ম বা <strong>"Discipline Protocol"</strong>{" "}
                মেনে চলতে হবে।
              </p>
            </div>
          </div>

          {/* 1. Getting Started */}
          <section id="getting-started" className="scroll-mt-32">
            <SectionHeader number="01" title="আমাদের ফিলোসফি" />

            <div className="group relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-1 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-card rounded-xl p-6 lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 shadow-inner">
                    <Lightbulb size={28} strokeWidth={2.5} />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold">কেন এত কঠোর নিয়ম?</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      চাকরি পাওয়ার জন্য পড়াশোনার চেয়েও বেশি জরুরি হলো{" "}
                      <strong>ধারাবাহিকতা (Consistency)</strong>। আমরা চাই আপনি
                      পরীক্ষার হলের আসল প্রেশারটা ঘরে বসেই অনুভব করুন। তাই
                      আমাদের সিস্টেমে "দেরি করা" বা "অলসতা"র কোনো স্থান নেই।
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400">
                  <Zap className="shrink-0 h-5 w-5 animate-pulse" />
                  <p className="text-sm font-semibold">
                    সতর্কতা: এখানে একবার ভুল করলে আবার শুরু থেকে শুরু করতে হয়।
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Strict Timing */}
          <section id="strict-timing" className="scroll-mt-32">
            <SectionHeader number="02" title="সময় ও নিয়ম" />

            <div className="grid md:grid-cols-2 gap-6">
              <InteractiveCard
                icon={<Clock size={24} />}
                iconColor="text-orange-500"
                bgIconColor="bg-orange-50 dark:bg-orange-900/20"
                title="ফিক্সড শিডিউল"
                description="পরীক্ষার সময় সার্ভার থেকে নির্ধারিত (যেমন: সন্ধ্যা ৬টা - ১০টা)। এই সময়ের বাইরে প্রশ্নপত্র অ্যাক্সেস করা সম্পূর্ণ অসম্ভব।"
              />
              <InteractiveCard
                icon={<MousePointerClick size={24} />}
                iconColor="text-red-500"
                bgIconColor="bg-red-50 dark:bg-red-900/20"
                title="বাটন লক সিস্টেম"
                description="১০টা বাজার সাথে সাথেই 'Start Exam' বাটনটি অটোমেটিক Disabled হয়ে যাবে। পেজ রিফ্রেশ দিলেও আর কাজ হবে না।"
              />
            </div>
          </section>

          {/* 3. Reset Mechanism (Visual Stepper) */}
          <section id="reset-mechanism" className="scroll-mt-32">
            <SectionHeader number="03" title="লেভেল ড্রপ সিস্টেম" />

            <div className="rounded-3xl border bg-card p-8 shadow-sm relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                  <RefreshCcw size={24} />
                </div>
                <h3 className="text-xl font-bold">ফেইল করলে যা হবে</h3>
              </div>

              <div className="space-y-0 relative">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-6 w-0.5 bg-slate-200 dark:bg-slate-800" />

                {[
                  {
                    title: "লেভেল রিসেট",
                    desc: "আপনার বর্তমান লেভেল ০ (শূণ্য) হয়ে যাবে।",
                  },
                  {
                    title: "ডাটা আর্কাইভ",
                    desc: "আগের সব প্রোগ্রেস এবং মেডেল আর্কাইভ হয়ে যাবে।",
                  },
                  {
                    title: "নতুন যাত্রা",
                    desc: "আপনাকে আবার লেভেল ১ থেকে কঠিন যাত্রা শুরু করতে হবে।",
                  },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="relative flex gap-6 pb-8 last:pb-0 group"
                  >
                    <div className="relative z-10 w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-4 border-red-50 group-hover:border-red-100 transition-colors flex items-center justify-center shrink-0 shadow-sm">
                      <div className="w-3 h-3 rounded-full bg-red-500 group-hover:scale-125 transition-transform" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-bold text-foreground group-hover:text-red-600 transition-colors">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 4. Anti-Cheating */}
          <section id="anti-cheating" className="scroll-mt-32">
            <SectionHeader number="04" title="অ্যান্টি-চিটিং" />

            <div className="grid md:grid-cols-3 gap-5">
              {[
                {
                  title: "Full Screen",
                  desc: "পরীক্ষা শুরুর সাথে সাথে ব্রাউজার লক হয়ে যাবে।",
                },
                {
                  title: "Focus Tracking",
                  desc: "ট্যাব পরিবর্তন বা মিনিমাইজ করলেই ওয়ার্নিং।",
                },
                {
                  title: "Auto Terminate",
                  desc: "৩ বারের বেশি নিয়ম ভাঙলে পরীক্ষা বাতিল।",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-900 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                >
                  <div className="w-12 h-12 mx-auto bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600 dark:text-slate-400">
                    <ShieldAlert size={20} />
                  </div>
                  <h4 className="font-bold mb-2">{item.title}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Features (Mockup) */}
          <section id="pro-features" className="scroll-mt-32">
            <SectionHeader number="05" title="সোশ্যাল অ্যাচিভমেন্ট" />

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-violet-600 text-white p-8 lg:p-12 shadow-2xl">
              <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
                <div className="space-y-6">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                    Premium Feature
                  </Badge>
                  <h3 className="text-3xl font-black">
                    আপনার সাফল্য, <br />
                    বিশ্বকে জানান।
                  </h3>
                  <p className="text-primary-foreground/80 leading-relaxed">
                    ভালো রেজাল্ট করলে সিস্টেম আপনার জন্য একটি প্রিমিয়াম
                    'Achievement Card' জেনারেট করবে। এতে আপনার র‍্যাংক এবং
                    পার্সেন্টাইল উল্লেখ থাকবে।
                  </p>
                  <Button variant="secondary" className="font-bold gap-2">
                    <Share2 size={16} /> শেয়ার করুন
                  </Button>
                </div>

                {/* Mockup Card */}
                <div className="relative group perspective-1000">
                  <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform group-hover:scale-110 transition-transform duration-700" />
                  <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl transform transition-transform duration-500 group-hover:rotate-y-12 group-hover:rotate-x-12 shadow-2xl">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wider text-white/60">
                          Weekly Exam
                        </p>
                        <h4 className="text-xl font-bold">Top Performer</h4>
                      </div>
                      <Trophy
                        className="text-yellow-400 drop-shadow-lg"
                        size={32}
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full w-[92%] bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Score: 46/50</span>
                        <span className="text-yellow-300">Top 5%</span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs text-white/50">
                      <CheckCircle2 size={12} /> Verified by Sohoj Shikkha
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Helper Component for Section Headers
function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-5xl font-black text-slate-200 dark:text-slate-800 select-none">
        {number}
      </span>
      <h2 className="text-2xl font-bold text-foreground relative">
        {title}
        <span className="absolute -bottom-2 left-0 w-10 h-1 bg-primary rounded-full" />
      </h2>
    </div>
  );
}

// Helper Component for Interactive Cards
function InteractiveCard({
  icon,
  iconColor,
  bgIconColor,
  title,
  description,
}: any) {
  return (
    <Card className="border-l-4 border-l-transparent hover:border-l-primary transition-all duration-300 hover:shadow-lg group">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className={cn("p-2 rounded-lg transition-colors", bgIconColor)}>
            <div
              className={cn(
                "transition-transform group-hover:scale-110 duration-300",
                iconColor
              )}
            >
              {icon}
            </div>
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

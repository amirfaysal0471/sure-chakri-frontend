"use client";

import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock,
  MessageCircle,
  Facebook,
  Linkedin,
  Youtube,
  ArrowRight,
  LayoutGrid,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactPage() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log("Message sent!");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* --- 1. Hero Section (Uses Default Muted/Accent Colors) --- */}
      <section className="relative bg-muted/30 pt-20 pb-40 px-4 lg:px-8 overflow-hidden border-b">
        {/* Background Pattern using primary color with low opacity */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

        <div className="container mx-auto text-center relative z-10">
          <Badge
            variant="outline"
            className="mb-6 px-4 py-1.5 border-primary/20 bg-background text-primary backdrop-blur-sm"
          >
            Dedicated 24/7 Support
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            We’d love to hear from <br className="hidden md:block" />
            <span className="text-primary">Sohoj Shikkha Students</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            আপনার বিসিএস বা ব্যাংক জব প্রস্তুতির যাত্রায় কোনো বাধা আসলে আমাদের
            জানান। আমরা সাধারণত{" "}
            <span className="text-foreground font-semibold">
              ১ ঘণ্টার মধ্যে
            </span>{" "}
            রিপ্লাই দিয়ে থাকি।
          </p>
        </div>
      </section>

      {/* --- 2. Floating Contact Wrapper --- */}
      <div className="container mx-auto px-4 lg:px-8 -mt-24 relative z-20 pb-20">
        <div className="grid lg:grid-cols-5 bg-card rounded-[2rem] shadow-2xl overflow-hidden border border-border">
          {/* --- Left Side: Info Panel (Uses Primary Color) --- */}
          <div className="lg:col-span-2 bg-primary text-primary-foreground p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Decor Circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-foreground/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-foreground/5 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

            <div>
              <h3 className="text-3xl font-bold mb-2">Contact Info</h3>
              <p className="text-primary-foreground/80 mb-10">
                যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন।
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-lg backdrop-blur-md">
                    <Phone className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/60 font-medium uppercase tracking-wider">
                      Call Us
                    </p>
                    <p className="text-lg font-bold mt-0.5">+880 1712-345678</p>
                    <p className="text-xs text-primary-foreground/60">
                      Sat-Thu (10am-8pm)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-lg backdrop-blur-md">
                    <Mail className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/60 font-medium uppercase tracking-wider">
                      Email Us
                    </p>
                    <p className="text-lg font-bold mt-0.5">
                      support@sohojshikkha.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/10 p-3 rounded-lg backdrop-blur-md">
                    <MapPin className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-foreground/60 font-medium uppercase tracking-wider">
                      Visit Us
                    </p>
                    <p className="text-lg font-bold mt-0.5 leading-snug">
                      Level 4, Khan Plaza,
                      <br />
                      Mirpur-10, Dhaka
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-12">
              <p className="text-sm text-primary-foreground/60 mb-4 font-medium">
                Follow us on social media
              </p>
              <div className="flex gap-3">
                {[Facebook, Linkedin, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="p-2 bg-primary-foreground/10 rounded-full hover:bg-primary-foreground/20 transition-all text-primary-foreground"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* --- Right Side: The Form (Uses Card Background) --- */}
          <div className="lg:col-span-3 p-10 lg:p-14 bg-card">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MessageCircle className="text-primary" /> Send a Message
              </h2>
              <p className="text-muted-foreground mt-2 text-sm">
                ফর্মটি পূরণ করুন। সঠিক ডিপার্টমেন্ট সিলেক্ট করলে দ্রুত সমাধান
                পাবেন।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="017XXXXXXXX"
                    className="bg-muted/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    className="bg-muted/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept">Department</Label>
                  <Select>
                    <SelectTrigger className="bg-muted/30">
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="billing">Billing & Payment</SelectItem>
                      <SelectItem value="exam">Exam Related</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="বিস্তারিত লিখুন..."
                  className="min-h-[150px] resize-none bg-muted/30"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto font-bold"
              >
                Send Message <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>

        {/* --- 3. FAQ Section --- */}
        <div className="max-w-3xl mx-auto mt-24">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mt-2">
              সাধারণ প্রশ্নের উত্তরগুলো জেনে নিন
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {[
              "পরীক্ষা মিস করলে কি পরে দেওয়া যাবে?",
              "পেমেন্ট করার নিয়ম কি?",
              "পাসওয়ার্ড ভুলে গেলে কি করব?",
            ].map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Sohoj Shikkha-তে আমরা ডিসিপ্লিন মেইনটেইন করি। বিস্তারিত জানতে
                  গাইডলাইন দেখুন। আমাদের সাপোর্ট টিম সবসময় প্রস্তুত আপনাকে
                  সাহায্য করার জন্য।
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Turnstile } from "@marsidev/react-turnstile";
import {
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Facebook,
  Linkedin,
  Youtube,
  Send,
  Loader2,
  User,
  HelpCircle,
  Clock,
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

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState("support");
  const [token, setToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!token) {
      toast.error("নিরাপত্তার স্বার্থে দয়া করে ক্যাপচাটি পূরণ করুন।");
      return;
    }

    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      message: formData.get("message"),
      department: department,
      token: token,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      toast.success("আপনার বার্তা সফলভাবে পাঠানো হয়েছে!");
      form.reset();
      setDepartment("support");
      setToken(null);
    } catch (error: any) {
      toast.error("দুঃখিত, বার্তাটি পাঠানো যায়নি। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 font-sans selection:bg-primary/20">
      {/* --- Background Elements --- */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      <div className="fixed left-0 top-0 -z-10 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px]" />
      <div className="fixed right-0 bottom-0 -z-10 h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-[100px]" />

      {/* --- Header Section --- */}
      <section className="pt-20 pb-32 px-4 text-center relative overflow-hidden">
        <div className="container mx-auto max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-6 px-4 py-1.5 text-sm font-medium bg-white shadow-sm border text-primary"
          >
            ✨ 24/7 Dedicated Support
          </Badge>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Get in touch with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Sohoj Shikkha Team
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            আপনার বিসিএস বা ব্যাংক জব প্রস্তুতির যাত্রায় কোনো বাধা আসলে আমাদের
            জানান। আমরা সাধারণত{" "}
            <span className="font-semibold text-slate-900">১ ঘণ্টার মধ্যে</span>{" "}
            উত্তর দিয়ে থাকি।
          </p>
        </div>
      </section>

      {/* --- Main Content Wrapper --- */}
      <div className="container mx-auto px-4 lg:px-8 -mt-20 pb-24 relative z-10">
        <div className="grid lg:grid-cols-12 gap-0 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5">
          {/* --- Left Side: Contact Information (5 Columns) --- */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-10 lg:p-14 flex flex-col justify-between relative overflow-hidden">
            {/* Decor Patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div>
              <h3 className="text-3xl font-bold mb-2">Contact Info</h3>
              <p className="text-slate-300 mb-12 text-lg">
                সরাসরি কথা বলতে চান? যোগাযোগ করুন।
              </p>

              <div className="space-y-8">
                <InfoItem
                  icon={Phone}
                  label="Call Us Now"
                  value="+880 1712-345678"
                  sub="Sat-Thu (10am - 8pm)"
                />
                <InfoItem
                  icon={Mail}
                  label="Email Support"
                  value="support@sohojshikkha.com"
                  sub="We reply within 1 hour"
                />
                <InfoItem
                  icon={MapPin}
                  label="Visit Our Office"
                  value="Mirpur-10, Dhaka"
                  sub="Level 4, Khan Plaza"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-16">
              <p className="text-sm text-slate-400 mb-4 font-medium uppercase tracking-wider">
                Follow us
              </p>
              <div className="flex gap-4">
                <SocialLink href="#" icon={Facebook} />
                <SocialLink href="#" icon={Linkedin} />
                <SocialLink href="#" icon={Youtube} />
              </div>
            </div>
          </div>

          {/* --- Right Side: The Form (7 Columns) --- */}
          <div className="lg:col-span-7 p-8 md:p-14 bg-white">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-3">
                <MessageSquare className="text-primary w-8 h-8" />
                Send us a Message
              </h2>
              <p className="text-slate-500 mt-2">
                ফর্মটি পূরণ করুন। সঠিক ডিপার্টমেন্ট সিলেক্ট করলে দ্রুত সমাধান
                পাবেন।
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="017XXXXXXXX"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="hello@example.com"
                      className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all h-11"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dept" className="text-slate-700 font-medium">
                    Department
                  </Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-50 border-slate-200 focus:bg-white h-11">
                      <SelectValue placeholder="Select Topic" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="support">
                        🛠️ Technical Support
                      </SelectItem>
                      <SelectItem value="billing">
                        💳 Billing & Payment
                      </SelectItem>
                      <SelectItem value="exam">📝 Exam Related</SelectItem>
                      <SelectItem value="general">
                        👋 General Inquiry
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-slate-700 font-medium">
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="আপনার সমস্যা বা প্রশ্ন বিস্তারিত লিখুন..."
                  className="min-h-[160px] bg-slate-50 border-slate-200 focus:bg-white transition-all resize-none p-4"
                  required
                />
              </div>

              {/* Turnstile Widget Box */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-center md:justify-start">
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                  onSuccess={(token) => setToken(token)}
                  onError={() => toast.error("Security check failed")}
                  options={{
                    theme: "light",
                    size: "flexible",
                  }}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" /> Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* --- FAQ Section --- */}
        <div className="max-w-3xl mx-auto mt-24 px-4">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 text-slate-500 border-slate-300"
            >
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-600 mt-2">
              সচরাচর জানতে চাওয়া প্রশ্নগুলোর উত্তর
            </p>
          </div>

          <div className="grid gap-4">
            <FaqItem
              question="পরীক্ষা মিস করলে কি পরে দেওয়া যাবে?"
              answer="হ্যাঁ, আর্কাইভ সেকশনে গিয়ে আপনি যেকোনো সময় পুরোনো পরীক্ষাগুলো দিতে পারবেন। তবে লাইভ পরীক্ষার মেরিট লিস্টে নাম আসবে না।"
            />
            <FaqItem
              question="পেমেন্ট করার পর একাউন্ট অ্যাক্টিভ হতে কতক্ষণ লাগে?"
              answer="বিকাশ বা নগদে পেমেন্ট করার সাথে সাথেই একাউন্ট অটোমেটিক অ্যাক্টিভ হয়ে যায়। কোনো সমস্যা হলে সাপোর্টে কল করুন।"
            />
            <FaqItem
              question="পাসওয়ার্ড ভুলে গেলে কি করব?"
              answer="লগইন পেজে 'Forgot Password' এ ক্লিক করুন। আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হবে।"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Reusable Components for Cleaner Code ---

function InfoItem({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-3.5 bg-white/10 rounded-2xl group-hover:bg-white/20 transition-all backdrop-blur-sm border border-white/5">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-lg md:text-xl font-bold text-white leading-tight">
          {value}
        </p>
        <p className="text-sm text-slate-400 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

function SocialLink({ href, icon: Icon }: any) {
  return (
    <a
      href={href}
      className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-slate-900 hover:scale-110 transition-all duration-300"
    >
      <Icon size={20} />
    </a>
  );
}

function FaqItem({ question, answer }: any) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden"
    >
      <AccordionItem value="item-1" className="border-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-50 transition-colors text-slate-800 font-medium text-left">
          <div className="flex gap-3 items-center">
            <HelpCircle className="w-5 h-5 text-primary/60" />
            {question}
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-6 pt-2 text-slate-600 leading-relaxed pl-14">
          {answer}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

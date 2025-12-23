"use client";

import Link from "next/link";
import {
  LayoutGrid,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
  MapPin,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const FOOTER_LINKS = [
  {
    title: "Platform",
    links: [
      { name: "Live Exams", href: "/exams/live" },
      { name: "Archive Questions", href: "/exams/archive" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Pricing Plans", href: "/pricing" },
    ],
  },
  {
    title: "Categories",
    links: [
      { name: "BCS Preparation", href: "/exams/bcs" },
      { name: "Bank Job", href: "/exams/bank" },
      { name: "Primary & NTRCA", href: "/exams/primary" },
      { name: "Job Solutions", href: "/exams/job-solution" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "PDF Notes", href: "/resources/notes" },
      { name: "Job Circulars", href: "/circulars" },
      { name: "Success Stories", href: "/stories" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact Support", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://youtube.com", label: "Youtube" },
  { icon: Linkedin, href: "https://linkedin.com", label: "Linkedin" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-muted/20 border-t pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          {/* --- Brand Section (Width: 2 Cols) --- */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
                <LayoutGrid className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Sohoj Shikkha
              </span>
            </Link>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
              বাংলাদেশের সবচেয়ে নির্ভরযোগ্য অনলাইন এক্সাম প্ল্যাটফর্ম। বিসিএস,
              ব্যাংক ও সরকারি চাকরির প্রস্তুতির জন্য আপনার বিশ্বস্ত সঙ্গী।
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Mail size={16} /> support@surechakri.com
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
                <Phone size={16} /> +880 123 456 789
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin size={16} /> Dhaka, Bangladesh
              </div>
            </div>
          </div>

          {/* --- Links Sections (Width: 4 Cols distributed) --- */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="flex flex-col gap-5">
              <h3 className="font-bold text-foreground text-base">
                {section.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[14px] font-medium text-muted-foreground hover:text-primary hover:translate-x-1 transition-all inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* --- Newsletter & Bottom Bar --- */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} SureChakri Ltd. All rights reserved.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-background border hover:border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

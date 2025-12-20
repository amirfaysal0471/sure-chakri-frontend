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
} from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "OCR Scanner", href: "/features/ocr" },
      { name: "AI Solver", href: "/features/survey" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/docs" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "Linkedin" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20">
                <LayoutGrid className="h-6 w-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                SureChakri
              </span>
            </Link>
            <p className="text-muted-foreground text-[15px] leading-relaxed max-w-sm">
              SureChakri helps you streamline your job preparation with
              AI-powered tools like Smart OCR and Survey Solvers. Your partner
              in career growth.
            </p>
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-full border border-border hover:bg-primary hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {FOOTER_LINKS.map((section) => (
            <div key={section.title} className="flex flex-col gap-5">
              <h3 className="font-bold text-base">{section.title}</h3>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter / Contact Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail size={16} className="text-primary" />
              <span>support@surechakri.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={16} className="text-primary" />
              <span>+880 123 456 789</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground order-last md:order-none">
            © {new Date().getFullYear()} SureChakri Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

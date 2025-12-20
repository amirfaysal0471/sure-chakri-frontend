"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Monitor,
  Zap,
  BookOpen,
  Loader2,
  LayoutGrid,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// --- Navigation Config ---
const NAV_LINKS = [
  { title: "Home", path: "/" },
  {
    title: "Features",
    path: "#",
    isDropdown: true,
    subItems: [
      { title: "Smart OCR", path: "/features/ocr", icon: Monitor },
      { title: "AI Survey", path: "/features/survey", icon: Zap },
      { title: "Context", path: "/features/memory", icon: BookOpen },
    ],
  },
  { title: "Pricing", path: "/pricing" },
  { title: "Guide", path: "/docs" },
  { title: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  const { user, isLoading } = { user: null, isLoading: false }; // Demo Auth

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 transition-transform group-hover:scale-105">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">SureChakri</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1 ">
          {NAV_LINKS.map((link) => (
            <div
              key={link.title}
              className="relative group flex items-center h-16  "
            >
              {link.isDropdown ? (
                <>
                  <button className="px-3 py-2 text-md font-medium text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    {link.title}
                    <ChevronDown
                      size={14}
                      className="group-hover:rotate-180 transition-transform duration-200 "
                    />
                  </button>
                  {/* Dropdown UI */}
                  <div className="absolute top-[60px] left-0 w-56 bg-popover border border-border rounded-xl shadow-xl p-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-50">
                    {link.subItems?.map((sub) => (
                      <Link
                        key={sub.title}
                        href={sub.path}
                        className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent transition-colors"
                      >
                        <sub.icon size={16} className="text-muted-foreground" />
                        <span className="font-medium">{sub.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.path}
                  className={cn(
                    "px-3 py-2 text-md font-medium transition-colors",
                    pathname === link.path
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.title}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <Loader2
                className="animate-spin text-muted-foreground"
                size={18}
              />
            ) : user ? (
              <Link
                href="/dashboard"
                className="h-9 w-9 rounded-full bg-accent border border-border overflow-hidden hover:opacity-80 transition-opacity"
              />
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-md font-semibold"
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="rounded-full px-5 font-semibold shadow-sm cursor-pointer text-md"
                >
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </Button>
        </div>
      </div>

      {/* --- Floating Mobile Menu (Agger Design) --- */}
      {isOpen && (
        <div className="absolute top-16 right-4 w-[280px] bg-background border border-border rounded-2xl shadow-2xl p-4 flex flex-col z-50 md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.title}
                href={link.path}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-xl transition-colors",
                  pathname === link.path
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                )}
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <div className="h-px bg-border my-4" />
          <Button className="w-full rounded-xl py-5 font-bold text-sm shadow-md">
            Join SureChakri
          </Button>
        </div>
      )}
    </nav>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutGrid,
  Loader2,
  LogOut,
  User as UserIcon,
} from "lucide-react";
// 1. signOut ইম্পোর্ট করুন
import { useSession, signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/app/components/auth/login-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// 2. Dropdown কম্পোনেন্টগুলো ইম্পোর্ট করুন
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// --- Navigation Config ---
const NAV_LINKS = [
  { title: "Home", path: "/" },
  // { title: "Exams", path: "/exams" },
  { title: "Schedule", path: "/schedule" },
  { title: "Leaderboard", path: "/leaderboard" },
  { title: "Guide", path: "/docs" },
  { title: "Pricing", path: "/pricing" },
  { title: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";

  // Close menu on route change
  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 transition-transform group-hover:scale-105">
            <LayoutGrid className="h-5 w-5 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Sohoj Shikkha
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <div
              key={link.title}
              className="relative group flex items-center h-16"
            >
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
              // --- 3. Desktop Dropdown Menu ---
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full cursor-pointer"
                  >
                    <Avatar className="h-9 w-9 border border-border">
                      <AvatarImage
                        src={user.image || "https://github.com/shadcn.png"}
                        alt={user.name || "User"}
                      />
                      <AvatarFallback>
                        {user.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutGrid className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer focus:text-red-600"
                    onClick={() => signOut({ callbackUrl: "/" })}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // --- Join Now Button ---
              <LoginModal>
                <Button
                  size="sm"
                  className="rounded-full px-5 font-semibold shadow-sm cursor-pointer text-md transition-all hover:scale-105"
                >
                  Join Now
                </Button>
              </LoginModal>
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

      {/* --- Floating Mobile Menu --- */}
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

          {/* Mobile Actions */}
          <div className="flex flex-col gap-3">
            {user ? (
              // --- 4. Mobile Dashboard with Profile Info ---
              <div className="space-y-3">
                {/* User Info Header */}
                <div className="flex items-center gap-3 px-2 py-2 bg-muted/50 rounded-xl">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user.image || "https://github.com/shadcn.png"}
                      alt={user.name || "User"}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold truncate max-w-[150px]">
                      {user.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {user.email}
                    </span>
                  </div>
                </div>

                <Link href="/dashboard" className="block">
                  <Button
                    className="w-full justify-start gap-2"
                    variant="default"
                  >
                    <LayoutGrid size={18} /> Dashboard
                  </Button>
                </Link>

                {/* Mobile Logout Button */}
                <Button
                  className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                  variant="outline"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut size={18} /> Log out
                </Button>
              </div>
            ) : (
              <LoginModal>
                <Button className="w-full rounded-xl py-5 font-bold text-sm shadow-md">
                  Join Sohoj Shikkha
                </Button>
              </LoginModal>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

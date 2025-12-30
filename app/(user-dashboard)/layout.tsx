"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Bell,
  Menu,
  LogOut,
  Loader2,
  BookOpen, // Exams এর জন্য
  CalendarDays, // Routine এর জন্য
  Trophy, // Results এর জন্য
  UserCircle, // Profile এর জন্য
  Settings, // Settings এর জন্য (অপশনাল)
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// 🔥 Project Aligned Navigation Items
const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/user-dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Live Exams",
    href: "/user-dashboard/exams",
    icon: BookOpen,
  },
  {
    label: "My Routine",
    href: "/user-dashboard/routine",
    icon: CalendarDays,
  },
  {
    label: "Results & Stats",
    href: "/user-dashboard/results",
    icon: Trophy,
  },
  {
    label: "My Profile",
    href: "/user-dashboard/profile",
    icon: UserCircle,
  },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r sticky top-0 h-screen z-50">
        {/* Logo Section */}
        <div className="flex h-16 items-center px-6 border-b shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary"
          >
            <div className="size-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-sm font-black">
              SC
            </div>
            SureChakri
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-muted-foreground mb-2 mt-2 uppercase tracking-wider">
            Menu
          </p>
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* --- PROFILE & LOGOUT SECTION --- */}
        <div className="p-4 border-t bg-muted/30">
          {status === "loading" ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-muted-foreground size-5" />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              {/* Profile Info */}
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border shadow-sm">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {user.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate text-foreground">
                    {user.name}
                  </span>
                  <span
                    className="text-[10px] text-muted-foreground truncate"
                    title={user.email || ""}
                  >
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200/60 shadow-sm"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={16} /> Sign Out
              </Button>
            </div>
          ) : (
            <div className="text-sm text-center text-muted-foreground">
              Guest User
            </div>
          )}
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 md:px-8">
          <div className="flex items-center gap-4">
            <MobileMenu pathname={pathname} user={user} />
            <Breadcrumb currentPath={pathname} />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-muted"
            >
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-background" />
            </Button>
            <Separator orientation="vertical" className="h-6 hidden md:block" />

            {/* Header Avatar (Mobile/Desktop) */}
            <div className="size-8 rounded-full border bg-muted ring-offset-background cursor-pointer">
              <Avatar className="size-full">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="text-xs">
                  {user?.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full mb-16 lg:mb-0 animate-in fade-in duration-500">
          {children}
        </main>
      </div>

      {/* --- MOBILE NAVIGATION (Bottom) --- */}
      <MobileBottomNav pathname={pathname} />
    </div>
  );
}

/** --- Sub-components --- **/

function NavItem({
  item,
  isActive,
}: {
  item: (typeof NAV_ITEMS)[number];
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group",
        isActive
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon
        size={18}
        className={cn(
          isActive ? "text-primary-foreground" : "group-hover:text-foreground"
        )}
      />
      {item.label}
    </Link>
  );
}

function Breadcrumb({ currentPath }: { currentPath: string }) {
  // URL থেকে লাস্ট পার্ট নেওয়া হচ্ছে এবং হাইফেন সরিয়ে দেওয়া হচ্ছে
  const segments = currentPath.split("/");
  const label = segments[segments.length - 1]?.replace(/-/g, " ") || "Overview";

  return (
    <div className="hidden md:flex items-center gap-2 text-sm font-medium">
      <span className="text-muted-foreground/60">Dashboard</span>
      <span className="text-muted-foreground/40">/</span>
      <span className="capitalize text-foreground font-semibold">{label}</span>
    </div>
  );
}

// Mobile Sidebar Menu
function MobileMenu({ pathname, user }: { pathname: string; user: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden -ml-2">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b text-left bg-muted/10">
          <SheetTitle className="text-primary font-bold flex items-center gap-2">
            <div className="size-6 bg-primary rounded flex items-center justify-center text-primary-foreground text-xs">
              SC
            </div>
            SureChakri
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "hover:bg-muted text-muted-foreground"
              )}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Sidebar Footer */}
        {user && (
          <div className="p-4 border-t bg-muted/20 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="size-10 border bg-background">
                <AvatarImage src={user.image} />
                <AvatarFallback>{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold truncate">
                  {user.name}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full text-red-600 border-red-100 hover:bg-red-50"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut size={16} className="mr-2" /> Sign Out
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// Mobile Bottom Navigation (Sticky)
function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t flex items-center justify-around z-50 pb-safe">
      {NAV_ITEMS.slice(0, 5).map((item) => {
        // Maximum 5 items for mobile bottom nav
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[60px] py-1",
              isActive ? "text-primary" : "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "p-1 rounded-xl transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground -translate-y-1 shadow-lg shadow-primary/20"
                  : ""
              )}
            >
              <item.icon size={20} />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium transition-all",
                isActive ? "opacity-100 font-bold" : "opacity-70"
              )}
            >
              {item.label.split(" ")[0]}{" "}
              {/* শুধু প্রথম শব্দটি দেখাবে মোবাইলে (যেমন: Live) */}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

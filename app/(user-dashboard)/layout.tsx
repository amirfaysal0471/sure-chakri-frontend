"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Menu,
  FileText,
  PieChart,
  UserCircle,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/user-dashboard", icon: LayoutDashboard },
  {
    label: "Applications",
    href: "/user-dashboard/applications",
    icon: FileText,
  },
  { label: "Analytics", href: "/user-dashboard/analytics", icon: PieChart },
  { label: "Profile", href: "/user-dashboard/profile", icon: UserCircle },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r sticky top-0 h-screen z-50">
        <div className="flex h-16 items-center px-6 border-b">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="size-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-sm">
              SC
            </div>
            SureChakri
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* --- HEADER --- */}
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-4 md:px-8">
          <div className="flex items-center gap-4">
            <MobileMenu pathname={pathname} />
            <Breadcrumb currentPath={pathname} />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative"
            >
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="size-8 rounded-full border bg-muted ring-offset-background transition-colors hover:ring-2 hover:ring-ring">
              <img
                src="https://avatar.iran.liara.run/public/32"
                alt="User avatar"
                className="size-full rounded-full object-cover"
              />
            </div>
          </div>
        </header>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full mb-16 lg:mb-0 animate-in fade-in duration-500">
          {children}
        </main>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      <MobileBottomNav pathname={pathname} />
    </div>
  );
}

/** --- Sub-components to keep code clean --- **/

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
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
        isActive
          ? "bg-secondary text-secondary-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <item.icon
        size={18}
        className={cn(
          isActive ? "text-primary" : "group-hover:text-foreground"
        )}
      />
      {item.label}
    </Link>
  );
}

function Breadcrumb({ currentPath }: { currentPath: string }) {
  const label = currentPath.split("/").pop()?.replace("-", " ") || "Overview";
  return (
    <div className="hidden md:flex items-center gap-2 text-sm font-medium">
      <span className="text-muted-foreground">Console</span>
      <span className="text-muted-foreground">/</span>
      <span className="capitalize">{label}</span>
    </div>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="text-primary font-bold">SureChakri</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 p-3 rounded-md text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MobileBottomNav({ pathname }: { pathname: string }) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around z-50">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={cn(
                "p-1.5 rounded-md",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={20} />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

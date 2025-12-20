"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  BarChart3,
  Settings,
  Bell,
  Menu,
  LogOut,
  Search,
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
import { Input } from "@/components/ui/input";

const ADMIN_NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Job Postings", href: "/admin/jobs", icon: Briefcase },
  { label: "Verification", href: "/admin/verification", icon: ShieldCheck },
  { label: "System Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex w-64 flex-col bg-muted/30 border-r sticky top-0 h-screen z-50">
        <div className="flex h-16 items-center px-6 border-b bg-background">
          <Link
            href="/admin"
            className="flex items-center gap-2 font-black text-lg tracking-tighter uppercase"
          >
            <div className="size-7 bg-foreground rounded flex items-center justify-center text-background text-[10px]">
              ADM
            </div>
            SureChakri
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-muted-foreground uppercase px-3 mb-2 tracking-widest">
            Main Menu
          </p>
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-background">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
          >
            <LogOut size={16} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* --- MAIN --- */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <MobileAdminMenu pathname={pathname} />
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users, jobs, logs..."
                className="pl-9 h-9 bg-muted/50 border-none focus-visible:ring-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full size-9 relative"
            >
              <Bell size={18} />
              <span className="absolute top-0 right-0 size-2 bg-destructive rounded-full border-2 border-background" />
            </Button>
            <div className="size-9 rounded-full bg-primary/10 border flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-top-2 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileAdminMenu({ pathname }: { pathname: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="p-6 border-b text-left text-primary font-bold">
          <SheetTitle>Admin Control</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-1">
          {ADMIN_NAV.map((item) => (
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

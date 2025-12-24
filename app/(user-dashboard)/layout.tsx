"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Bell,
  Menu,
  FileText,
  PieChart,
  UserCircle,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // 2. Avatar import
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
  // 3. User data fetch
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
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="size-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground text-sm">
              SC
            </div>
            SureChakri
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ))}
        </nav>

        {/* --- 4. NEW PROFILE & LOGOUT SECTION --- */}
        <div className="p-4 border-t bg-muted/20">
          {status === "loading" ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              {/* Profile Info */}
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate text-foreground">
                    {user.name}
                  </span>
                  <span
                    className="text-xs text-muted-foreground truncate"
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
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={16} /> Sign Out
              </Button>
            </div>
          ) : (
            // Fallback if not logged in (Edge case)
            <div className="text-sm text-center text-muted-foreground">
              Please Log in
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
              className="rounded-full relative"
            >
              <Bell size={18} className="text-muted-foreground" />
              <span className="absolute top-2.5 right-2.5 size-2 bg-primary rounded-full border-2 border-background" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            {/* Header Avatar */}
            <div className="size-8 rounded-full border bg-muted ring-offset-background">
              <Avatar className="size-full">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
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
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group",
        isActive
          ? "bg-primary/10 text-primary font-semibold"
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

// 5. Updated Mobile Menu to show profile
function MobileMenu({ pathname, user }: { pathname: string; user: any }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="text-primary font-bold">SureChakri</SheetTitle>
        </SheetHeader>

        <div className="flex-1 p-4 space-y-1">
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

        {/* Mobile Sidebar Footer */}
        {user && (
          <div className="p-4 border-t bg-muted/20 mt-auto">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="size-9 border">
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
                "p-1.5 rounded-md transition-colors",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
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

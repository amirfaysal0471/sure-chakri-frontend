"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  Settings,
  Bell,
  Menu,
  LogOut,
  Search,
  Loader2,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  List,
  Plus,
  Tags,
  type LucideIcon,
  PrinterCheckIcon,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// --- Types ---

interface NavChild {
  label: string;
  href: string;
  icon?: LucideIcon;
}

interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  isDropdown?: boolean;
  children?: NavChild[];
}

interface AdminLayoutProps {
  children: ReactNode;
}

interface UserProfile {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

// --- Configuration ---

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "User Management", href: "/admin-dashboard/users", icon: Users },
  {
    label: "Exam Categories",
    href: "/admin-dashboard/exam-categories",
    icon: Briefcase,
  },
  {
    label: "Exams",
    icon: ShieldCheck,
    isDropdown: true,
    children: [
      { label: "Create-Exams", href: "/admin-dashboard/exams", icon: Clock },
    ],
  },
  {
    label: "Question Bank",
    icon: BookOpen,
    isDropdown: true,
    children: [
      {
        label: "Categories",
        href: "/admin-dashboard/question-bank-categories",
        icon: Tags,
      },
      {
        label: "Add Question",
        href: "/admin-dashboard/question-bank/create",
        icon: Plus,
      },
      {
        label: "All Questions",
        href: "/admin-dashboard/question-bank/all-questions",
        icon: List,
      },
    ],
  },
  {
    label: "Pricing Plan",
    href: "/admin-dashboard/pricing",
    icon: SlidersHorizontal,
  },

  { label: "Settings", href: "/admin/settings", icon: Settings },
];

// --- Helpers ---

const getInitialDropdownState = (pathname: string): Record<string, boolean> => {
  const initialState: Record<string, boolean> = {};
  ADMIN_NAV.forEach((item) => {
    if (item.isDropdown && item.children) {
      initialState[item.label] = item.children.some(
        (child) => pathname === child.href
      );
    }
  });
  return initialState;
};

// --- Components ---

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = session?.user;

  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    () => getInitialDropdownState(pathname)
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 flex-col bg-muted/30 border-r sticky top-0 h-screen z-50">
        <div className="flex h-16 items-center px-6 border-b bg-background shrink-0">
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
            if (item.isDropdown) {
              const isOpen = openDropdowns[item.label];
              const isParentActive = item.children?.some(
                (child) => pathname === child.href
              );

              return (
                <div key={item.label} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground",
                      isParentActive && "text-foreground bg-muted/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    <ChevronDown
                      size={14}
                      className={cn(
                        "transition-transform duration-200",
                        isOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {isOpen && (
                    <div className="ml-9 space-y-1 animate-in fade-in slide-in-from-left-2">
                      {item.children?.map((subItem) => (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-colors",
                            pathname === subItem.href
                              ? "text-primary bg-primary/10"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          {subItem.icon && <subItem.icon size={14} />}
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all",
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

        {/* Profile Section */}
        <div className="p-4 border-t bg-background">
          {status === "loading" ? (
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-muted-foreground" />
            </div>
          ) : user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 border border-border">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "Admin"}
                  />
                  <AvatarFallback>{user.name?.[0] || "A"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold truncate text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </span>
                </div>
              </div>
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
            <div className="text-sm text-center text-muted-foreground">
              Session Error
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <MobileAdminMenu pathname={pathname} user={user} />
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
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
            <Avatar className="size-9 border">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

function MobileAdminMenu({
  pathname,
  user,
}: {
  pathname: string;
  user: UserProfile | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
    () => getInitialDropdownState(pathname)
  );

  const toggleDropdown = (label: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b text-left">
          <SheetTitle className="text-primary">Admin Control</SheetTitle>
        </SheetHeader>
        <div className="p-4 space-y-1 flex-1 overflow-y-auto">
          {ADMIN_NAV.map((item) =>
            item.isDropdown ? (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleDropdown(item.label)}
                  className="flex items-center justify-between w-full p-3 rounded-md text-sm font-medium hover:bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={18} /> {item.label}
                  </div>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "transition-transform duration-200",
                      openDropdowns[item.label] && "rotate-180"
                    )}
                  />
                </button>
                {openDropdowns[item.label] && (
                  <div className="ml-9 space-y-1 animate-in fade-in slide-in-from-left-2">
                    {item.children?.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-md text-xs transition-colors",
                          pathname === sub.href
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {sub.icon && <sub.icon size={14} />}
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href!}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <item.icon size={18} /> {item.label}
              </Link>
            )
          )}
        </div>
        {user && (
          <div className="p-4 border-t bg-muted/20">
            <Button
              variant="outline"
              className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
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

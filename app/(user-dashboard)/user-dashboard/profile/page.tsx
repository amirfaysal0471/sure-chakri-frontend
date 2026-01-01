"use client";

import { useSession, signOut } from "next-auth/react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Crown,
  Edit,
  LogOut,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Settings,
  Camera,
  Loader2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// --- Types ---

interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  plan?: string;
  phone?: string;
  address?: string;
}

interface UserPlan {
  type: string;
  expiresAt: string;
  isPremium: boolean;
}

// =========================================================
// MAIN COMPONENT
// =========================================================

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const user = session?.user as ExtendedUser | undefined;

  if (status === "loading") {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  // Mock Data for Plan
  const userPlan: UserPlan = {
    type: user.plan || "Free",
    expiresAt: "2026-01-15",
    isPremium: user.plan === "premium" || user.plan === "pro",
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {/* Header & Avatar */}
      <ProfileHeader user={user} isPremium={userPlan.isPremium} />

      {/* Subscription Card */}
      <div className="px-1">
        <h3 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Subscription
        </h3>
        <SubscriptionCard plan={userPlan} />
      </div>

      {/* Personal Info */}
      <div className="px-1">
        <div className="mb-3 ml-1 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Personal Info
          </h3>
          <EditProfileDialog user={user} />
        </div>

        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <InfoItem icon={User} label="Full Name" value={user.name} />
            <Separator />
            <InfoItem icon={Mail} label="Email" value={user.email} />
            <Separator />
            <InfoItem
              icon={Phone}
              label="Phone"
              value={user.phone || "Not set"}
            />
            <Separator />
            <InfoItem
              icon={MapPin}
              label="Location"
              value={user.address || "Dhaka, Bangladesh"}
              isLast
            />
          </CardContent>
        </Card>
      </div>

      {/* Settings & Logout */}
      <div className="px-1">
        <h3 className="mb-3 ml-1 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Settings
        </h3>
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            <SettingsItem icon={CreditCard} label="Payment Methods" />
            <Separator />
            <SettingsItem icon={ShieldCheck} label="Password & Security" />
            <Separator />
            <SettingsItem icon={Settings} label="App Preferences" isLast />
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="mt-6 h-12 w-full rounded-xl border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" /> Log Out
        </Button>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          SureChakri App v1.0.2
        </p>
      </div>
    </div>
  );
}

// =========================================================
// SUB-COMPONENTS
// =========================================================

function ProfileHeader({
  user,
  isPremium,
}: {
  user: ExtendedUser;
  isPremium: boolean;
}) {
  return (
    <div className="-mx-4 rounded-b-3xl bg-gradient-to-b from-primary/10 to-background px-4 pb-4 pt-8 md:mx-0 md:mt-4 md:rounded-3xl">
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/20 text-2xl font-bold text-primary">
              {user.name?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </div>

        <h2 className="mt-3 text-xl font-bold">{user.name}</h2>
        <p className="text-sm text-muted-foreground">{user.email}</p>

        <div className="mt-3 flex gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            {user.role || "Student"}
          </Badge>
          {isPremium && (
            <Badge className="gap-1 border-amber-200 bg-amber-100 px-3 py-1 text-amber-700 hover:bg-amber-100">
              <Crown className="h-3 w-3 fill-amber-700" /> Premium Member
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

function SubscriptionCard({ plan }: { plan: UserPlan }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-none shadow-md",
        plan.isPremium
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "border border-border bg-card"
      )}
    >
      {plan.isPremium && (
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
      )}

      <CardContent className="relative z-10 flex items-center justify-between p-5">
        <div>
          <p
            className={cn(
              "text-xs font-medium opacity-80",
              plan.isPremium ? "text-gray-300" : "text-muted-foreground"
            )}
          >
            Current Plan
          </p>
          <h4 className="mt-1 flex items-center gap-2 text-2xl font-bold">
            {plan.type} Plan
            {plan.isPremium && (
              <Crown className="h-5 w-5 fill-amber-400 text-amber-400" />
            )}
          </h4>

          {plan.isPremium ? (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Active until{" "}
              {new Date(plan.expiresAt).toLocaleDateString("en-US")}
            </p>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Upgrade to unlock premium exams.
            </p>
          )}
        </div>

        {plan.isPremium ? (
          <Button
            size="sm"
            variant="outline"
            className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
          >
            Manage
          </Button>
        ) : (
          <Button
            size="sm"
            className="border-0 bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-blue-500/20"
          >
            Upgrade Now
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value?: string | null;
  isLast?: boolean;
}

function InfoItem({ icon: Icon, label, value, isLast }: InfoItemProps) {
  return (
    <div className={cn("flex items-center justify-between p-4", !isLast && "")}>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-muted/50 p-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

interface SettingsItemProps {
  icon: LucideIcon;
  label: string;
  isLast?: boolean;
}

function SettingsItem({ icon: Icon, label, isLast }: SettingsItemProps) {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/30",
        !isLast && ""
      )}
    >
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/5 p-2 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

function EditProfileDialog({ user }: { user: ExtendedUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-1 text-xs font-bold text-primary hover:underline">
          <Edit className="h-3 w-3" /> Edit
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={user.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              defaultValue={user.phone || ""}
              placeholder="017..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              defaultValue={user.address || ""}
              placeholder="City, Country"
            />
          </div>
          <Button className="mt-4 w-full">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

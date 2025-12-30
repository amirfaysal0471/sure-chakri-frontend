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
// Fix: Extend the default NextAuth session user type to include custom fields
interface ExtendedUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  plan?: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  // Type assertion to resolve "Property 'phone' does not exist" error
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
  const userPlan = {
    type: user.plan || "Free",
    expiresAt: "2026-01-15",
    isPremium: user.plan === "premium" || user.plan === "pro",
  };

  return (
    <div className="space-y-6 pb-24 max-w-2xl mx-auto">
      {/* --- Header & Avatar --- */}
      <div className="relative bg-gradient-to-b from-primary/10 to-background pt-8 pb-4 px-4 rounded-b-3xl -mx-4 md:mx-0 md:rounded-3xl md:mt-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
              <AvatarImage src={user.image || ""} alt={user.name || "User"} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary font-bold">
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
            {userPlan.isPremium && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-200 px-3 py-1 gap-1">
                <Crown className="w-3 h-3 fill-amber-700" /> Premium Member
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* --- Current Plan Card --- */}
      <div className="px-1">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">
          Subscription
        </h3>
        <Card
          className={cn(
            "border-none shadow-md overflow-hidden relative",
            userPlan.isPremium
              ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
              : "bg-card border border-border"
          )}
        >
          {userPlan.isPremium && (
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          )}

          <CardContent className="p-5 flex items-center justify-between relative z-10">
            <div>
              <p
                className={cn(
                  "text-xs font-medium opacity-80",
                  userPlan.isPremium ? "text-gray-300" : "text-muted-foreground"
                )}
              >
                Current Plan
              </p>
              <h4 className="text-2xl font-bold mt-1 flex items-center gap-2">
                {userPlan.type} Plan
                {userPlan.isPremium && (
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400" />
                )}
              </h4>

              {userPlan.isPremium ? (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" /> Active until{" "}
                  {new Date(userPlan.expiresAt).toLocaleDateString("en-US")}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">
                  Upgrade to unlock premium exams.
                </p>
              )}
            </div>

            {userPlan.isPremium ? (
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white"
              >
                Manage
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-blue-500/20 text-white border-0"
              >
                Upgrade Now
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* --- Personal Info --- */}
      <div className="px-1">
        <div className="flex items-center justify-between mb-3 ml-1">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
            Personal Info
          </h3>
          <EditProfileDialog user={user} />
        </div>

        <Card className="border-none shadow-sm bg-card">
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

      {/* --- Settings & Logout --- */}
      <div className="px-1">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3 ml-1">
          Settings
        </h3>
        <Card className="border-none shadow-sm bg-card">
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
          className="w-full mt-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 text-sm font-semibold rounded-xl"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-4 h-4 mr-2" /> Log Out
        </Button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          SureChakri App v1.0.2
        </p>
      </div>
    </div>
  );
}

// --- Sub-Components ---

function InfoItem({
  icon: Icon,
  label,
  value,
  isLast,
}: {
  icon: any;
  label: string;
  value?: string | null;
  isLast?: boolean;
}) {
  return (
    <div className={cn("flex items-center justify-between p-4", !isLast && "")}>
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-muted/50 text-muted-foreground">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-sm font-semibold text-foreground">
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsItem({
  icon: Icon,
  label,
  isLast,
}: {
  icon: any;
  label: string;
  isLast?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex items-center justify-between w-full p-4 hover:bg-muted/30 transition-colors text-left",
        !isLast && ""
      )}
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-full bg-primary/5 text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

function EditProfileDialog({ user }: { user: ExtendedUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
          <Edit className="w-3 h-3" /> Edit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl">
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
          <Button className="w-full mt-4">Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

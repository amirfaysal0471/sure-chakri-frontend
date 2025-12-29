"use client";

import { use, useState, useEffect } from "react";
import { useData } from "@/app/hooks/use-data";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Calendar,
  Shield,
  CreditCard,
  User as UserIcon,
  Loader2,
  Save,
  CalendarClock, // 🔥 নতুন আইকন
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Date Formatter
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Params unwrap
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  // --- Local States ---
  const [selectedPlan, setSelectedPlan] = useState("");
  const [duration, setDuration] = useState("monthly"); // 🔥 নতুন স্টেট: monthly/yearly
  const [isUpdating, setIsUpdating] = useState(false);

  // --- Fetch Data ---
  const {
    data: user,
    isLoading,
    isError,
  } = useData<any>(["user", userId], `/api/users/${userId}`);

  // Load initial data
  useEffect(() => {
    if (user) {
      setSelectedPlan(user.plan || "free");
      // ডিফল্ট duration monthly থাক, আপডেট করার সময় চেঞ্জ করা যাবে
    }
  }, [user]);

  // --- Update Handler ---
  const handleUpdatePlan = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // 🔥 প্ল্যানের সাথে duration পাঠানো হচ্ছে
        body: JSON.stringify({
          plan: selectedPlan,
          duration: duration,
        }),
      });

      if (!res.ok) throw new Error("Failed to update plan");

      toast.success("Plan & Expiry updated successfully!");

      // Refresh Data
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      toast.error("Error updating plan.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-red-500 font-medium">
          User not found or error occurred.
        </p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* --- Left Column: Profile Overview --- */}
        <Card className="md:col-span-1 shadow-sm h-fit">
          <CardContent className="pt-8 flex flex-col items-center text-center space-y-4">
            <Avatar className="h-32 w-32 border-4 border-muted">
              <AvatarImage src={user.image} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Badge
                variant={user.role === "admin" ? "default" : "secondary"}
                className="uppercase"
              >
                {user.role}
              </Badge>
              <Badge
                variant="outline"
                className={
                  user.plan === "pro" || user.plan === "premium"
                    ? "bg-primary/10 text-primary border-primary/20 capitalize"
                    : "capitalize"
                }
              >
                {user.plan || "Free"} Plan
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* --- Right Column: Details & Management --- */}
        <div className="md:col-span-2 space-y-6">
          {/* 1. Account Details */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <UserIcon className="h-4 w-4" /> Full Name
                  </p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Email Address
                  </p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4" /> Auth Provider
                  </p>
                  <p className="font-medium capitalize">
                    {user.provider || "Credentials"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <CreditCard className="h-4 w-4" /> Google ID
                  </p>
                  <p className="font-medium text-xs font-mono bg-muted p-1 rounded w-fit">
                    {user.googleId || "Not Linked"}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Joined Date
                  </p>
                  <p className="font-medium">{formatDate(user.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Last Updated
                  </p>
                  <p className="font-medium">{formatDate(user.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 🔥 2. Manage Subscription Section */}
          <Card className="shadow-sm border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CreditCard className="h-5 w-5" /> Manage Subscription
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Plan Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="plan-select">Plan Type</Label>
                    <Select
                      value={selectedPlan}
                      onValueChange={setSelectedPlan}
                      disabled={isUpdating}
                    >
                      <SelectTrigger id="plan-select" className="bg-background">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration Selector */}
                  <div className="space-y-2">
                    <Label htmlFor="duration-select">Billing Cycle</Label>
                    <Select
                      value={duration}
                      onValueChange={setDuration}
                      disabled={isUpdating || selectedPlan === "free"}
                    >
                      <SelectTrigger
                        id="duration-select"
                        className="bg-background"
                      >
                        <SelectValue placeholder="Select Duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">
                          Monthly (+30 Days)
                        </SelectItem>
                        <SelectItem value="yearly">
                          Yearly (+365 Days)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleUpdatePlan}
                  disabled={isUpdating}
                  className="w-full"
                >
                  {isUpdating ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Update Plan & Expiry
                </Button>

                {/* 🔥 Expiry Info Display */}
                {user.plan !== "free" && user.planExpiresAt && (
                  <div className="mt-2 p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-md flex items-center gap-2 text-sm">
                    <CalendarClock className="h-4 w-4 shrink-0" />
                    <span>
                      Current Plan Expires on:{" "}
                      <strong>{formatDate(user.planExpiresAt)}</strong>
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Debug Data */}
          <div className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto opacity-50 hover:opacity-100 transition-opacity">
            <p className="text-xs text-muted-foreground mb-2">
              System Data (Debug)
            </p>
            <pre className="text-xs">
              {JSON.stringify(
                {
                  id: user._id,
                  planId: user.plan,
                  expires: user.planExpiresAt,
                },
                null,
                2
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

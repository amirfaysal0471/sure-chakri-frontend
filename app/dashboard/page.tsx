// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions"; // এখন এখান থেকে ইম্পোর্ট হবে
import { Loader } from "lucide-react";

export default async function DashboardPage() {
  // এখানে handler এর বদলে authOptions ব্যবহার করুন
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // রোল চেক করে রিডাইরেকশন
  if ((session.user as any).role === "admin") {
    redirect("/admin-dashboard");
  } else {
    redirect("/user-dashboard");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="animate-spin h-8 w-8 text-primary" />
    </div>
  );
}

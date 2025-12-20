import {
  Users,
  Briefcase,
  AlertTriangle,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
export default function AdminDashboardPage() {
  const adminStats = [
    {
      label: "Total Users",
      value: "12,450",
      icon: Users,
      trend: "+18%",
      color: "text-blue-600",
    },
    {
      label: "Active Jobs",
      value: "842",
      icon: Briefcase,
      trend: "+5%",
      color: "text-emerald-600",
    },
    {
      label: "Pending Verifications",
      value: "24",
      icon: AlertTriangle,
      trend: "High Priority",
      color: "text-amber-600",
    },
    {
      label: "Revenue (MTD)",
      value: "৳45,200",
      icon: TrendingUp,
      trend: "+10%",
      color: "text-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">System Overview</h2>
          <p className="text-muted-foreground">
            Everything is running smoothly. 2 items need your attention.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">System Audit</Button>
        </div>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminStats.map((stat) => (
          <Card key={stat.label} className="border-border/60 shadow-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={cn("size-5", stat.color)} />
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal size={14} />
                </Button>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status Table Placeholder */}
      <section className="rounded-xl border bg-card">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg italic tracking-tight">
            Recent System Activity
          </h3>
          <Button variant="link" className="text-xs">
            View all logs
          </Button>
        </div>
        <div className="p-10 text-center text-muted-foreground">
          <p className="text-sm">
            Activity logs and live data will be rendered here.
          </p>
          {/*  */}
        </div>
      </section>
    </div>
  );
}

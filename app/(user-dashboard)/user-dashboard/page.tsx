import {
  ArrowUpRight,
  Briefcase,
  CheckCircle,
  Clock,
  Zap,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserDashboardPage() {
  const stats = [
    { label: "Applied", value: "24", icon: Briefcase, trend: "+12%" },
    { label: "In Review", value: "08", icon: Clock, trend: "+2%" },
    { label: "Shortlisted", value: "03", icon: CheckCircle, trend: "+5%" },
    { label: "AI Credits", value: "150", icon: Zap, trend: "Stable" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, Amir!
          </h2>
          <p className="text-muted-foreground font-medium">
            You have{" "}
            <span className="text-foreground underline underline-offset-4 decoration-primary/30">
              3 interviews
            </span>{" "}
            this week.
          </p>
        </div>
        <Button className="w-full md:w-fit group">
          <Plus className="mr-2 size-4 transition-transform group-hover:rotate-90" />
          New Application
        </Button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-card shadow-sm border-border/50 hover:border-primary/20 transition-all duration-300"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex items-end justify-between mt-1">
                <h3 className="text-3xl font-bold">{stat.value}</h3>
                <span className="flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  {stat.trend} <ArrowUpRight size={12} className="ml-0.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* AI Feature Banner */}
      <section className="relative rounded-2xl border bg-card p-6 md:p-10 overflow-hidden shadow-sm group">
        <div className="relative z-10 max-w-lg space-y-4">
          <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
            New update
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
            AI Resume Optimizer
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            Upload your CV and let our AI suggest keywords to beat the ATS
            systems. Increase your match rate by up to 70% automatically.
          </p>
          <Button size="lg" className="px-8 shadow-md hover:shadow-primary/20">
            Start Scanning <Zap size={16} className="ml-2 fill-current" />
          </Button>
        </div>

        {/* Decorative Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </section>
    </div>
  );
}

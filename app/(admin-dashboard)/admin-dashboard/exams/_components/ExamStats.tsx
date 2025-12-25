import {
  BookOpen,
  Calendar,
  FileEdit,
  type LucideIcon,
  Radio,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ExamStatsProps {
  totalExams?: number;
  upcoming?: number;
  live?: number;
  draft?: number;
}

interface StatItem {
  label: string;
  value: number;
  Icon: LucideIcon;
  colorClass: string;
  wrapperClass?: string;
}

export function ExamStats({
  totalExams = 0,
  upcoming = 0,
  live = 0,
  draft = 0,
}: ExamStatsProps) {
  const stats: StatItem[] = [
    {
      label: "Total Exams",
      value: totalExams,
      Icon: BookOpen,
      colorClass: "bg-blue-100 text-blue-600",
    },
    {
      label: "Live Now",
      value: live,
      Icon: Radio,
      colorClass: "bg-red-100 text-red-600",
      wrapperClass: "animate-pulse",
    },
    {
      label: "Upcoming",
      value: upcoming,
      Icon: Calendar,
      colorClass: "bg-green-100 text-green-600",
    },
    {
      label: "Drafts",
      value: draft,
      Icon: FileEdit,
      colorClass: "bg-gray-100 text-gray-600",
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map(({ label, value, Icon, colorClass, wrapperClass }) => (
        <Card key={label}>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {label}
              </p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div
              className={cn("rounded-full p-2", colorClass, wrapperClass)}
              aria-hidden="true"
            >
              <Icon size={20} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

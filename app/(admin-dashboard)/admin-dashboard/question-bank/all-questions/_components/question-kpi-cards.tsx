"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  FileQuestion,
  CheckCircle2,
  Clock,
  AlertCircle,
  LucideIcon,
} from "lucide-react";

interface Props {
  total: number;
  active: number;
  categoriesCount: number;
}

export function QuestionKPICards({ total, active, categoriesCount }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KPICard
        title="Total Questions"
        value={total}
        icon={FileQuestion}
        color="text-blue-600"
        bg="bg-blue-100"
      />
      <KPICard
        title="Active Questions"
        value={active}
        icon={CheckCircle2}
        color="text-green-600"
        bg="bg-green-100"
      />
      <KPICard
        title="Avg Marks"
        value="1.0"
        icon={Clock}
        color="text-orange-600"
        bg="bg-orange-100"
      />
      <KPICard
        title="Categories"
        value={categoriesCount}
        icon={AlertCircle}
        color="text-purple-600"
        bg="bg-purple-100"
      />
    </div>
  );
}

function KPICard({
  title,
  value,
  icon: Icon,
  color,
  bg,
}: {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
  bg: string;
}) {
  return (
    <Card className="shadow-sm border-none">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`p-3 rounded-full ${bg} ${color}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}

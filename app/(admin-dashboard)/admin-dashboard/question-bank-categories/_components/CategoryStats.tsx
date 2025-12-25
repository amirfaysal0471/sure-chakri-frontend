"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Layers, FileQuestion, CheckCircle, LayoutGrid } from "lucide-react";

interface StatsProps {
  totalRecords: number;
  totalQuestions: number;
  activeCount: number;
  totalTypes: number;
  isLoading: boolean;
}

export function CategoryStats({
  totalRecords,
  totalQuestions,
  activeCount,
  totalTypes,
  isLoading,
}: StatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Categories
            </p>
            <h3 className="text-2xl font-bold">
              {isLoading ? "..." : totalRecords}
            </h3>
          </div>
          <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
            <Layers size={20} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Questions
            </p>
            <h3 className="text-2xl font-bold">{totalQuestions}+</h3>
          </div>
          <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
            <FileQuestion size={20} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Active Now
            </p>
            <h3 className="text-2xl font-bold">{activeCount}</h3>
          </div>
          <div className="p-2 bg-green-100 text-green-600 rounded-full">
            <CheckCircle size={20} />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Exam Types
            </p>
            <h3 className="text-2xl font-bold">{totalTypes}</h3>
          </div>
          <div className="p-2 bg-orange-100 text-orange-600 rounded-full">
            <LayoutGrid size={20} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { Search } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { ICON_LIBRARY } from "./constants";

interface CategoryIconSelectorProps {
  selectedIconName: string;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setSelectedIconName: (value: string) => void;
}

export function CategoryIconSelector({
  selectedIconName,
  searchQuery,
  setSearchQuery,
  setSelectedIconName,
}: CategoryIconSelectorProps) {
  const filteredIcons = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return ICON_LIBRARY.filter(
      (item) =>
        item.name.toLowerCase().includes(query) || item.tags.includes(query)
    );
  }, [searchQuery]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Select Icon</CardTitle>
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
            <Input
              placeholder="Search icon..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 pl-8 text-xs"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="custom-scrollbar grid h-52 grid-cols-4 gap-3 overflow-y-auto rounded-lg border bg-muted/20 p-4 sm:grid-cols-6 md:grid-cols-8">
          {filteredIcons.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedIconName === item.name;

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => setSelectedIconName(item.name)}
                title={item.name}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2.5 transition-all",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2"
                    : "border bg-background hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="mb-1 size-5" />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

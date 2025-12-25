"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Search, Filter } from "lucide-react";

interface FilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  examTypes: { id: string; name: string }[];
}

export function CategoryFilters({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  examTypes,
}: FilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center bg-muted/40 p-4 rounded-lg border">
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search categories..."
          className="pl-9 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <Select value={selectedType} onValueChange={setSelectedType}>
        <SelectTrigger className="w-full sm:w-[200px] bg-background">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <SelectValue placeholder="Filter by Type" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Exams</SelectItem>
          <Separator className="my-1" />
          {examTypes.map((type) => (
            <SelectItem key={type.id} value={type.name}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

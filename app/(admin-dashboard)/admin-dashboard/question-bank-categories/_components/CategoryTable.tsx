"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Pencil, Trash2, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryTableProps {
  categories: any[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  itemsPerPage: number;
  isUpdating: boolean;
  onStatusToggle: (id: string, currentStatus: string) => void;
  onEdit: (category: any) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({
  categories,
  isLoading,
  isError,
  currentPage,
  itemsPerPage,
  isUpdating,
  onStatusToggle,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  return (
    <div className="rounded-md border bg-card min-h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            <TableHead className="w-[350px]">Category Name</TableHead>
            <TableHead>Exam Type</TableHead>
            <TableHead>Questions</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center">
                <div className="flex flex-col justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  <span>Loading data...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6} className="h-48 text-center text-red-500">
                <div className="flex flex-col items-center gap-2">
                  <X className="h-8 w-8" /> Failed to load categories.
                </div>
              </TableCell>
            </TableRow>
          ) : categories.length > 0 ? (
            categories.map((category, index) => (
              <TableRow key={category._id}>
                <TableCell className="font-medium text-muted-foreground">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {category.type}
                  </Badge>
                </TableCell>
                <TableCell>{category.totalQuestions || 0}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={category.status === "Active"}
                      onCheckedChange={() =>
                        onStatusToggle(category._id, category.status)
                      }
                      disabled={isUpdating}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        category.status === "Active"
                          ? "text-green-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {category.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => onEdit(category)}
                        className="cursor-pointer"
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(category._id)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-48 text-center text-muted-foreground"
              >
                No categories found. Try adding a new one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

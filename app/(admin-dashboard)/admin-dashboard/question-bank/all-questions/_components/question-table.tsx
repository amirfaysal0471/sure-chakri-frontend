"use client";

import { useState } from "react";
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
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // ✅ Switch Import
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";

interface Props {
  questions: any[];
  isLoading: boolean;
  onEdit: (question: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, newStatus: string) => void; // ✅ New Prop for Status Toggle
  startIndex?: number;
}

export function QuestionTable({
  questions,
  isLoading,
  onEdit,
  onDelete,
  onStatusChange,
  startIndex = 0,
}: Props) {
  // লোকাল লোডিং স্টেট রাখা যেতে পারে যাতে ইউজার দ্রুত রেসপন্স পায়,
  // তবে এখানে সিম্পল রাখার জন্য সরাসরি প্যারেন্ট হ্যান্ডলার কল করছি।

  return (
    <Card className="overflow-hidden shadow-sm border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-[50px] text-center">SL</TableHead>
            <TableHead className="w-[400px]">Question Text</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Options</TableHead>
            <TableHead className="text-center">Marks</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-8 mx-auto bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </TableCell>
                <TableCell colSpan={4}>
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </TableCell>
              </TableRow>
            ))
          ) : questions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="h-32 text-center text-muted-foreground"
              >
                No questions found.
              </TableCell>
            </TableRow>
          ) : (
            questions.map((q, index) => (
              <TableRow key={q._id} className="hover:bg-muted/5">
                <TableCell className="text-center font-medium text-muted-foreground">
                  {startIndex + index + 1}
                </TableCell>

                <TableCell className="font-medium">
                  <div className="line-clamp-2" title={q.questionText}>
                    {q.questionText}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {q.categoryId?.name || "N/A"}
                  </Badge>
                </TableCell>

                <TableCell className="text-center text-sm">
                  {q.options?.length || 0}
                </TableCell>

                <TableCell className="text-center font-medium">
                  {q.marks}
                </TableCell>

                {/* ✅ Status Switch Logic */}
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Switch
                      checked={q.status === "Active"}
                      onCheckedChange={(checked) =>
                        onStatusChange(q._id, checked ? "Active" : "Inactive")
                      }
                    />
                    <span
                      className={`text-xs font-medium ${
                        q.status === "Active"
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => onEdit(q)}
                      >
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={() => onDelete(q._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

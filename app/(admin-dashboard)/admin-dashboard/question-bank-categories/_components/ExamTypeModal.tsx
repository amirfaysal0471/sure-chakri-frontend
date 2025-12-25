"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";

interface TypeModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  examTypes: { id: string; name: string }[];
  newTypeName: string;
  setNewTypeName: (val: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}

export function ExamTypeModal({
  isOpen,
  onClose,
  examTypes,
  newTypeName,
  setNewTypeName,
  onAdd,
  onDelete,
}: TypeModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Manage Exam Types</DialogTitle>
          <DialogDescription>
            Add or remove parent exam types.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2">
            <Input
              placeholder="New Type Name..."
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
            />
            <Button onClick={onAdd} size="icon">
              <Plus size={18} />
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-[200px] pr-4">
            <div className="space-y-2">
              {examTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between bg-muted/50 p-2 rounded-md border"
                >
                  <span className="text-sm font-medium">{type.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-red-500"
                    onClick={() => onDelete(type.id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

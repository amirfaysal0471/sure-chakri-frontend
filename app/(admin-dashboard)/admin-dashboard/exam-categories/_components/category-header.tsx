"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  isEditing: boolean;
  isProcessing: boolean;
  onReset: () => void;
  onSave: () => void;
}

export function CategoryHeader({
  isEditing,
  isProcessing,
  onReset,
  onSave,
}: CategoryHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="size-8 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
        </Button>
        <div>
          <h1 className="text-xl font-bold tracking-tight md:text-2xl">
            {isEditing ? "Edit Category" : "Create Category"}
          </h1>
          <p className="text-xs text-muted-foreground md:text-sm">
            Manage exam categories
          </p>
        </div>
      </div>

      <div className="flex w-full items-center gap-2 sm:w-auto">
        <Button
          variant="ghost"
          onClick={onReset}
          className="flex-1 sm:flex-none"
          disabled={isProcessing}
        >
          Reset
        </Button>
        <Button
          onClick={onSave}
          disabled={isProcessing}
          className="flex-1 sm:flex-none"
        >
          {isProcessing && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isEditing ? "Update" : "Save"}
          <span className="ml-1 hidden sm:inline">Category</span>
        </Button>
      </div>
    </div>
  );
}

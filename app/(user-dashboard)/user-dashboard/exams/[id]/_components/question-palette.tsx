"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LayoutGrid } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface QuestionPaletteProps {
  questions: any[];
  answers: Record<number, number>;
  markedForReview: Set<number>;
  currentIndex: number;
  onJump: (index: number) => void;
}

export function QuestionPalette({
  questions,
  answers,
  markedForReview,
  currentIndex,
  onJump,
}: QuestionPaletteProps) {
  const answeredCount = Object.keys(answers).length;
  const reviewCount = markedForReview.size;
  const skippedCount = questions.length - answeredCount;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs font-medium text-gray-500 hover:bg-gray-100"
        >
          <LayoutGrid className="mr-1.5 h-3.5 w-3.5" /> All Questions
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="flex h-[85vh] flex-col rounded-t-[1.5rem] bg-white p-0"
      >
        {/* --- Header & Stats --- */}
        <div className="border-b border-gray-100 p-5 pb-4">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="text-lg font-bold text-gray-900">
              Exam Overview
            </SheetTitle>
          </SheetHeader>

          {/* Meaningful Stats Dashboard */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center rounded-xl bg-blue-50 py-2">
              <span className="text-lg font-bold text-blue-600">
                {answeredCount}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-blue-400">
                Answered
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-amber-50 py-2">
              <span className="text-lg font-bold text-amber-600">
                {reviewCount}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-amber-400">
                Review
              </span>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-gray-50 py-2">
              <span className="text-lg font-bold text-gray-600">
                {skippedCount}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                Left
              </span>
            </div>
          </div>
        </div>

        {/* --- Grid Area --- */}
        <ScrollArea className="flex-1 px-5 py-4">
          <div className="mb-4 grid grid-cols-5 gap-3">
            {questions.map((q, idx) => {
              const isAns = answers[q.id] !== undefined;
              const isReview = markedForReview.has(q.id);
              const isCurrent = currentIndex === idx;

              return (
                <button
                  key={q.id}
                  onClick={() => onJump(idx)}
                  className={cn(
                    "relative flex h-11 w-full items-center justify-center rounded-lg border text-xs font-bold transition-all active:scale-95",
                    // Current Question Indicator
                    isCurrent
                      ? "z-10 border-primary ring-2 ring-primary ring-offset-2"
                      : "border-gray-200",
                    // State Colors
                    isAns
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-600",
                    // Review State Overrides
                    isReview &&
                      !isAns &&
                      "border-amber-500 bg-amber-50 text-amber-700",
                    isReview && isAns && "ring-2 ring-amber-500 ring-offset-1"
                  )}
                >
                  {q.id}
                  {/* Dot indicator for review */}
                  {isReview && (
                    <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* --- Footer Legend --- */}
        <div className="bg-gray-50 p-5 pb-safe">
          <h4 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Legend
          </h4>
          <div className="grid grid-cols-2 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-primary" />
              <span className="text-xs font-medium text-gray-600">
                Answered
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-gray-300 bg-white" />
              <span className="text-xs font-medium text-gray-600">
                Not Visited
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-amber-500 bg-amber-50" />
              <span className="text-xs font-medium text-gray-600">
                Marked for Review
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border-2 border-primary bg-white" />
              <span className="text-xs font-medium text-gray-600">
                Current Question
              </span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

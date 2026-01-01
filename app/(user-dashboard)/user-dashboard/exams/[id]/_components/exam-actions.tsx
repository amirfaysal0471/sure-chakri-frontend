"use client";

import {
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { QuestionPalette } from "./question-palette";
import { cn } from "@/lib/utils";

interface ExamActionsProps {
  currentIndex: number;
  totalQuestions: number;
  answersCount: number;
  isReviewMarked: boolean;
  isSubmitting: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onToggleReview: () => void;
  questions: any[];
  answers: Record<number, number>;
  markedForReview: Set<number>;
  onJumpToQuestion: (index: number) => void;
}

export function ExamActions({
  currentIndex,
  totalQuestions,
  answersCount,
  isReviewMarked,
  isSubmitting,
  onPrev,
  onNext,
  onSubmit,
  onToggleReview,
  questions,
  answers,
  markedForReview,
  onJumpToQuestion,
}: ExamActionsProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const skippedCount = totalQuestions - answersCount;

  return (
    <div className="pt-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
      {/* Primary Navigation */}
      <div className="flex gap-3 mb-4">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={currentIndex === 0}
          className="flex-1 h-10 text-sm font-medium border-gray-200 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Prev
        </Button>

        {isLastQuestion ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex-1 h-10 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-sm">
                Submit <Send className="w-3.5 h-3.5 ml-2" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl max-w-[90%] sm:max-w-sm mx-auto bg-white p-6 gap-0">
              {/* --- Header with Icon --- */}
              <AlertDialogHeader className="mb-6">
                <div className="mx-auto bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center mb-3 border border-amber-100">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <AlertDialogTitle className="text-center text-xl font-bold text-gray-900">
                  Finish Exam?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-center text-sm text-gray-500 mt-1">
                  You are about to submit your answers. Please review your
                  progress below.
                </AlertDialogDescription>
              </AlertDialogHeader>

              {/* --- Stats Card --- */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-6">
                <div className="grid grid-cols-2 gap-4 divide-x divide-gray-200">
                  {/* Answered Stat */}
                  <div className="text-center px-2">
                    <span className="block text-2xl font-bold text-green-600">
                      {answersCount}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Answered
                    </span>
                  </div>
                  {/* Skipped Stat */}
                  <div className="text-center px-2">
                    <span className="block text-2xl font-bold text-amber-500">
                      {skippedCount}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Skipped
                    </span>
                  </div>
                </div>
              </div>

              {/* --- Actions --- */}
              <AlertDialogFooter className="flex-col sm:flex-col space-y-0 gap-3">
                <AlertDialogAction
                  onClick={onSubmit}
                  className="w-full h-11 bg-green-600 hover:bg-green-700 text-base font-bold shadow-md rounded-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Yes, Submit Exam"
                  )}
                </AlertDialogAction>
                <AlertDialogCancel className="w-full h-11 border-0 bg-transparent hover:bg-gray-50 text-gray-500 text-sm font-medium mt-0 rounded-lg">
                  Wait, let me review
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button
            onClick={onNext}
            className="flex-1 h-10 font-semibold shadow-sm text-sm"
          >
            Next <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Secondary Tools (Review & Palette) */}
      <div className="flex justify-between items-center px-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleReview}
          className={cn(
            "h-8 text-xs font-medium text-gray-500 hover:bg-gray-100",
            isReviewMarked && "text-amber-600 bg-amber-50 hover:bg-amber-100"
          )}
        >
          <Flag
            className={cn(
              "w-3.5 h-3.5 mr-1.5",
              isReviewMarked && "fill-current"
            )}
          />
          {isReviewMarked ? "Marked" : "Review Later"}
        </Button>

        <QuestionPalette
          questions={questions}
          answers={answers}
          markedForReview={markedForReview}
          currentIndex={currentIndex}
          onJump={onJumpToQuestion}
        />
      </div>
    </div>
  );
}

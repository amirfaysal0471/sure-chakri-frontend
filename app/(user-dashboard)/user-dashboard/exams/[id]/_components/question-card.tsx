"use client";

import { Flag, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  text: string;
  options: string[];
}

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  selectedOption?: number;
  isReviewMarked: boolean;
  onSelect: (index: number) => void;
}

export function QuestionCard({
  question,
  currentIndex,
  selectedOption,
  isReviewMarked,
  onSelect,
}: QuestionCardProps) {
  const labels = ["A", "B", "C", "D", "E"];

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* --- Question Text --- */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          {/* Badge for Review */}
          {isReviewMarked ? (
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
              <Flag className="w-3 h-3 fill-current" /> Reviewing
            </div>
          ) : (
            <div className="h-5" /> /* Spacer to prevent layout shift */
          )}
        </div>

        <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-normal">
          {question.text.replace(`Question ${question.id}: `, "")}
        </h2>
      </div>

      {/* --- Options List --- */}
      <div className="space-y-2.5">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;

          return (
            <div
              key={index}
              onClick={() => onSelect(index)}
              className={cn(
                "group relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 active:scale-[0.98]",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20 z-10"
                  : "border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300"
              )}
            >
              {/* Label Circle (Small & Compact) */}
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mr-3 shrink-0 transition-colors border",
                  isSelected
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-gray-50 text-gray-500 border-gray-200 group-hover:border-gray-300"
                )}
              >
                {isSelected ? <Check className="w-3.5 h-3.5" /> : labels[index]}
              </div>

              {/* Text */}
              <span
                className={cn(
                  "text-sm md:text-base font-medium leading-snug",
                  isSelected ? "text-primary" : "text-gray-700"
                )}
              >
                {option}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

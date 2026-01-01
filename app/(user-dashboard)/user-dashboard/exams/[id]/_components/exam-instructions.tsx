"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Clock,
  BookOpen,
  PlayCircle,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamInstructionsProps {
  exam: {
    title: string;
    duration: number;
    totalMarks: number;
    settings?: {
      negativeMarking: boolean;
      negativeMarkValue: number;
      passMarks: number;
      shuffleQuestions: boolean;
      showResultInstant: boolean;
    };
  };
  onStart: () => void;
  onBack: () => void;
}

export function ExamInstructions({
  exam,
  onStart,
  onBack,
}: ExamInstructionsProps) {
  const settings = exam.settings || {
    negativeMarking: false,
    negativeMarkValue: 0,
    passMarks: 0,
    showResultInstant: true,
  };

  return (
    <AlertDialog open={true}>
      <AlertDialogContent className="w-[90%] max-w-[380px] rounded-2xl p-0 overflow-hidden border-0 bg-white shadow-xl">
        {/* --- Header (Compact) --- */}
        <div className="bg-gradient-to-b from-primary/10 to-white px-5 pt-6 pb-4 text-center border-b border-gray-50">
          <AlertDialogHeader className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <AlertDialogTitle className="text-lg font-bold text-gray-900 leading-tight">
              {exam.title}
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        {/* --- Body (Unified Grid) --- */}
        <div className="px-5 py-4 space-y-4">
          {/* 1. Stats Grid (Compact Boxes) */}
          <div className="grid grid-cols-2 gap-3">
            {/* Duration */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-2.5 flex flex-col items-center text-center">
              <Clock className="w-4 h-4 text-blue-600 mb-1" />
              <span className="text-sm font-bold text-gray-900">
                {exam.duration}m
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-medium">
                Time
              </span>
            </div>
            {/* Marks */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 flex flex-col items-center text-center">
              <Trophy className="w-4 h-4 text-amber-600 mb-1" />
              <span className="text-sm font-bold text-gray-900">
                {exam.totalMarks}
              </span>
              <span className="text-[10px] text-gray-500 uppercase font-medium">
                Marks
              </span>
            </div>
          </div>

          {/* 2. Configuration Info (Single Block) */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> Pass
                Mark
              </span>
              <span className="font-bold text-gray-900">
                {settings.passMarks}
              </span>
            </div>

            <div className="w-full h-px bg-gray-200/60" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                {settings.negativeMarking ? (
                  <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
                ) : (
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                )}
                Negative
              </span>
              <span
                className={cn(
                  "font-bold",
                  settings.negativeMarking ? "text-red-600" : "text-gray-900"
                )}
              >
                {settings.negativeMarking
                  ? `-${settings.negativeMarkValue}`
                  : "No"}
              </span>
            </div>

            <div className="w-full h-px bg-gray-200/60" />

            <div className="flex justify-between items-center">
              <span className="text-gray-500 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-purple-500" /> Result
              </span>
              <span className="font-bold text-gray-900">
                {settings.showResultInstant ? "Instant" : "Later"}
              </span>
            </div>
          </div>

          {/* 3. Tiny Warning */}
          <div className="flex gap-2 items-start bg-yellow-50 p-2.5 rounded-lg border border-yellow-100">
            <Info className="w-3.5 h-3.5 text-yellow-600 mt-0.5 shrink-0" />
            <p className="text-[10px] text-yellow-800 leading-snug">
              Do not refresh or close the browser once started.
            </p>
          </div>
        </div>

        {/* --- Footer (Compact Buttons) --- */}
        <AlertDialogFooter className="p-5 pt-0 flex-col-reverse gap-2 sm:flex-row sm:gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full h-9 text-xs font-semibold border-gray-200 text-gray-600"
          >
            Cancel
          </Button>
          <Button
            onClick={onStart}
            className="w-full h-9 bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-sm"
          >
            Start Now <PlayCircle className="w-3.5 h-3.5 ml-1.5" />
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

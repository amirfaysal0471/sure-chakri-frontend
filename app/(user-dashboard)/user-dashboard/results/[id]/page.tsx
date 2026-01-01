"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trophy,
  Target,
  MinusCircle,
  Loader2, // 🔥 Loader Icon Added
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/app/hooks/use-data";
import { cn } from "@/lib/utils";

// --- Types ---
interface ResultDetail {
  _id: string;
  userSelectedOptionIndex: number | null;
  correctOptionIndex: number;
  isCorrect: boolean;
  questionId: {
    _id: string;
    questionText: string;
    options: string[];
    explanation?: string;
    marks: number;
  };
}

interface ResultData {
  _id: string;
  exam: {
    title: string;
    examDate: string;
    duration: number;
  };
  totalMarks: number;
  obtainedMarks: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  isPassed: boolean;
  details: ResultDetail[];
}

export default function ResultDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  // Fetch Data
  const { data: response, isLoading } = useData<{ data: ResultData }>(
    ["result-detail", id],
    `/api/results/${id}`
  );

  const result = response?.data;

  // 🔥 Improved Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">
          Generating Solution Report...
        </p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="p-4 bg-red-50 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Result Not Found</h3>
        <Button onClick={() => router.back()} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  // Calculate Percentage
  const percentage = Math.round(
    (result.obtainedMarks / result.totalMarks) * 100
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- Top Bar --- */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {result.exam?.title}
          </h1>
          <p className="text-sm text-gray-500">Detailed Solution & Report</p>
        </div>
      </div>

      {/* --- Score Summary Card --- */}
      <Card className="bg-gradient-to-br from-white to-gray-50/50 border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            {/* Score Circle */}
            <div className="relative flex items-center justify-center w-36 h-36 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-gray-100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                />
                <path
                  className={
                    result.isPassed ? "text-green-500" : "text-red-500"
                  }
                  strokeDasharray={`${percentage}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span
                  className={cn(
                    "text-3xl font-extrabold",
                    result.isPassed ? "text-green-600" : "text-red-600"
                  )}
                >
                  {result.obtainedMarks}
                </span>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                  Out of {result.totalMarks}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
              <StatBox
                icon={Trophy}
                label="Status"
                value={result.isPassed ? "PASSED" : "FAILED"}
                color={result.isPassed ? "text-green-600" : "text-red-600"}
                bg={result.isPassed ? "bg-green-50" : "bg-red-50"}
              />
              <StatBox
                icon={CheckCircle2}
                label="Correct"
                value={result.correctCount}
                color="text-green-600"
                bg="bg-green-50"
              />
              <StatBox
                icon={XCircle}
                label="Wrong"
                value={result.wrongCount}
                color="text-red-600"
                bg="bg-red-50"
              />
              <StatBox
                icon={MinusCircle}
                label="Skipped"
                value={result.skippedCount}
                color="text-gray-500"
                bg="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Questions Analysis List --- */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-1">
          <Target className="w-5 h-5 text-primary" /> Question Analysis
        </h3>

        {result.details.map((detail, index) => (
          <QuestionResultCard key={detail._id} detail={detail} index={index} />
        ))}
      </div>
    </div>
  );
}

// --- Helper Component: Stat Box (Improved) ---
function StatBox({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center gap-1">
      <div className={cn("p-2 rounded-full mb-1", bg)}>
        <Icon className={cn("w-5 h-5", color)} />
      </div>
      <span className={cn("text-lg font-bold", color)}>{value}</span>
      <span className="text-[10px] uppercase font-bold text-gray-400">
        {label}
      </span>
    </div>
  );
}

// --- Helper Component: Single Question Card ---
function QuestionResultCard({
  detail,
  index,
}: {
  detail: ResultDetail;
  index: number;
}) {
  const { questionId: q, userSelectedOptionIndex, correctOptionIndex } = detail;
  const isSkipped = userSelectedOptionIndex === null;
  const isWrong = !isSkipped && userSelectedOptionIndex !== correctOptionIndex;

  return (
    <Card className="overflow-hidden border border-gray-200 shadow-sm">
      <CardHeader className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-row items-start gap-3">
        <span className="flex items-center justify-center w-6 h-6 rounded bg-gray-200 text-xs font-bold text-gray-600 shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 leading-snug">
            {q.questionText}
          </h4>
          <div className="flex gap-2 mt-3">
            {detail.isCorrect && (
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none border border-green-200 h-5 px-2">
                Correct
              </Badge>
            )}
            {isWrong && (
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100 shadow-none border border-red-200 h-5 px-2">
                Wrong
              </Badge>
            )}
            {isSkipped && (
              <Badge
                variant="secondary"
                className="h-5 px-2 bg-gray-100 text-gray-600"
              >
                Skipped
              </Badge>
            )}
            <Badge
              variant="outline"
              className="text-xs text-gray-500 font-normal h-5 px-2 bg-white"
            >
              Mark: {q.marks}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2.5">
        {/* Options List */}
        {q.options.map((option, optIndex) => {
          const isCorrectAnswer = optIndex === correctOptionIndex;
          const isUserSelected = optIndex === userSelectedOptionIndex;

          let optionStyle = "border-gray-200 text-gray-600 bg-white";
          let icon = null;

          if (isCorrectAnswer) {
            optionStyle =
              "bg-green-50 border-green-200 text-green-800 font-medium ring-1 ring-green-200";
            icon = <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />;
          } else if (isUserSelected && !isCorrectAnswer) {
            optionStyle =
              "bg-red-50 border-red-200 text-red-800 font-medium ring-1 ring-red-200";
            icon = <XCircle className="w-4 h-4 text-red-600 shrink-0" />;
          }

          return (
            <div
              key={optIndex}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border text-sm transition-all",
                optionStyle
              )}
            >
              <span
                className={cn(
                  "w-5 h-5 flex items-center justify-center rounded-full border text-[10px] font-bold uppercase shrink-0",
                  isCorrectAnswer
                    ? "bg-green-200 border-green-300 text-green-800"
                    : isUserSelected && !isCorrectAnswer
                    ? "bg-red-200 border-red-300 text-red-800"
                    : "bg-gray-100 border-gray-200 text-gray-500"
                )}
              >
                {String.fromCharCode(65 + optIndex)}
              </span>
              <span className="flex-1">{option}</span>
              {icon}
            </div>
          );
        })}

        {/* Explanation Section */}
        {q.explanation && (
          <div className="mt-4 pt-3 border-t border-dashed border-gray-200 animate-in fade-in">
            <p className="text-xs font-bold text-blue-600 mb-1.5 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Explanation
            </p>
            <div className="text-xs text-gray-700 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
              {q.explanation}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

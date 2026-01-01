"use client";

import { X, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ExamHeaderProps {
  title: string;
  currentIndex: number;
  totalQuestions: number;
  timeLeft: number;
  progress: number;
  onExit: () => void;
}

export function ExamHeader({
  title,
  currentIndex,
  totalQuestions,
  timeLeft,
  progress,
  onExit,
}: ExamHeaderProps) {
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isCritical = timeLeft < 60;

  return (
    <header className="flex-none bg-white/90 backdrop-blur-md border-b z-20">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between px-3 h-14">
          {/* Left: Close & Info */}
          <div className="flex items-center gap-2 overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground"
              onClick={onExit}
            >
              <X className="w-5 h-5" />
            </Button>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Question
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-gray-900">
                  {currentIndex + 1}
                </span>
                <span className="text-xs text-muted-foreground">
                  / {totalQuestions}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md border transition-all shadow-sm",
              isCritical
                ? "bg-red-50 border-red-100 text-red-600 animate-pulse"
                : "bg-white border-gray-100 text-gray-700"
            )}
          >
            {isCritical ? (
              <AlertCircle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span className="font-mono text-sm font-bold tabular-nums">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Slim Progress Bar */}
        <Progress value={progress} className="h-0.5 rounded-none bg-gray-100" />
      </div>
    </header>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";
import { useSession } from "next-auth/react";
// 🔥 1. Import QueryClient
import { useQueryClient } from "@tanstack/react-query";

import { useData } from "@/app/hooks/use-data";
import { ExamHeader } from "./_components/exam-header";
import { QuestionCard } from "./_components/question-card";
import { ExamActions } from "./_components/exam-actions";
import { ExamInstructions } from "./_components/exam-instructions";
import { Button } from "@/components/ui/button";

// --- Types ---
interface Question {
  _id: string;
  text: string;
  options: { _id: string; text: string }[] | string[];
}

interface ExamData {
  _id: string;
  title: string;
  duration: number;
  totalMarks: number;
  questions: Question[];
}

interface ApiResponse {
  success: boolean;
  hasSubmitted?: boolean; // 🔥 Added for validation check
  resultId?: string;
  data: ExamData;
}

export default function ExamInterfacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  // 🔥 2. Initialize Query Client
  const queryClient = useQueryClient();

  // Next.js 15: params unwrap
  const { id: examId } = use(params);

  // --- Data Fetching ---
  const {
    data: response,
    isLoading,
    error,
  } = useData<ApiResponse>(
    ["exam-student-view", examId],
    `/api/exams/${examId}?view=user`
  );

  const examData = response?.data;

  // --- States ---
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [markedForReview, setMarkedForReview] = useState<Set<string>>(
    new Set()
  );
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔥 3. Check if already submitted (Server Validation Redirect)
  useEffect(() => {
    if (response?.hasSubmitted && response?.resultId) {
      toast.info("You have already completed this exam.");
      router.replace(`/user-dashboard/results/${response.resultId}`);
    }
  }, [response, router]);

  // --- Initialize Timer ---
  useEffect(() => {
    if (examData?.duration) {
      setTimeLeft(examData.duration * 60);
    }
  }, [examData]);

  // --- Timer Logic ---
  useEffect(() => {
    if (!hasStarted || isLoading || !examData || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          void handleSubmit(true); // Auto submit on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [hasStarted, isLoading, examData, isSubmitting]);

  // --- Handlers ---
  const handleStartExam = () => {
    setHasStarted(true);
    toast.success("Exam started! Good luck.");
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (!examData) return;
    const currentQId = examData.questions[currentIndex]._id;
    setAnswers((prev) => ({ ...prev, [currentQId]: optionIndex }));
  };

  const toggleReview = () => {
    if (!examData) return;
    const currentQId = examData.questions[currentIndex]._id;
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(currentQId)) newSet.delete(currentQId);
      else newSet.add(currentQId);
      return newSet;
    });
  };

  // ============================================================
  // 🔥 API INTEGRATION: SUBMIT EXAM (FIXED CACHING)
  // ============================================================
  const handleSubmit = async (autoSubmit = false) => {
    if (isSubmitting) return;

    const userId = session?.user?.id;

    if (!userId) {
      toast.error("User information missing. Please login again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Backend এ ডাটা পাঠানো
      const res = await fetch(`/api/exams/${examId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: answers,
          userId: userId,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }

      toast.success(
        autoSubmit
          ? "Time's up! Submitted automatically."
          : "Exam submitted successfully!"
      );

      // ============================================================
      // 🔥🔥 4. CRITICAL: ক্যাশ ক্লিয়ার করা (Invalidate Queries)
      // ============================================================
      // এটি করার ফলে অ্যাপ বুঝতে পারবে যে ডাটা চেঞ্জ হয়েছে এবং
      // ড্যাশবোর্ড বা লাইভ এক্সাম পেজে গেলে নতুন ডাটা লোড করবে।

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["live-exams-list"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-results"] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-exams"] }),
        queryClient.invalidateQueries({ queryKey: ["routine"] }),
        queryClient.invalidateQueries({ queryKey: ["user-results-check"] }),
        queryClient.invalidateQueries({
          queryKey: ["user-results-check-routine"],
        }),
        // বর্তমান পেজের ক্যাশও ক্লিয়ার করি যাতে ব্যাক করলে পুরনো এক্সাম না দেখায়
        queryClient.invalidateQueries({
          queryKey: ["exam-student-view", examId],
        }),
      ]);

      // Redirect to Result Page (replace ব্যবহার করা ভালো যাতে ব্যাক বাটনে এক্সাম পেজে না আসে)
      router.replace(`/user-dashboard/results/${result.resultId}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Something went wrong! Please try again.");
      setIsSubmitting(false);
    }
  };

  // --- Loading State (Checking Submission Status too) ---
  if (isLoading || response?.hasSubmitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">
          {response?.hasSubmitted
            ? "Redirecting to result..."
            : "Loading exam paper..."}
        </p>
      </div>
    );
  }

  // --- Error State ---
  if (error || !examData) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Exam Not Found</h2>
        <Button
          onClick={() => router.back()}
          className="mt-6"
          variant="outline"
        >
          Go Back
        </Button>
      </div>
    );
  }

  // --- Instruction Modal ---
  if (!hasStarted) {
    return (
      <ExamInstructions
        exam={examData}
        onStart={handleStartExam}
        onBack={() => router.back()}
      />
    );
  }

  // --- Main Exam Interface ---
  const currentQuestion = examData.questions[currentIndex];
  const totalQuestions = examData.questions.length;
  const progress = (Object.keys(answers).length / totalQuestions) * 100;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 h-[100dvh] text-base">
      <ExamHeader
        title={examData.title}
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
        timeLeft={timeLeft}
        progress={progress}
        onExit={() => router.back()}
      />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full p-4 pb-6">
          <QuestionCard
            question={{
              id: currentIndex + 1,
              text: currentQuestion.text,
              options: currentQuestion.options.map((opt: any) =>
                typeof opt === "string" ? opt : opt.text
              ),
            }}
            currentIndex={currentIndex}
            selectedOption={answers[currentQuestion._id]}
            isReviewMarked={markedForReview.has(currentQuestion._id)}
            onSelect={handleOptionSelect}
          />

          <ExamActions
            currentIndex={currentIndex}
            totalQuestions={totalQuestions}
            answersCount={Object.keys(answers).length}
            isReviewMarked={markedForReview.has(currentQuestion._id)}
            isSubmitting={isSubmitting}
            onPrev={() => setCurrentIndex((p) => Math.max(0, p - 1))}
            onNext={() =>
              setCurrentIndex((p) => Math.min(totalQuestions - 1, p + 1))
            }
            onSubmit={() => handleSubmit(false)}
            onToggleReview={toggleReview}
            questions={examData.questions.map((q, i) => ({ ...q, id: i + 1 }))}
            answers={Object.keys(answers).reduce((acc: any, key) => {
              const idx = examData.questions.findIndex((q) => q._id === key);
              if (idx !== -1) acc[idx + 1] = answers[key];
              return acc;
            }, {})}
            markedForReview={
              new Set(
                Array.from(markedForReview).map((id) => {
                  return examData.questions.findIndex((q) => q._id === id) + 1;
                })
              )
            }
            onJumpToQuestion={setCurrentIndex}
          />
        </div>
      </main>
    </div>
  );
}

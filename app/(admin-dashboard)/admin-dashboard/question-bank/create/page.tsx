"use client";

import { useState } from "react";
import { useData } from "@/app/hooks/use-data";
import { usePost } from "@/app/hooks/usePost";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  BookOpen,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AddQuestionPage() {
  const router = useRouter();

  const { data: categoryData, isLoading: isCategoryLoading } = useData<any>(
    ["categories-list"],
    "/api/question-bank/categories?limit=100"
  );

  const categories = categoryData?.data?.categories || [];

  const [actionType, setActionType] = useState<"save" | "save_add_another">(
    "save"
  );

  const [formData, setFormData] = useState({
    categoryId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "", // এটি এখন Index স্ট্রিং হিসেবে থাকবে ("0", "1", ইত্যাদি)
    explanation: "",
    marks: 1,
  });

  const createMutation = usePost("/api/question-bank/questions", {
    onSuccess: () => {
      toast.success("Question added successfully!");

      if (actionType === "save_add_another") {
        setFormData((prev) => ({
          ...prev,
          questionText: "",
          optionA: "",
          optionB: "",
          optionC: "",
          optionD: "",
          correctAnswer: "", // Reset Answer
          explanation: "",
        }));
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/question-bank/list");
      }
    },
    onError: (err) => toast.error("Failed to add question: " + err.message),
  });

  const handleSubmit = (type: "save" | "save_add_another") => {
    setActionType(type);

    if (!formData.categoryId) return toast.warning("Please select a category");
    if (!formData.questionText)
      return toast.warning("Question text is required");
    // চেক করছি correctAnswer সিলেক্ট করা আছে কিনা
    if (formData.correctAnswer === "")
      return toast.warning("Please select the correct answer");

    const payload = {
      categoryId: formData.categoryId,
      questionText: formData.questionText,
      options: [
        formData.optionA,
        formData.optionB,
        formData.optionC,
        formData.optionD,
      ],
      // ⚠️ Change: String কে Number এ কনভার্ট করে Index পাঠানো হচ্ছে (0, 1, 2, 3)
      correctAnswer: Number(formData.correctAnswer),
      explanation: formData.explanation,
      marks: formData.marks,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Link href="/admin/question-bank/list">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Add New Question
          </h1>
          <p className="text-muted-foreground text-sm">
            Create a question under a specific category.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side (Category & Marks) - No Changes Here */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Select Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, categoryId: val })
                  }
                >
                  <SelectTrigger disabled={isCategoryLoading}>
                    <SelectValue
                      placeholder={
                        isCategoryLoading ? "Loading..." : "Select Category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((cat: any) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}{" "}
                          <span className="text-muted-foreground text-xs">
                            ({cat.type})
                          </span>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground text-center">
                        No categories found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  type="number"
                  value={formData.marks}
                  onChange={(e) =>
                    setFormData({ ...formData, marks: Number(e.target.value) })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side (Question Form) */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label className="text-base">
                  Question Title <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Enter your question here..."
                  className="min-h-[100px] text-base"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                />
              </div>

              {/* Options Section Updated */}
              <div className="space-y-4">
                <Label className="text-base">Options & Correct Answer</Label>

                <RadioGroup
                  value={formData.correctAnswer}
                  onValueChange={(val) =>
                    setFormData({ ...formData, correctAnswer: val })
                  }
                >
                  {["A", "B", "C", "D"].map((opt, index) => (
                    <div
                      key={opt}
                      className="flex items-center gap-3 border p-3 rounded-md bg-muted/20 hover:bg-muted/30 transition-colors"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`opt-${opt}`}
                      />
                      <Label
                        htmlFor={`opt-${opt}`}
                        className="font-bold min-w-[20px] cursor-pointer"
                      >
                        {opt}.
                      </Label>
                      <Input
                        placeholder={`Option ${opt}`}
                        className="flex-1 bg-background"
                        value={
                          formData[
                            `option${opt}` as keyof typeof formData
                          ] as string
                        }
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [`option${opt}`]: e.target.value,
                          })
                        }
                      />
                    </div>
                  ))}
                </RadioGroup>
                <p className="text-xs text-muted-foreground mt-2">
                  * Select the radio button to mark the index (0, 1, 2, 3) as
                  correct answer.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Explanation (Optional)</Label>
                <Textarea
                  placeholder="Explain why this answer is correct..."
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleSubmit("save_add_another")}
                  disabled={createMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createMutation.isPending &&
                  actionType === "save_add_another" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="mr-2 h-4 w-4" />
                  )}
                  Save & Add Another
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleSubmit("save")}
                  disabled={createMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createMutation.isPending && actionType === "save" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Question
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

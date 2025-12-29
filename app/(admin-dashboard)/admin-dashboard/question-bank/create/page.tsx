"use client";

import { useState } from "react";
import { useData } from "@/app/hooks/use-data";
import { usePost } from "@/app/hooks/usePost";
import { toast } from "sonner";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Save,
  Plus,
  Type,
  ListChecks,
  Trophy,
  Tag,
  HelpCircle,
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Make sure you have this utility or use standard class names

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
    correctAnswer: "",
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
          correctAnswer: "",
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
      correctAnswer: Number(formData.correctAnswer),
      explanation: formData.explanation,
      marks: formData.marks,
    };

    createMutation.mutate(payload);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 p-6">
      {/* --- Header --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/question-bank/list">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Create New Question
            </h1>
            <p className="text-muted-foreground text-sm">
              Add a new question to your question bank inventory.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* --- Left Sidebar: Configuration --- */}
        <div className="md:col-span-4 space-y-6">
          <Card className="border-none shadow-md bg-white">
            <CardHeader className="bg-muted/30 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Tag className="h-4 w-4 text-primary" /> Configuration
              </CardTitle>
              <CardDescription>
                Set the category and marking scheme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="font-semibold">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, categoryId: val })
                  }
                >
                  <SelectTrigger className="h-11 bg-muted/10 border-muted-foreground/20">
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
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        No categories found
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="font-semibold flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-600" /> Marks
                </Label>
                <Input
                  type="number"
                  min={1}
                  className="h-11 bg-muted/10 border-muted-foreground/20"
                  value={formData.marks}
                  onChange={(e) =>
                    setFormData({ ...formData, marks: Number(e.target.value) })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Default marks for this question is 1. You can change it.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-700 text-sm">
            <strong>Note:</strong> Ensure you select the correct answer from the
            radio buttons on the right.
          </div>
        </div>

        {/* --- Right Side: Question Content --- */}
        <div className="md:col-span-8 space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="bg-white border-b pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Type className="h-5 w-5 text-primary" /> Question Content
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 space-y-8">
              {/* Question Text */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Question Text <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  placeholder="Type your question here..."
                  className="min-h-[120px] text-base resize-none focus-visible:ring-1 focus-visible:ring-primary/30"
                  value={formData.questionText}
                  onChange={(e) =>
                    setFormData({ ...formData, questionText: e.target.value })
                  }
                />
              </div>

              {/* Options & Answer */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" /> Options &
                  Correct Answer
                </Label>

                <RadioGroup
                  value={formData.correctAnswer}
                  onValueChange={(val) =>
                    setFormData({ ...formData, correctAnswer: val })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {["A", "B", "C", "D"].map((opt, index) => {
                    const isSelected =
                      formData.correctAnswer === index.toString();
                    return (
                      <div
                        key={opt}
                        className={cn(
                          "relative flex items-center gap-3 border p-1 pr-4 rounded-lg transition-all duration-200",
                          isSelected
                            ? "border-green-500 bg-green-50 shadow-sm ring-1 ring-green-500"
                            : "bg-white hover:border-gray-400 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center justify-center w-12 h-12 shrink-0">
                          <RadioGroupItem
                            value={index.toString()}
                            id={`opt-${opt}`}
                            className="data-[state=checked]:border-green-600 data-[state=checked]:text-green-600 border-2"
                          />
                        </div>

                        <Label
                          htmlFor={`opt-${opt}`}
                          className="font-bold text-lg text-muted-foreground w-6 cursor-pointer"
                        >
                          {opt}.
                        </Label>

                        <Input
                          placeholder={`Option ${opt} text...`}
                          className={cn(
                            "flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10 text-base",
                            isSelected
                              ? "font-medium text-green-900 placeholder:text-green-300"
                              : ""
                          )}
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

                        {isSelected && (
                          <Badge className="ml-auto bg-green-600 hover:bg-green-700">
                            Correct Answer
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>

              {/* Explanation */}
              <div className="space-y-3 pt-4 border-t">
                <Label className="font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />{" "}
                  Explanation (Optional)
                </Label>
                <Textarea
                  placeholder="Explain why this answer is correct..."
                  className="min-h-[80px] bg-muted/10"
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData({ ...formData, explanation: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => handleSubmit("save_add_another")}
              disabled={createMutation.isPending}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/5"
            >
              {createMutation.isPending && actionType === "save_add_another" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Save & Add Another
            </Button>

            <Button
              size="lg"
              onClick={() => handleSubmit("save")}
              disabled={createMutation.isPending}
              className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
            >
              {createMutation.isPending && actionType === "save" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Question
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  CheckCircle2,
  HelpCircle,
  Trophy,
  Tag,
  Type,
  Save,
  X,
  LayoutDashboard,
} from "lucide-react";
import { useUpdate } from "@/app/hooks/useUpdate";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  question: any;
  categories: any[];
}

export function EditQuestionModal({
  isOpen,
  onClose,
  question,
  categories,
}: Props) {
  const queryClient = useQueryClient();

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

  // Load data when modal opens
  useEffect(() => {
    if (question && isOpen) {
      setFormData({
        categoryId: question.categoryId?._id || "",
        questionText: question.questionText || "",
        optionA: question.options?.[0] || "",
        optionB: question.options?.[1] || "",
        optionC: question.options?.[2] || "",
        optionD: question.options?.[3] || "",
        correctAnswer: question.correctAnswer?.toString() || "",
        explanation: question.explanation || "",
        marks: question.marks || 1,
      });
    }
  }, [question, isOpen]);

  const updateMutation = useUpdate("/api/question-bank/questions", {
    onSuccess: () => {
      toast.success("Question updated successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      onClose();
    },
    onError: (err) => toast.error("Failed to update: " + err.message),
  });

  const handleSubmit = () => {
    if (!formData.questionText || !formData.categoryId) {
      return toast.warning("Please fill required fields");
    }

    if (!question?._id) {
      return toast.error("Error: Question ID missing");
    }

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

    updateMutation.mutate({
      id: question._id,
      data: payload,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* 🔥 FIX: Width এবং Height ফিক্স করা হয়েছে */}
      <DialogContent className="w-full max-w-[95vw] lg:max-w-[1200px] h-[90vh] p-0 flex flex-col gap-0 overflow-hidden">
        {/* --- Header (Fixed) --- */}
        <DialogHeader className="p-6 border-b bg-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                Edit Question
              </DialogTitle>
              <DialogDescription>
                Update question content, options, and configuration.
              </DialogDescription>
            </div>
            {question?._id && (
              <Badge variant="secondary" className="font-mono text-xs">
                ID: {question._id.slice(-6).toUpperCase()}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* --- Body (Scrollable) --- */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 h-full">
            {/* Left Sidebar: Settings (Scrollable) */}
            <div className="md:col-span-3 bg-muted/20 border-r p-6 overflow-y-auto h-full">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                Configuration
              </h3>

              <div className="space-y-5">
                {/* Category Select */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="w-4 h-4 text-primary" /> Category
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, categoryId: val })
                    }
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat: any) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Marks Input */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Trophy className="w-4 h-4 text-primary" /> Marks
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={formData.marks}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marks: Number(e.target.value),
                      })
                    }
                    className="bg-white"
                  />
                </div>

                <div className="rounded-md bg-blue-50 border border-blue-100 p-3 text-xs text-blue-700 leading-relaxed">
                  <strong>Note:</strong> Changing categories will affect exam
                  filtering. Ensure the marks are appropriate for the question
                  difficulty.
                </div>
              </div>
            </div>

            {/* Right Main Area: Content (Scrollable) */}
            <div className="md:col-span-9 p-6 overflow-y-auto h-full bg-white">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Question Input */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Type className="w-4 h-4 text-primary" /> Question Text
                  </Label>
                  <Textarea
                    value={formData.questionText}
                    onChange={(e) =>
                      setFormData({ ...formData, questionText: e.target.value })
                    }
                    className="min-h-[120px] text-base leading-relaxed resize-y focus-visible:ring-primary/20"
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Options Section */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Options &
                    Correct Answer
                  </Label>

                  <RadioGroup
                    value={formData.correctAnswer}
                    onValueChange={(val) =>
                      setFormData({ ...formData, correctAnswer: val })
                    }
                    className="grid gap-3"
                  >
                    {["A", "B", "C", "D"].map((opt, index) => {
                      const isSelected =
                        formData.correctAnswer === index.toString();
                      return (
                        <div
                          key={opt}
                          className={cn(
                            "flex items-center gap-3 p-2 rounded-lg border transition-all duration-200",
                            isSelected
                              ? "border-green-500 bg-green-50/50 ring-1 ring-green-500"
                              : "border-input hover:border-primary/50 hover:bg-muted/10"
                          )}
                        >
                          <div className="flex items-center justify-center shrink-0 pl-2">
                            <RadioGroupItem
                              value={index.toString()}
                              id={`edit-opt-${opt}`}
                              className="text-green-600 border-muted-foreground/30 data-[state=checked]:border-green-600"
                            />
                          </div>

                          <Label
                            htmlFor={`edit-opt-${opt}`}
                            className="font-bold text-muted-foreground w-6 text-center cursor-pointer"
                          >
                            {opt}
                          </Label>

                          <div className="flex-1">
                            <Input
                              placeholder={`Option ${opt} text...`}
                              className={cn(
                                "border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-9 font-medium",
                                isSelected
                                  ? "text-green-900 placeholder:text-green-400"
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
                          </div>

                          {isSelected && (
                            <Badge className="mr-2 bg-green-600 hover:bg-green-700 shadow-sm">
                              Correct
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Explanation */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> Explanation
                    (Optional)
                  </Label>
                  <Textarea
                    value={formData.explanation}
                    onChange={(e) =>
                      setFormData({ ...formData, explanation: e.target.value })
                    }
                    className="min-h-[100px] bg-muted/10"
                    placeholder="Explain why the answer is correct (shown to students after exam)..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Footer (Fixed) --- */}
        <DialogFooter className="p-4 border-t bg-gray-50 shrink-0 flex items-center justify-between sm:justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <X className="w-4 h-4 mr-2" /> Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto min-w-[140px]"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" /> Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

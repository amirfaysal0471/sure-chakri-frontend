"use client";

import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle2,
  List,
  Loader2,
  Plus,
  Search,
  Filter,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

import { useData } from "@/app/hooks/use-data";
import { usePost } from "@/app/hooks/usePost";
import { useUpdate } from "@/app/hooks/useUpdate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// --- Types ---

interface Category {
  _id: string;
  name: string;
}

interface Question {
  _id: string;
  questionText: string;
  categoryId: string | { _id: string; name: string };
  marks: number;
}

// Partial interface for the incoming exam data
interface ExamData {
  _id: string;
  title: string;
  topic?: string;
  syllabus?: string; // 🔥 Added Syllabus here
  examDate?: string | Date;
  startTime?: string;
  endTime?: string;
  duration?: number;
  examCategoryId?: string | { _id: string; name?: string };
  status?: "Draft" | "Upcoming" | "Live";
  isPremium?: boolean;
  questions?: any[];
  settings?: {
    negativeMarking: boolean;
    negativeMarkValue: number;
    passMarks: number;
    shuffleQuestions: boolean;
    showResultInstant: boolean;
  };
}

interface UpdateModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
  examData: ExamData;
}

interface ExamFormData {
  title: string;
  topic: string;
  syllabus: string; // 🔥 Added Syllabus here
  examDate: string;
  startTime: string;
  endTime: string;
  duration: number;
  examCategoryId: string;
  status: "Draft" | "Upcoming" | "Live";
  isPremium: boolean;
  selectedQuestionIds: string[];
  settings: {
    negativeMarking: boolean;
    negativeMarkValue: number;
    passMarks: number;
    shuffleQuestions: boolean;
    showResultInstant: boolean;
  };
}

interface ManualQuestionFormData {
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
  marks: number;
  categoryId: string;
}

// --- Initial States ---

const INITIAL_FORM_DATA: ExamFormData = {
  title: "",
  topic: "",
  syllabus: "", // 🔥 Initial Value
  examDate: "",
  startTime: "",
  endTime: "",
  duration: 60,
  examCategoryId: "",
  status: "Draft",
  isPremium: false,
  selectedQuestionIds: [],
  settings: {
    negativeMarking: false,
    negativeMarkValue: 0.25,
    passMarks: 33,
    shuffleQuestions: false,
    showResultInstant: true,
  },
};

const INITIAL_MANUAL_Q_DATA: ManualQuestionFormData = {
  questionText: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctAnswer: "",
  explanation: "",
  marks: 1,
  categoryId: "",
};

export function UpdateExamModal({
  isOpen,
  onClose,
  examData,
}: UpdateModalProps) {
  const queryClient = useQueryClient();

  // --- Data Fetching ---
  const { data: examCatData, isLoading: isCatLoading } = useData<{
    data: Category[];
  }>(["exam-categories"], "/api/exam-categories");
  const examCategories = Array.isArray(examCatData?.data)
    ? examCatData.data
    : [];

  const { data: qBankCatData } = useData<{
    data: { categories: Category[] };
  }>(["qb-categories"], "/api/question-bank/categories?limit=100");
  const qbCategories = qBankCatData?.data?.categories || [];

  const { data: questionsData, isLoading: qLoading } = useData<{
    data: { questions: Question[] };
  }>(["all-questions"], "/api/question-bank/questions?limit=1000");

  const allQuestionsData = questionsData?.data;
  const allQuestions = Array.isArray(allQuestionsData)
    ? allQuestionsData
    : allQuestionsData?.questions || [];

  // --- States ---
  const [activeTab, setActiveTab] = useState<"select" | "manual" | "settings">(
    "select"
  );
  const [formData, setFormData] = useState<ExamFormData>(INITIAL_FORM_DATA);
  const [manualQData, setManualQData] = useState<ManualQuestionFormData>(
    INITIAL_MANUAL_Q_DATA
  );

  const [qSearch, setQSearch] = useState("");
  const [qCategoryFilter, setQCategoryFilter] = useState("All");

  // --- 🔥 FIX 1: Load Initial Data Correctly (Including Settings & Syllabus) ---
  useEffect(() => {
    if (examData && isOpen) {
      const initialQuestionIds = (examData.questions || [])
        .map((q: any) => {
          if (typeof q === "string") return q;
          return q._id || "";
        })
        .filter((id) => id !== "");

      setFormData({
        title: examData.title || "",
        topic: examData.topic || "",
        syllabus: examData.syllabus || "", // 🔥 Load Syllabus
        examDate: examData.examDate
          ? new Date(examData.examDate).toISOString().split("T")[0]
          : "",
        startTime: examData.startTime || "",
        endTime: examData.endTime || "",
        duration: examData.duration || 60,
        examCategoryId:
          typeof examData.examCategoryId === "object"
            ? examData.examCategoryId?._id || ""
            : examData.examCategoryId || "",
        status: examData.status || "Draft",
        isPremium: examData.isPremium || false,
        selectedQuestionIds: initialQuestionIds,
        // ✅ Load Settings with fallbacks
        settings: {
          negativeMarking: examData.settings?.negativeMarking ?? false,
          negativeMarkValue: examData.settings?.negativeMarkValue ?? 0.25,
          passMarks: examData.settings?.passMarks ?? 33,
          shuffleQuestions: examData.settings?.shuffleQuestions ?? false,
          showResultInstant: examData.settings?.showResultInstant ?? true,
        },
      });
    }
  }, [examData, isOpen]);

  // --- Filter Logic ---
  const filteredQuestions = useMemo(() => {
    if (!allQuestions || !Array.isArray(allQuestions)) return [];

    const searchLower = qSearch.toLowerCase();

    return allQuestions.filter((q) => {
      const matchesSearch = q.questionText?.toLowerCase().includes(searchLower);

      let qCatId = "";
      if (q.categoryId) {
        if (typeof q.categoryId === "object") qCatId = q.categoryId._id || "";
        else if (typeof q.categoryId === "string") qCatId = q.categoryId;
      }

      const matchesCategory =
        qCategoryFilter === "All" || qCatId === qCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [allQuestions, qSearch, qCategoryFilter]);

  // --- Mutations ---
  const updateMutation = useUpdate("/api/exams", {
    onSuccess: () => {
      toast.success("Exam updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["exams-list"] });
      onClose(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const createQuestionMutation = usePost("/api/question-bank/questions", {
    onSuccess: (data: { data: { _id: string } }) => {
      toast.success("Question created and selected!");
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });

      if (data?.data?._id) {
        setFormData((prev) => ({
          ...prev,
          selectedQuestionIds: [data.data._id, ...prev.selectedQuestionIds],
        }));
      }

      setManualQData(INITIAL_MANUAL_Q_DATA);
      setQSearch("");
      setQCategoryFilter("All");
      setActiveTab("select");
    },
    onError: (err) => toast.error(`Failed to create question: ${err.message}`),
  });

  // --- Handlers ---
  const handleQuestionToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedQuestionIds.includes(id);
      return {
        ...prev,
        selectedQuestionIds: exists
          ? prev.selectedQuestionIds.filter((qId) => qId !== id)
          : [...prev.selectedQuestionIds, id],
      };
    });
  };

  // 🔥 Setting Change Handler
  const handleSettingChange = (
    key: keyof typeof formData.settings,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [key]: value,
      },
    }));
  };

  const handleSaveManualQuestion = () => {
    if (!manualQData.questionText || manualQData.correctAnswer === "") {
      return toast.warning("Question text and correct answer are required.");
    }

    let catIdToUse = manualQData.categoryId;
    if (!catIdToUse) {
      if (qCategoryFilter !== "All") {
        catIdToUse = qCategoryFilter;
      } else if (qbCategories.length > 0) {
        catIdToUse = qbCategories[0]._id;
      }
    }

    if (!catIdToUse) {
      return toast.warning("Please select a category.");
    }

    const payload = {
      categoryId: catIdToUse,
      questionText: manualQData.questionText,
      options: [
        manualQData.optionA,
        manualQData.optionB,
        manualQData.optionC,
        manualQData.optionD,
      ],
      correctAnswer: Number(manualQData.correctAnswer),
      explanation: manualQData.explanation,
      marks: manualQData.marks,
    };

    createQuestionMutation.mutate(payload);
  };

  const handleUpdate = () => {
    if (!formData.title || !formData.examCategoryId || !formData.examDate) {
      return toast.warning("Please fill required fields (*)");
    }

    const payload = {
      ...formData, // Syllabus included here automatically via spread
      questions: formData.selectedQuestionIds,
      totalMarks: formData.selectedQuestionIds.length,
    };

    updateMutation.mutate({ id: examData._id, data: payload });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] flex-col p-0 sm:max-w-[1100px]">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Update Exam</DialogTitle>
        </DialogHeader>

        <div className="grid flex-1 grid-cols-1 overflow-hidden md:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="space-y-4 overflow-y-auto border-r bg-gray-50/50 p-6 md:col-span-4">
            <div className="space-y-2">
              <Label htmlFor="exam-title">Exam Title *</Label>
              <Input
                id="exam-title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-topic">Topic *</Label>
              <Textarea
                id="exam-topic"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
                className="min-h-[60px]"
              />
            </div>

            {/* 🔥 Syllabus Field Added */}
            <div className="space-y-2">
              <Label htmlFor="exam-syllabus">Syllabus Details</Label>
              <Textarea
                id="exam-syllabus"
                placeholder="Ex: Chapter 1-5, Algebra, Liberation War..."
                value={formData.syllabus}
                onChange={(e) =>
                  setFormData({ ...formData, syllabus: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Exam Category *</Label>
              <Select
                key={
                  isCatLoading ? "loading" : `loaded-${examCategories.length}`
                }
                value={formData.examCategoryId}
                onValueChange={(val) =>
                  setFormData({ ...formData, examCategoryId: val })
                }
                disabled={isCatLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={isCatLoading ? "Loading..." : "Select"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {examCategories.length > 0 ? (
                    examCategories.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-xs text-center text-muted-foreground">
                      No categories found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-date">Date *</Label>
                <Input
                  id="exam-date"
                  type="date"
                  value={formData.examDate}
                  onChange={(e) =>
                    setFormData({ ...formData, examDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-duration">Duration *</Label>
                <Input
                  id="exam-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-start-time">Start Time *</Label>
                <Input
                  id="exam-start-time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-end-time">End Time</Label>
                <Input
                  id="exam-end-time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: "Draft" | "Upcoming" | "Live") =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 flex items-center gap-2">
                <Switch
                  id="exam-premium"
                  checked={formData.isPremium}
                  onCheckedChange={(val) =>
                    setFormData({ ...formData, isPremium: val })
                  }
                />
                <Label htmlFor="exam-premium">Premium?</Label>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex h-full flex-col overflow-hidden p-6 md:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab("select")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs md:text-sm font-medium transition-all",
                    activeTab === "select"
                      ? "bg-white text-primary shadow"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <List size={14} /> Select
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("manual")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs md:text-sm font-medium transition-all",
                    activeTab === "manual"
                      ? "bg-white text-primary shadow"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Plus size={14} /> New Question
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("settings")}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs md:text-sm font-medium transition-all",
                    activeTab === "settings"
                      ? "bg-white text-primary shadow"
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  <Settings size={14} /> Settings
                </button>
              </div>
              <Badge variant="secondary">
                Selected: {formData.selectedQuestionIds.length}
              </Badge>
            </div>

            {/* TAB: SELECT EXISTING */}
            {activeTab === "select" && (
              <>
                <div className="mb-4 space-y-3 rounded bg-muted/20 p-3">
                  <div className="flex gap-2">
                    <Select
                      value={qCategoryFilter}
                      onValueChange={setQCategoryFilter}
                    >
                      <SelectTrigger className="h-9 flex-1 bg-background">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Filter size={14} />
                          <SelectValue placeholder="Filter Category" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Categories</SelectItem>
                        {qbCategories.map((c) => (
                          <SelectItem key={c._id} value={c._id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="h-9 bg-background pl-9"
                      value={qSearch}
                      onChange={(e) => setQSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-hidden rounded border bg-background">
                  <ScrollArea className="h-full">
                    <div className="divide-y">
                      {qLoading ? (
                        <div className="p-4 text-center">
                          <Loader2 className="inline animate-spin" />
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="flex h-40 flex-col items-center justify-center gap-2 text-muted-foreground">
                          <AlertCircle className="size-8 opacity-20" />
                          <span className="text-sm">No questions found.</span>
                        </div>
                      ) : (
                        filteredQuestions.map((q) => (
                          <div
                            key={q._id}
                            className={cn(
                              "flex cursor-pointer items-start gap-3 p-3 hover:bg-muted/50",
                              formData.selectedQuestionIds.includes(q._id) &&
                                "bg-primary/5"
                            )}
                            onClick={() => handleQuestionToggle(q._id)}
                          >
                            <Checkbox
                              checked={formData.selectedQuestionIds.includes(
                                q._id
                              )}
                              onCheckedChange={() =>
                                handleQuestionToggle(q._id)
                              }
                              className="mt-1"
                            />
                            <div className="flex-1 space-y-1">
                              <p className="line-clamp-2 text-sm">
                                {q.questionText}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px]"
                                >
                                  {q.marks} Mark
                                </Badge>
                                {q.categoryId && (
                                  <Badge
                                    variant="secondary"
                                    className="text-[10px]"
                                  >
                                    {typeof q.categoryId === "object"
                                      ? q.categoryId.name
                                      : "Cat"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </>
            )}

            {/* TAB: MANUAL ENTRY */}
            {activeTab === "manual" && (
              <div className="flex-1 space-y-4 overflow-y-auto rounded-md border bg-background p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">
                    Add New Question to Bank
                  </h4>
                  <Button
                    size="sm"
                    onClick={handleSaveManualQuestion}
                    disabled={createQuestionMutation.isPending}
                  >
                    {createQuestionMutation.isPending ? (
                      <Loader2 className="mr-2 size-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 size-3" />
                    )}
                    Save & Select
                  </Button>
                </div>
                {/* Manual Question Form Fields */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Category *</Label>
                    <Select
                      value={manualQData.categoryId}
                      onValueChange={(val) =>
                        setManualQData({ ...manualQData, categoryId: val })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {qbCategories.map((cat) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="q-text">Question *</Label>
                    <Textarea
                      id="q-text"
                      placeholder="Type question..."
                      value={manualQData.questionText}
                      onChange={(e) =>
                        setManualQData({
                          ...manualQData,
                          questionText: e.target.value,
                        })
                      }
                      className="min-h-[80px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Options & Answer</Label>
                    <RadioGroup
                      value={manualQData.correctAnswer}
                      onValueChange={(val) =>
                        setManualQData({ ...manualQData, correctAnswer: val })
                      }
                    >
                      {["A", "B", "C", "D"].map((opt, idx) => (
                        <div key={opt} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={idx.toString()}
                            id={`up-opt-${opt}`}
                          />
                          <Label
                            htmlFor={`up-opt-${opt}`}
                            className="w-4 font-bold"
                          >
                            {opt}
                          </Label>
                          <Input
                            placeholder={`Option ${opt}`}
                            className="h-8"
                            value={
                              manualQData[
                                `option${opt}` as keyof ManualQuestionFormData
                              ] as string
                            }
                            onChange={(e) =>
                              setManualQData({
                                ...manualQData,
                                [`option${opt}`]: e.target.value,
                              })
                            }
                          />
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="q-marks">Marks</Label>
                      <Input
                        id="q-marks"
                        type="number"
                        className="h-9"
                        value={manualQData.marks}
                        onChange={(e) =>
                          setManualQData({
                            ...manualQData,
                            marks: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="q-explanation">Explanation</Label>
                    <Textarea
                      id="q-explanation"
                      placeholder="Optional explanation..."
                      className="h-16"
                      value={manualQData.explanation}
                      onChange={(e) =>
                        setManualQData({
                          ...manualQData,
                          explanation: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 🔥 TAB: SETTINGS (New) */}
            {activeTab === "settings" && (
              <div className="flex-1 overflow-y-auto border rounded-md bg-background p-6 space-y-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Exam Configuration
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Manage negative marking, pass marks and visibility.
                    </p>
                  </div>
                  <Settings className="text-muted-foreground opacity-20 h-10 w-10" />
                </div>

                {/* 1. Negative Marking */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-muted/30 p-3 rounded-lg border">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">
                        Negative Marking
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Deduct marks for wrong answers
                      </p>
                    </div>
                    <Switch
                      checked={formData.settings.negativeMarking}
                      onCheckedChange={(val) =>
                        handleSettingChange("negativeMarking", val)
                      }
                    />
                  </div>

                  {formData.settings.negativeMarking && (
                    <div className="ml-2 pl-4 border-l-2 border-primary/20 animate-in slide-in-from-top-2">
                      <Label className="mb-2 block text-sm">
                        Negative Mark Value (Per Wrong Answer)
                      </Label>
                      <div className="flex gap-2 flex-wrap">
                        {[0.25, 0.5, 1.0].map((val) => (
                          <div
                            key={val}
                            onClick={() =>
                              handleSettingChange("negativeMarkValue", val)
                            }
                            className={`cursor-pointer px-4 py-2 rounded border text-sm font-medium transition-all ${
                              formData.settings.negativeMarkValue === val
                                ? "bg-primary text-white border-primary"
                                : "bg-background hover:bg-muted"
                            }`}
                          >
                            {val}
                          </div>
                        ))}
                        <div className="flex items-center gap-1 border rounded px-2 bg-background">
                          <span className="text-muted-foreground text-xs">
                            Custom:
                          </span>
                          <Input
                            type="number"
                            className="h-8 w-16 border-none focus-visible:ring-0 p-0 shadow-none"
                            value={formData.settings.negativeMarkValue}
                            onChange={(e) =>
                              handleSettingChange(
                                "negativeMarkValue",
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Pass Marks */}
                <div className="space-y-2 pt-2">
                  <Label className="text-base font-medium">
                    Pass Mark (Percentage %)
                  </Label>
                  <div className="flex items-center gap-4 bg-muted/30 p-3 rounded-lg border">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={formData.settings.passMarks}
                        onChange={(e) =>
                          handleSettingChange(
                            "passMarks",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 bg-background"
                      />
                      <span className="font-bold text-muted-foreground">%</span>
                    </div>
                    <div className="text-sm text-muted-foreground border-l pl-4">
                      Total Questions:{" "}
                      <strong>{formData.selectedQuestionIds.length}</strong>.
                      <br />
                      Students need{" "}
                      <strong className="text-primary">
                        {Math.ceil(
                          (formData.selectedQuestionIds.length *
                            formData.settings.passMarks) /
                            100
                        )}
                      </strong>{" "}
                      marks to pass.
                    </div>
                  </div>
                </div>

                {/* 3. Other Toggles */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Label className="cursor-pointer" htmlFor="shuffle">
                      Shuffle Questions
                    </Label>
                    <Switch
                      id="shuffle"
                      checked={formData.settings.shuffleQuestions}
                      onCheckedChange={(val) =>
                        handleSettingChange("shuffleQuestions", val)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <Label className="cursor-pointer" htmlFor="instant-result">
                      Show Result Immediately
                    </Label>
                    <Switch
                      id="instant-result"
                      checked={formData.settings.showResultInstant}
                      onCheckedChange={(val) =>
                        handleSettingChange("showResultInstant", val)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="border-t bg-muted/5 px-6 py-4">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={updateMutation.isPending}
            className="min-w-[120px]"
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}
            Update Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

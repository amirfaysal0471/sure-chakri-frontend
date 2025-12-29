"use client";

import { useState, useMemo } from "react";
import { useData } from "@/app/hooks/use-data";
import { usePost } from "@/app/hooks/usePost";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  Search,
  Filter,
  AlertCircle,
  Plus,
  List,
  CheckCircle2,
  Settings,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function CreateExamModal({ isOpen, onClose }: ModalProps) {
  const queryClient = useQueryClient();

  // --- 1. DATA FETCHING ---
  const { data: examCatData, isLoading: isCatLoading } = useData<any>(
    ["exam-categories"],
    "/api/exam-categories"
  );
  const examCategories = Array.isArray(examCatData?.data)
    ? examCatData.data
    : [];

  const { data: qBankCatData } = useData<any>(
    ["qb-categories"],
    "/api/question-bank/categories?limit=100"
  );
  const qbCategories = qBankCatData?.data?.categories || [];

  const { data: questionsData, isLoading: qLoading } = useData<any>(
    ["all-questions"],
    "/api/question-bank/questions?limit=1000"
  );
  const questionsList = Array.isArray(questionsData?.data)
    ? questionsData?.data
    : questionsData?.data?.questions || [];

  // --- 2. STATES ---
  const [activeTab, setActiveTab] = useState<"select" | "manual" | "settings">(
    "select"
  );

  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    syllabus: "", // 🔥 Added Syllabus Field
    examDate: "",
    startTime: "",
    endTime: "",
    duration: 60,
    examCategoryId: "",
    status: "Draft",
    isPremium: false,
    selectedQuestionIds: [] as string[],
    settings: {
      negativeMarking: false,
      negativeMarkValue: 0.25,
      passMarks: 33,
      shuffleQuestions: false,
      showResultInstant: true,
    },
  });

  const [manualQData, setManualQData] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
    explanation: "",
    marks: 1,
    categoryId: "",
  });

  const [qSearch, setQSearch] = useState("");
  const [qCategoryFilter, setQCategoryFilter] = useState("All");

  // --- 3. FILTER LOGIC ---
  const filteredQuestions = useMemo(() => {
    if (!questionsList || !Array.isArray(questionsList)) return [];
    return questionsList.filter((q: any) => {
      const matchesSearch = q.questionText
        ?.toLowerCase()
        .includes(qSearch.toLowerCase());
      let qCatId = "Uncategorized";
      if (q.categoryId) {
        if (typeof q.categoryId === "object") {
          qCatId = q.categoryId._id || "";
        } else if (typeof q.categoryId === "string") {
          qCatId = q.categoryId;
        }
      }
      const matchesCategory =
        qCategoryFilter === "All" || qCatId === qCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [questionsList, qSearch, qCategoryFilter]);

  // --- 4. HANDLERS ---
  const handleQuestionToggle = (id: string) => {
    setFormData((prev) => {
      const exists = prev.selectedQuestionIds.includes(id);
      if (exists) {
        return {
          ...prev,
          selectedQuestionIds: prev.selectedQuestionIds.filter(
            (qId) => qId !== id
          ),
        };
      } else {
        return {
          ...prev,
          selectedQuestionIds: [...prev.selectedQuestionIds, id],
        };
      }
    });
  };

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

  // Mutations
  const createExamMutation = usePost("/api/exams", {
    onSuccess: () => {
      toast.success("Exam created successfully!");
      queryClient.invalidateQueries({ queryKey: ["exams-list"] });
      onClose(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const createQuestionMutation = usePost("/api/question-bank/questions", {
    onSuccess: (data: any) => {
      toast.success("Question created and selected!");
      queryClient.invalidateQueries({ queryKey: ["all-questions"] });
      if (data?.data?._id) {
        setFormData((prev) => ({
          ...prev,
          selectedQuestionIds: [data.data._id, ...prev.selectedQuestionIds],
        }));
      }
      setManualQData({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        explanation: "",
        marks: 1,
        categoryId: "",
      });
      setActiveTab("select");
    },
    onError: (err) => toast.error("Failed to create question: " + err.message),
  });

  const handleCreateExam = () => {
    if (!formData.title || !formData.examCategoryId || !formData.examDate) {
      return toast.warning("Please fill required fields (*)");
    }
    const payload = {
      ...formData, // Syllabus automatically included here
      questions: formData.selectedQuestionIds,
      totalMarks: formData.selectedQuestionIds.length,
    };
    createExamMutation.mutate(payload);
  };

  const handleSaveManualQuestion = () => {
    if (!manualQData.questionText || manualQData.correctAnswer === "") {
      return toast.warning("Question text and correct answer are required.");
    }
    let catIdToUse = manualQData.categoryId;
    if (!catIdToUse) {
      if (qCategoryFilter !== "All") catIdToUse = qCategoryFilter;
      else if (qbCategories.length > 0) catIdToUse = qbCategories[0]._id;
    }
    if (!catIdToUse) return toast.warning("Please select a category.");

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1100px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Create New Exam</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* --- LEFT COLUMN: EXAM DETAILS --- */}
          <div className="md:col-span-4 p-6 overflow-y-auto space-y-4 border-r bg-gray-50/50">
            <h3 className="font-semibold flex items-center gap-2 text-primary">
              <span className="bg-primary/10 px-2 py-0.5 rounded text-sm">
                1
              </span>{" "}
              Exam Details
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <Label>Exam Title *</Label>
              <Input
                placeholder="Ex: 46th BCS Model Test"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <Label>Topic / Subject *</Label>
              <Input
                placeholder="Ex: General Knowledge"
                value={formData.topic}
                onChange={(e) =>
                  setFormData({ ...formData, topic: e.target.value })
                }
              />
            </div>

            {/* 🔥 Syllabus Input Added */}
            <div className="space-y-2">
              <Label>Syllabus Details</Label>
              <Textarea
                placeholder="Ex: Chapter 1-5, Algebra, Liberation War..."
                value={formData.syllabus}
                onChange={(e) =>
                  setFormData({ ...formData, syllabus: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Exam Category *</Label>
              <Select
                key={
                  isCatLoading
                    ? "loading"
                    : `loaded-${examCategories.length}-${formData.examCategoryId}`
                }
                value={formData.examCategoryId}
                onValueChange={(val) =>
                  setFormData({ ...formData, examCategoryId: val })
                }
                disabled={isCatLoading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isCatLoading ? "Loading..." : "Select Exam Category"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-[200px]">
                    {examCategories.length > 0 ? (
                      examCategories.map((cat: any) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-center text-muted-foreground">
                        No categories found
                      </div>
                    )}
                  </ScrollArea>
                </SelectContent>
              </Select>
            </div>

            {/* Date & Duration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) =>
                    setFormData({ ...formData, examDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Duration (Min) *</Label>
                <Input
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

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) =>
                    setFormData({ ...formData, startTime: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) =>
                    setFormData({ ...formData, endTime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val as any })
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
              <div className="flex flex-col gap-2 justify-center">
                <Label>Is Premium?</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.isPremium}
                    onCheckedChange={(val) =>
                      setFormData({ ...formData, isPremium: val })
                    }
                  />
                  <span className="text-sm text-muted-foreground">
                    {formData.isPremium ? "Paid" : "Free"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: QUESTION SELECTION & SETTINGS --- */}
          <div className="md:col-span-8 p-6 flex flex-col h-full overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("select")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all ${
                    activeTab === "select"
                      ? "bg-white shadow text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <List size={14} /> Select
                </button>
                <button
                  onClick={() => setActiveTab("manual")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all ${
                    activeTab === "manual"
                      ? "bg-white shadow text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Plus size={14} /> Create New
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-md transition-all ${
                    activeTab === "settings"
                      ? "bg-white shadow text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Settings size={14} /> Settings
                </button>
              </div>
              <Badge variant="secondary">
                Total Selected: {formData.selectedQuestionIds.length}
              </Badge>
            </div>

            {/* TAB: SELECT EXISTING */}
            {activeTab === "select" && (
              <>
                <div className="space-y-3 mb-4 bg-muted/20 p-3 rounded-lg border">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        value={qCategoryFilter}
                        onValueChange={setQCategoryFilter}
                      >
                        <SelectTrigger className="h-9 bg-background">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Filter size={14} />
                            <SelectValue placeholder="Filter Category" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All Categories</SelectItem>
                          {qbCategories.map((cat: any) => (
                            <SelectItem key={cat._id} value={cat._id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search questions..."
                      className="pl-9 h-9 bg-background"
                      value={qSearch}
                      onChange={(e) => setQSearch(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex-1 border rounded-md bg-background overflow-hidden relative">
                  <ScrollArea className="h-full">
                    <div className="divide-y">
                      {qLoading ? (
                        <div className="flex justify-center p-8">
                          <Loader2 className="animate-spin" />
                        </div>
                      ) : filteredQuestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground">
                          <AlertCircle className="opacity-20 h-8 w-8" />
                          <span className="text-sm">No questions found.</span>
                        </div>
                      ) : (
                        filteredQuestions.map((q: any) => (
                          <div
                            key={q._id}
                            className={`flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                              formData.selectedQuestionIds.includes(q._id)
                                ? "bg-primary/5"
                                : ""
                            }`}
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
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-medium line-clamp-2 leading-snug">
                                {q.questionText}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="text-[10px] h-5 px-1.5 bg-background"
                                >
                                  {q.marks} Mark
                                </Badge>
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] h-5 px-1.5"
                                >
                                  {typeof q.categoryId === "object"
                                    ? q.categoryId?.name
                                    : "Category"}
                                </Badge>
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
              <div className="flex-1 overflow-y-auto border rounded-md bg-background p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm">
                    Add New Question to Bank
                  </h4>
                  <Button
                    size="sm"
                    onClick={handleSaveManualQuestion}
                    disabled={createQuestionMutation.isPending}
                  >
                    {createQuestionMutation.isPending ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <CheckCircle2 className="mr-2 h-3 w-3" />
                    )}
                    Save & Select
                  </Button>
                </div>
                {/* ... Manual Form ... */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label>Question Category *</Label>
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
                        {qbCategories.map((cat: any) => (
                          <SelectItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Question Text *</Label>
                    <Textarea
                      placeholder="Type question here..."
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
                            id={`m-opt-${opt}`}
                          />
                          <Label
                            htmlFor={`m-opt-${opt}`}
                            className="font-bold w-4"
                          >
                            {opt}
                          </Label>
                          <Input
                            placeholder={`Option ${opt}`}
                            className="h-8"
                            value={
                              manualQData[
                                `option${opt}` as keyof typeof manualQData
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
                  <div className="space-y-1">
                    <Label>Marks</Label>
                    <Input
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
              </div>
            )}

            {/* TAB: EXAM SETTINGS */}
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

        <DialogFooter className="px-6 py-4 border-t bg-muted/5">
          <Button variant="outline" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateExam}
            disabled={createExamMutation.isPending}
            className="min-w-[120px]"
          >
            {createExamMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}{" "}
            Create Exam
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

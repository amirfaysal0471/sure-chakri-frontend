"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Hooks
import { useData } from "@/app/hooks/use-data";
import { useDelete } from "@/app/hooks/useDelete";
import { useUpdate } from "@/app/hooks/useUpdate";

// Refactored Components
import { QuestionKPICards } from "./_components/question-kpi-cards";
import { QuestionFilters } from "./_components/question-filters";
import { QuestionTable } from "./_components/question-table";
import { DeleteAlertDialog } from "./_components/delete-alert-dialog";
import { EditQuestionModal } from "./_components/edit-question-modal";

export default function QuestionsPage() {
  const queryClient = useQueryClient();

  // --- States ---
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null); // For Edit

  // --- Data Fetching ---

  // 1. Fetch Categories
  const { data: catData } = useData<any>(
    ["qb-categories"],
    "/api/question-bank/categories?limit=100"
  );
  const categories = catData?.data?.categories || [];

  // 2. Fetch Questions
  const queryUrl = `/api/question-bank/questions?page=${page}&limit=${limit}&search=${search}&category=${categoryFilter}`;
  const { data: qData, isLoading } = useData<any>(
    ["questions", page, search, categoryFilter],
    queryUrl
  );

  const questions = qData?.data || [];
  const metadata = qData?.metadata || { total: 0, totalPages: 1 };

  // --- Mutations ---

  // 1. Delete Mutation
  const deleteMutation = useDelete("/api/question-bank/questions", {
    onSuccess: () => {
      toast.success("Question deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
      setDeleteId(null);
    },
    onError: (err) => toast.error("Failed to delete: " + err.message),
  });

  // 2. Status Update Mutation (Toggle Active/Inactive)
  const statusUpdateMutation = useUpdate("/api/question-bank/questions", {
    onSuccess: () => {
      toast.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
    onError: (err) => toast.error("Failed to update status"),
  });

  // --- Handlers ---

  const handleStatusChange = (id: string, newStatus: string) => {
    statusUpdateMutation.mutate({
      id: id,
      data: { status: newStatus },
    });
  };

  return (
    // 🔥 Layout Fix: h-full or specific calc height to fit in dashboard
    <div className="flex flex-col h-[calc(100vh-50px)] p-6 gap-4 overflow-hidden">
      {/* --- Top Section (Header, KPI, Filters) - Fixed --- */}
      <div className="flex-none space-y-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Question Bank</h1>
            <p className="text-muted-foreground text-sm">
              Manage all your exam questions here.
            </p>
          </div>
          <Link href="/admin-dashboard/question-bank/create">
            <Button className="gap-2">
              <Plus size={16} /> Add New Question
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <QuestionKPICards
          total={metadata.total}
          active={questions.filter((q: any) => q.status === "Active").length}
          categoriesCount={categories.length}
        />

        {/* Filters */}
        <QuestionFilters
          search={search}
          setSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          categoryFilter={categoryFilter}
          setCategoryFilter={(val) => {
            setCategoryFilter(val);
            setPage(1);
          }}
          categories={categories}
          totalData={metadata.total}
          currentDataLength={questions.length}
        />
      </div>

      {/* --- Middle Section (Table) - Scrollable --- */}
      {/* 🔥 FIX: 'min-h-0' is crucial here for nested flex scrolling */}
      <div className="">
        <QuestionTable
          questions={questions}
          isLoading={isLoading}
          onEdit={(question) => setSelectedQuestion(question)}
          onDelete={(id) => setDeleteId(id)}
          onStatusChange={handleStatusChange}
          startIndex={(page - 1) * limit}
        />
      </div>

      {/* --- Bottom Section (Pagination) - Fixed --- */}
      <div className="flex-none pt-2 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {metadata.page} of {metadata.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= metadata.totalPages || isLoading}
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* --- Modals --- */}
      <DeleteAlertDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        isDeleting={deleteMutation.isPending}
      />

      <EditQuestionModal
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        question={selectedQuestion}
        categories={categories}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExamStats } from "./_components/ExamStats";
import { CreateExamModal } from "./_components/CreateExamModal";
import { UpdateExamModal } from "./_components/UpdateExamModal";
import { DeleteConfirmationModal } from "./_components/DeleteConfirmationModal";
import { useData } from "@/app/hooks/use-data";
import { useDelete } from "@/app/hooks/useDelete";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaginationControls } from "@/app/components/ui/pagination-controls";

export default function ExamsPage() {
  // --- STATES ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Pagination & Search States
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10; // প্রতি পেজে ১০টি ডাটা

  // --- DATA FETCHING ---
  const { data: examsData, isLoading } = useData<any>(
    ["exams-list"],
    "/api/exams"
  );
  const exams = examsData?.data || [];

  // --- FILTER & PAGINATION LOGIC ---

  // 1. Search Filter
  const filteredExams = exams.filter((exam: any) =>
    exam.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Pagination Calculations
  const totalItems = filteredExams.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredExams.slice(startIndex, endIndex);

  // --- STATS ---
  const stats = {
    total: exams.length,
    live: exams.filter((e: any) => e.status === "Live").length,
    upcoming: exams.filter((e: any) => e.status === "Upcoming").length,
    draft: exams.filter((e: any) => e.status === "Draft").length,
  };

  // --- DELETE MUTATION ---
  const deleteMutation = useDelete("/api/exams", {
    invalidateKeys: ["exams-list"],
    onSuccess: () => {
      toast.success("Exam deleted successfully");
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    },
    onError: (err) => toast.error("Failed to delete: " + err.message),
  });

  // --- HANDLERS ---
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  const handleEdit = (exam: any) => {
    setExamToEdit(exam);
    setIsUpdateModalOpen(true);
  };

  const handleCreate = () => {
    setExamToEdit(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Exam Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage and schedule exams.
          </p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={16} /> Create Exam
        </Button>
      </div>

      {/* STATS */}
      <ExamStats
        totalExams={stats.total}
        live={stats.live}
        upcoming={stats.upcoming}
        draft={stats.draft}
      />

      {/* FILTERS */}
      <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-lg border">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exams..."
            className="pl-9 bg-background"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // সার্চ করলে পেজ ১ এ রিসেট হবে
            }}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">SL</TableHead>{" "}
              {/* 🔥 Serial Column */}
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  Loading...
                </TableCell>
              </TableRow>
            ) : currentData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No exams found.
                </TableCell>
              </TableRow>
            ) : (
              currentData.map((exam: any, index: number) => (
                <TableRow key={exam._id}>
                  {/* 🔥 SL Logic: (Page-1)*Limit + Index + 1 */}
                  <TableCell className="font-medium text-muted-foreground">
                    {startIndex + index + 1}
                  </TableCell>

                  <TableCell className="font-medium">{exam.title}</TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {exam.examCategoryId?.name || "N/A"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-sm">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {exam.startTime}
                    </div>
                  </TableCell>

                  <TableCell>{exam.duration} mins</TableCell>

                  <TableCell>
                    <Badge
                      className={
                        exam.status === "Live"
                          ? "bg-green-500"
                          : exam.status === "Draft"
                          ? "bg-gray-500"
                          : "bg-blue-500"
                      }
                    >
                      {exam.status}
                    </Badge>
                    {exam.isPremium && (
                      <Badge
                        variant="outline"
                        className="ml-2 text-yellow-600 border-yellow-600"
                      >
                        Pro
                      </Badge>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(exam)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteClick(exam._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 🔥 PAGINATION CONTROLS */}
      {!isLoading && totalItems > 0 && (
        <div className="mt-4">
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}

      {/* MODALS */}
      {isCreateModalOpen && (
        <CreateExamModal
          isOpen={isCreateModalOpen}
          onClose={setIsCreateModalOpen}
        />
      )}

      {isUpdateModalOpen && examToEdit && (
        <UpdateExamModal
          isOpen={isUpdateModalOpen}
          onClose={setIsUpdateModalOpen}
          examData={examToEdit}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

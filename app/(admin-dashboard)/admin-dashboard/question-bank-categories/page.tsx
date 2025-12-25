"use client";

import { useState } from "react";
import { Plus, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Hooks
import { usePost } from "@/app/hooks/usePost";
import { useUpdate } from "@/app/hooks/useUpdate";
import { useDelete } from "@/app/hooks/useDelete";
import { useData } from "@/app/hooks/use-data";

// Custom Components
import { CategoryStats } from "./_components/CategoryStats";
import { CategoryFilters } from "./_components/CategoryFilters";
import { CategoryTable } from "./_components/CategoryTable";
import { CategoryPagination } from "./_components/CategoryPagination";
import { CategoryFormModal } from "./_components/CategoryFormModal";
import { ExamTypeModal } from "./_components/ExamTypeModal";
import { DeleteConfirmationModal } from "./_components/DeleteConfirmationModal";

const EXAM_TYPES_LIST = [
  // --- Major Categories ---
  { id: "t1", name: "BCS" },
  { id: "t2", name: "Bank Jobs" },
  { id: "t3", name: "Primary School" },
  { id: "t4", name: "NTRCA (Teacher Registration)" },
  { id: "t5", name: "Defense (Army/Navy/Air Force)" },

  // --- Specific Govt Bodies ---
  { id: "t6", name: "Bangladesh Railway" },
  { id: "t7", name: "BPSC Non-Cadre" },
  { id: "t8", name: "BJS (Judiciary)" },
  { id: "t9", name: "Bar Council" },
  { id: "t10", name: "NSI & DGFI (Intelligence)" },
  { id: "t11", name: "Police (SI/Sergeant/Constable)" },
  { id: "t12", name: "Ansar & VDP" },
  { id: "t13", name: "Fire Service & Civil Defence" },
  { id: "t14", name: "Border Guard Bangladesh (BGB)" },
  { id: "t15", name: "Coast Guard" },

  // --- Education & Admission ---
  { id: "t16", name: "University Admission" },
  { id: "t17", name: "Medical Admission" },
  { id: "t18", name: "Engineering Admission" },
  { id: "t19", name: "Cadet College Admission" },
  { id: "t20", name: "DSHE (Secondary Education)" },

  // --- Departments & Directorates ---
  { id: "t21", name: "Food Directorate" },
  { id: "t22", name: "Audit & Accounts (CAG)" },
  { id: "t23", name: "Tax & Customs" },
  { id: "t24", name: "Agriculture (DAE)" },
  { id: "t25", name: "Nursing & Midwifery" },
  { id: "t26", name: "Family Planning" },
  { id: "t27", name: "Post Office" },
  { id: "t28", name: "Social Services (DSS)" },
  { id: "t29", name: "Department of Immigration" },
  { id: "t30", name: "Election Commission (ECS)" },
  { id: "t31", name: "Bureau of Statistics (BBS)" },
  { id: "t32", name: "Youth Development (DYD)" },
  { id: "t33", name: "Drug Administration (DGDA)" },
  { id: "t34", name: "Health Directorate (DGHS)" },
  { id: "t35", name: "Sub-Registrar" },

  // --- Engineering & Utilities ---
  { id: "t36", name: "LGED" },
  { id: "t37", name: "Roads & Highways (RHD)" },
  { id: "t38", name: "Water Development Board (BWDB)" },
  { id: "t39", name: "Power Development Board (BPDB)" },
  { id: "t40", name: "Rural Electrification (BREB)" },
  { id: "t41", name: "DESCO / DPDC / PGCB" },
  { id: "t42", name: "WASA" },
  { id: "t43", name: "Petrobangla & Gas Fields" },
  { id: "t44", name: "Titas Gas (TGTDCL)" },

  // --- Others & Autonomous ---
  { id: "t45", name: "Biman Bangladesh Airlines" },
  { id: "t46", name: "Civil Aviation (CAAB)" },
  { id: "t47", name: "Port Authority (CPA/MPA)" },
  { id: "t48", name: "Private Commercial Banks" },
  { id: "t49", name: "Islami Bank" },
  { id: "t50", name: "NGO (BRAC/ASA/Grameen)" },
];

export default function CategoriesPage() {
  // --- STATES ---
  const [examTypes, setExamTypes] = useState(EXAM_TYPES_LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals & Forms State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isTypeManagerOpen, setIsTypeManagerOpen] = useState(false);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    type: "",
    status: "Active",
  });

  // --- API HOOKS ---
  const {
    data: fetchedData,
    isLoading,
    isError,
  } = useData<any>(
    ["categories", currentPage, searchQuery, selectedTypeFilter],
    `/api/question-bank/categories?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&type=${selectedTypeFilter}`
  );

  const categories = fetchedData?.data?.categories || [];
  const totalPages = fetchedData?.data?.totalPages || 1;
  const totalRecords = fetchedData?.data?.total || 0;

  const createMutation = usePost("/api/question-bank/categories", {
    invalidateKeys: ["categories"],
    onSuccess: () => {
      toast.success("Category created successfully!");
      setIsCategoryModalOpen(false);
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useUpdate("/api/question-bank/categories", {
    invalidateKeys: ["categories"],
    onSuccess: () => {
      toast.success("Category updated successfully!");
      if (isCategoryModalOpen) setIsCategoryModalOpen(false);
      setEditingId(null);
      resetForm();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useDelete("/api/question-bank/categories", {
    invalidateKeys: ["categories"],
    onSuccess: () => {
      toast.success("Category deleted successfully!");
      setIsDeleteModalOpen(false); // Close delete modal on success
      setDeleteId(null);
    },
    onError: (err) => toast.error(err.message),
  });

  // --- HANDLERS ---
  const resetForm = () => {
    setCategoryForm({ name: "", type: "", status: "Active" });
    setEditingId(null);
  };

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    updateMutation.mutate({ id, data: { status: newStatus } });
  };

  const openCreateModal = () => {
    resetForm();
    setIsCategoryModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingId(category._id);
    setCategoryForm({
      name: category.name,
      type: category.type,
      status: category.status,
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name || !categoryForm.type) {
      toast.warning("Name and Type are required!");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: categoryForm });
    } else {
      createMutation.mutate(categoryForm);
    }
  };

  // 1. Open Delete Modal (Instead of window.confirm)
  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // 2. Confirm Delete Action
  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleFilterType = (val: string) => {
    setSelectedTypeFilter(val);
    setCurrentPage(1);
  };

  const handleAddType = () => {
    if (!newTypeName.trim()) return;
    setExamTypes([...examTypes, { id: `t${Date.now()}`, name: newTypeName }]);
    setNewTypeName("");
    toast.success("Exam Type Added Locally");
  };

  const handleDeleteType = (id: string) => {
    setExamTypes(examTypes.filter((t) => t.id !== id));
  };

  // Stats
  const totalQuestions = categories.reduce(
    (acc: number, curr: any) => acc + (curr.totalQuestions || 0),
    0
  );
  const activeCount = categories.filter(
    (c: any) => c.status === "Active"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Question Bank Categories
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage exam categories and types dynamically.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsTypeManagerOpen(true)}
          >
            <Settings2 size={16} /> Manage Types
          </Button>
          <Button onClick={openCreateModal} className="gap-2">
            <Plus size={16} /> Add Category
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <CategoryStats
        totalRecords={totalRecords}
        totalQuestions={totalQuestions}
        activeCount={activeCount}
        totalTypes={examTypes.length}
        isLoading={isLoading}
      />

      {/* Filters */}
      <CategoryFilters
        searchQuery={searchQuery}
        setSearchQuery={handleSearch}
        selectedType={selectedTypeFilter}
        setSelectedType={handleFilterType}
        examTypes={examTypes}
      />

      {/* Data Table */}
      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isUpdating={updateMutation.isPending}
        onStatusToggle={handleStatusToggle}
        onEdit={openEditModal}
        onDelete={handleDeleteClick} // Pass the new handler
      />

      {/* Pagination */}
      <CategoryPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
      />

      {/* Create/Edit Modal */}
      <CategoryFormModal
        isOpen={isCategoryModalOpen}
        onClose={setIsCategoryModalOpen}
        isEditing={!!editingId}
        formData={categoryForm}
        setFormData={setCategoryForm}
        onSubmit={handleSaveCategory}
        isSaving={createMutation.isPending || updateMutation.isPending}
        examTypes={examTypes}
      />

      {/* Exam Type Modal */}
      <ExamTypeModal
        isOpen={isTypeManagerOpen}
        onClose={setIsTypeManagerOpen}
        examTypes={examTypes}
        newTypeName={newTypeName}
        setNewTypeName={setNewTypeName}
        onAdd={handleAddType}
        onDelete={handleDeleteType}
      />

      {/* Delete Confirmation Modal (Added Here) */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

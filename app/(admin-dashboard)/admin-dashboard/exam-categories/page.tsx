"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { usePost } from "@/app/hooks/usePost";
import { useUpdate } from "@/app/hooks/useUpdate";
import { useDelete } from "@/app/hooks/useDelete";

import { CategoryHeader } from "./_components/category-header";
import { CategoryGeneralInfo } from "./_components/category-general-info";
import { CategoryIconSelector } from "./_components/category-icon-selector";
import { CategorySettings } from "./_components/category-settings";
import { CategoryTable } from "./_components/category-table";

interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  priority: number;
  isActive: boolean;
  color: string;
  icon: string;
}

interface CategoryPayload {
  name: string;
  slug?: string;
  description: string;
  priority: number;
  isActive: boolean;
  color: string;
  icon: string;
}

const INVALIDATE_KEYS = ["exam-categories"];

export default function CreateCategory() {
  // --- States ---
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIconName, setSelectedIconName] = useState("GraduationCap");
  const [searchQuery, setSearchQuery] = useState("");
  const [tableSearch, setTableSearch] = useState("");

  // --- API Helpers ---
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setName("");
    setSlug("");
    setDescription("");
    setPriority(0);
    setIsActive(true);
    setSelectedColor("blue");
    setSelectedIconName("GraduationCap");
  };

  const onSuccess = (message: string) => {
    toast.success("Success", { description: message });
    resetForm();
  };

  const onError = (error: Error) => {
    toast.error("Error", {
      description: error.message || "Something went wrong",
    });
  };

  // --- Mutations ---
  const createMutation = usePost("/api/exam-categories", {
    onSuccess: () => onSuccess("Category created successfully"),
    onError,
    invalidateKeys: INVALIDATE_KEYS,
  });

  const updateMutation = useUpdate("/api/exam-categories", {
    onSuccess: () => onSuccess("Category updated successfully"),
    onError,
    invalidateKeys: INVALIDATE_KEYS,
  });

  const deleteMutation = useDelete("/api/exam-categories", {
    onSuccess: () => {
      toast.success("Deleted", {
        description: "Category deleted successfully",
      });
      setDeleteId(null);
    },
    onError,
    invalidateKeys: INVALIDATE_KEYS,
  });

  // --- Query ---
  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ["exam-categories"],
    queryFn: async () => {
      const res = await fetch("/api/exam-categories");
      const json = await res.json();
      return json.data as Category[];
    },
  });

  // --- Handlers ---
  const handleSave = () => {
    if (!name.trim()) {
      return toast.error("Validation Error", {
        description: "Name is required",
      });
    }

    const payload: CategoryPayload = {
      name,
      slug: slug || undefined,
      description,
      priority: Number(priority),
      isActive,
      color: selectedColor,
      icon: selectedIconName,
    };

    if (isEditing && editId) {
      updateMutation.mutate({ id: editId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setEditId(category._id);
    setName(category.name);
    setSlug(category.slug || "");
    setDescription(category.description || "");
    setPriority(category.priority);
    setIsActive(category.isActive);
    setSelectedColor(category.color);
    setSelectedIconName(category.icon);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen space-y-8 p-4 font-sans md:p-8">
      <CategoryHeader
        isEditing={isEditing}
        isProcessing={createMutation.isPending || updateMutation.isPending}
        onReset={resetForm}
        onSave={handleSave}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CategoryGeneralInfo
            name={name}
            slug={slug}
            description={description}
            setName={setName}
            setSlug={setSlug}
            setDescription={setDescription}
          />
          <CategoryIconSelector
            selectedIconName={selectedIconName}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedIconName={setSelectedIconName}
          />
        </div>
        <CategorySettings
          priority={priority}
          isActive={isActive}
          selectedColor={selectedColor}
          setPriority={setPriority}
          setIsActive={setIsActive}
          setSelectedColor={setSelectedColor}
        />
      </div>

      <CategoryTable
        categories={categoriesData}
        isLoading={isLoading}
        search={tableSearch}
        setSearch={setTableSearch}
        onEdit={handleEdit}
        onDelete={setDeleteId}
        onToggleStatus={(id, status) =>
          updateMutation.mutate({ id, data: { isActive: !status } })
        }
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              className="bg-destructive text-white hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

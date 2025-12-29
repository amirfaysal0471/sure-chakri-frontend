"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Hooks
import { useData } from "@/app/hooks/use-data";
import { usePost } from "@/app/hooks/usePost";
import { useDelete } from "@/app/hooks/useDelete";

// Components
import { PricingCard } from "./_components/pricing-card";
import { CreatePricingModal } from "./_components/create-pricing-modal";
import { EditPricingModal } from "./_components/edit-pricing-modal";
import { DeleteAlertDialog } from "./_components/delete-alert-dialog";
import { PricingPlan } from "./_components/types";

export default function PricingDashboard() {
  const queryClient = useQueryClient();

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [previewCycle, setPreviewCycle] = useState<"Monthly" | "Yearly">(
    "Monthly"
  );

  // --- 1. Fetch Data ---
  const { data: responseData, isLoading } = useData<any>(
    ["pricing-plans"],
    "/api/pricing"
  );

  const [plans, setPlans] = useState<PricingPlan[]>([]);

  useEffect(() => {
    if (responseData?.data) {
      setPlans(responseData.data);
    }
  }, [responseData]);

  // --- 2. Other Mutations ---
  const createDuplicateMutation = usePost("/api/pricing", {
    onSuccess: () => {
      toast.success("Plan duplicated successfully");
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
    },
    onError: (err) => toast.error("Failed to duplicate: " + err.message),
  });

  const deleteMutation = useDelete("/api/pricing", {
    onSuccess: () => {
      toast.success("Plan deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
      setIsDeleteOpen(false);
      setDeleteId(null);
    },
    onError: (err) => toast.error("Failed to delete: " + err.message),
  });

  // --- Handlers ---
  const handleReorderSave = async (newPlans: PricingPlan[]) => {
    const orderedIds = newPlans.map((p) => p._id || p.id);
    try {
      await fetch("/api/pricing", {
        method: "PUT",
        body: JSON.stringify({ action: "reorder", orderedIds }),
      });
      toast.success("Order updated");
    } catch (error) {
      toast.error("Failed to save order");
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newPlans = [...plans];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newPlans.length) {
      [newPlans[index], newPlans[targetIndex]] = [
        newPlans[targetIndex],
        newPlans[index],
      ];
      setPlans(newPlans);
      handleReorderSave(newPlans);
    }
  };

  const handleDuplicate = (plan: PricingPlan) => {
    const { _id, id, ...rest } = plan as any;
    createDuplicateMutation.mutate({
      ...rest,
      title: `${plan.title} (Copy)`,
      isActive: false,
    });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) deleteMutation.mutate(deleteId);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] w-full flex flex-col items-center justify-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm">
          Loading pricing plans...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Pricing Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage subscription tiers via API.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setPreviewCycle("Monthly")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                previewCycle === "Monthly"
                  ? "bg-white shadow text-black"
                  : "text-muted-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setPreviewCycle("Yearly")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                previewCycle === "Yearly"
                  ? "bg-white shadow text-black"
                  : "text-muted-foreground"
              )}
            >
              Yearly
            </button>
          </div>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <Plus size={18} /> Create Plan
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <PricingCard
            key={plan._id || plan.id || index}
            plan={plan}
            index={index}
            totalItems={plans.length}
            previewCycle={previewCycle}
            onMove={handleMove}
            onEdit={(planToEdit) => setEditingPlan(planToEdit)}
            onDelete={() => handleDeleteClick(plan._id || plan.id!)}
            onDuplicate={handleDuplicate}
          />
        ))}
      </div>

      {/* --- Modals --- */}

      {/* 1. Create Modal */}
      <CreatePricingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      {/* 2. Edit Modal */}
      {editingPlan && (
        <EditPricingModal
          isOpen={!!editingPlan}
          onClose={() => setEditingPlan(null)}
          plan={editingPlan}
        />
      )}

      {/* 3. Delete Alert */}
      <DeleteAlertDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}

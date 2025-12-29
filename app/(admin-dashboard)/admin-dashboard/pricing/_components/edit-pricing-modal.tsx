"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { PricingPlan } from "./types";
import { PricingForm } from "./pricing-form";
import { useUpdate } from "@/app/hooks/useUpdate";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
}

export function EditPricingModal({ isOpen, onClose, plan }: EditModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PricingPlan>(plan);

  // Sync state when modal opens with new plan data
  useEffect(() => {
    if (plan) {
      setFormData(plan);
    }
  }, [plan, isOpen]);

  const updateMutation = useUpdate("/api/pricing", {
    onSuccess: () => {
      toast.success("Plan updated successfully");
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
      onClose();
    },
    onError: (err) => toast.error("Failed to update plan: " + err.message),
  });

  const handleSubmit = () => {
    const id = formData._id || formData.id;
    if (!id) return toast.error("Error: Plan ID is missing");

    // 🔥 FIX: Validation Check (Title, Price & System ID must exist)
    if (!formData.title || formData.price === undefined || !formData.planId) {
      return toast.warning(
        "Please fill required fields (Title, Price, System ID)"
      );
    }

    updateMutation.mutate({ id, data: formData });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-blue-100 text-blue-600">
              <Pencil size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">Edit Plan</DialogTitle>
              <DialogDescription>
                Modify details for {plan.title}.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <PricingForm formData={formData} setFormData={setFormData} />

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
            {updateMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

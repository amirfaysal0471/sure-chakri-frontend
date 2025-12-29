"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { PricingPlan } from "./types";
import { PricingForm } from "./pricing-form";
import { usePost } from "@/app/hooks/usePost";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_DATA: PricingPlan = {
  title: "",
  // 🔥 Default Value for new plans
  planId: "free",
  description: "",
  price: 0,
  currency: "৳",
  billingCycle: "Monthly",
  isPopular: false,
  isActive: true,
  features: [],
  buttonText: "Subscribe",
  buttonLink: "#",
  colorTheme: "blue",
  discountPercent: 0,
  yearlyPrice: 0,
};

export function CreatePricingModal({ isOpen, onClose }: CreateModalProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PricingPlan>(INITIAL_DATA);

  const createMutation = usePost("/api/pricing", {
    onSuccess: () => {
      toast.success("Plan created successfully");
      queryClient.invalidateQueries({ queryKey: ["pricing-plans"] });
      setFormData(INITIAL_DATA); // Reset form
      onClose();
    },
    onError: (err) => toast.error("Failed to create plan: " + err.message),
  });

  const handleSubmit = () => {
    if (!formData.title || !formData.price || !formData.planId) {
      return toast.warning("Please fill required fields (*)");
    }
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl h-[85vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-md bg-primary/10 text-primary">
              <Plus size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                Create New Plan
              </DialogTitle>
              <DialogDescription>
                Define a new pricing tier for your customers.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <PricingForm formData={formData} setFormData={setFormData} />

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={createMutation.isPending}>
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Create Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

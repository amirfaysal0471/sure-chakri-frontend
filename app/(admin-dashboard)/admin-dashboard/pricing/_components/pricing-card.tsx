"use client";

import {
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
  MoveUp,
  MoveDown,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { PricingPlan, COLOR_THEMES } from "./types";

interface PricingCardProps {
  plan: PricingPlan;
  index: number;
  totalItems: number;
  previewCycle: "Monthly" | "Yearly";
  onMove: (index: number, direction: "up" | "down") => void;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (id: string) => void;
  onDuplicate: (plan: PricingPlan) => void;
}

export function PricingCard({
  plan,
  index,
  totalItems,
  previewCycle,
  onMove,
  onEdit,
  onDelete,
  onDuplicate,
}: PricingCardProps) {
  const theme =
    COLOR_THEMES.find((c) => c.value === plan.colorTheme) || COLOR_THEMES[0];

  const showPrice =
    previewCycle === "Monthly"
      ? plan.price
      : plan.yearlyPrice
      ? plan.yearlyPrice
      : Number(plan.price) * 12;

  return (
    <Card
      className={cn(
        "relative group transition-all duration-300 flex flex-col h-full",
        plan.isPopular
          ? `border-2 ${theme.border} shadow-xl scale-[1.02] z-10`
          : "border border-gray-200 shadow-sm hover:shadow-md"
      )}
    >
      {(plan.isPopular || plan.customBadge) && (
        <div
          className={cn(
            "absolute -top-3 left-1/2 -translate-x-1/2 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm",
            theme.bg
          )}
        >
          {plan.customBadge || "Most Popular"}
        </div>
      )}

      {/* Sort Buttons */}
      <div className="absolute top-4 left-4 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow"
          disabled={index === 0}
          onClick={() => onMove(index, "up")}
        >
          <MoveUp size={12} />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-6 w-6 rounded-full shadow"
          disabled={index === totalItems - 1}
          onClick={() => onMove(index, "down")}
        >
          <MoveDown size={12} />
        </Button>
      </div>

      {/* Action Menu */}
      <div className="absolute top-3 right-3 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100"
            >
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(plan)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(plan)}>
              <Copy className="mr-2 h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={() => onDelete(plan._id!)}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardHeader className="pt-10 pb-4">
        <div className="flex justify-center mb-4">
          <Badge
            variant={plan.isActive ? "secondary" : "destructive"}
            className="px-2 py-0.5 text-[10px]"
          >
            {plan.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <CardTitle className={cn("text-2xl font-bold text-center", theme.text)}>
          {plan.title}
        </CardTitle>
        <CardDescription className="text-center min-h-[40px] mt-2 text-sm px-4">
          {plan.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 flex-1">
        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold text-gray-900">
              {plan.currency}
              {showPrice}
            </span>
            <span className="text-muted-foreground font-medium">
              /{previewCycle === "Monthly" ? "mo" : "yr"}
            </span>
          </div>
          {previewCycle === "Yearly" && (plan.discountPercent || 0) > 0 && (
            <Badge
              variant="outline"
              className="mt-2 bg-green-50 text-green-700 border-green-200"
            >
              Save {plan.discountPercent}%
            </Badge>
          )}
        </div>

        <div className="space-y-3 px-2">
          {plan.features?.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3 text-sm">
              <CheckCircle2
                size={18}
                className={cn(
                  "shrink-0 mt-0.5",
                  feature.included ? theme.text : "text-gray-300"
                )}
              />
              <span
                className={cn(
                  feature.included
                    ? "text-gray-700 font-medium"
                    : "text-gray-400 line-through decoration-gray-400"
                )}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 pb-8">
        <Button
          className={cn(
            "w-full h-11 text-md font-semibold shadow-md transition-transform active:scale-95",
            theme.bg,
            "hover:opacity-90"
          )}
        >
          {plan.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

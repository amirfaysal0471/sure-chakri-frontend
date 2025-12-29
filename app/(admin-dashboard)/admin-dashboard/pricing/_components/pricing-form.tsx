"use client";

import {
  Plus,
  GripVertical,
  X,
  Palette,
  Link as LinkIcon,
  Tag,
  Percent,
  LayoutDashboard,
  ListChecks,
  Type,
  DollarSign,
  Settings2,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { PricingPlan, COLOR_THEMES } from "./types";

interface PricingFormProps {
  formData: PricingPlan;
  setFormData: (data: PricingPlan) => void;
}

export function PricingForm({ formData, setFormData }: PricingFormProps) {
  const addFeature = () =>
    setFormData({
      ...formData,
      features: [...formData.features, { text: "", included: true }],
    });

  const removeFeature = (idx: number) =>
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== idx),
    });

  const updateFeature = (idx: number, key: string, value: any) => {
    const newFeatures = [...formData.features];
    newFeatures[idx] = { ...newFeatures[idx], [key]: value };
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <Tabs
      defaultValue="general"
      className="flex-1 flex flex-col overflow-hidden"
    >
      {/* Tabs Navigation */}
      <div className="px-6 border-b shrink-0 bg-white">
        <TabsList className="h-12 w-full justify-start gap-6 bg-transparent p-0">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-full px-1 font-semibold text-muted-foreground gap-2"
          >
            <LayoutDashboard size={16} /> General & Pricing
          </TabsTrigger>
          <TabsTrigger
            value="features"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-full px-1 font-semibold text-muted-foreground gap-2"
          >
            <ListChecks size={16} /> Features
          </TabsTrigger>
          <TabsTrigger
            value="styling"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none h-full px-1 font-semibold text-muted-foreground gap-2"
          >
            <Settings2 size={16} /> Appearance
          </TabsTrigger>
        </TabsList>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
        {/* === Tab: General === */}
        <TabsContent value="general" className="mt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Left: Details */}
            <div className="md:col-span-8 space-y-6">
              <Card className="shadow-none border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Type size={16} /> Plan Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Plan Title <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="e.g. Pro Learner"
                      />
                    </div>
                    {/* 🔥 System ID Selector added here */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        System ID <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.planId}
                        onValueChange={(val: any) =>
                          setFormData({ ...formData, planId: val })
                        }
                      >
                        <SelectTrigger className="bg-blue-50/50 border-blue-200">
                          <SelectValue placeholder="Select ID" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free (Default)</SelectItem>
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-[10px] text-muted-foreground">
                        Must match User Model logic.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      className="min-h-[100px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description..."
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-none border">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign size={16} /> Pricing Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Billing Cycle</Label>
                      <Select
                        value={formData.billingCycle}
                        onValueChange={(val: any) =>
                          setFormData({ ...formData, billingCycle: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Monthly">Monthly</SelectItem>
                          <SelectItem value="Yearly">Yearly</SelectItem>
                          <SelectItem value="One-time">One-time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Base Price</Label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(val) =>
                          setFormData({ ...formData, currency: val })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="৳">BDT (৳)</SelectItem>
                          <SelectItem value="$">USD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {formData.billingCycle === "Monthly" && (
                    <div className="pt-4 border-t grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                          Yearly Discount %
                        </Label>
                        <div className="relative">
                          <Input
                            className="pr-8"
                            type="number"
                            value={formData.discountPercent || 0}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                discountPercent: Number(e.target.value),
                              })
                            }
                          />
                          <Percent className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-xs uppercase text-muted-foreground">
                          Custom Yearly Price
                        </Label>
                        <Input
                          type="number"
                          value={formData.yearlyPrice || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yearlyPrice: Number(e.target.value),
                            })
                          }
                          placeholder="Auto"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right: Visibility */}
            <div className="md:col-span-4 space-y-6">
              <Card className="shadow-none border h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Visibility</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label>Active Status</Label>
                      <p className="text-xs text-muted-foreground">
                        Visible to users
                      </p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(c) =>
                        setFormData({ ...formData, isActive: c })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50/50 border-blue-100">
                    <div className="space-y-0.5">
                      <Label className="text-blue-700">Popular Choice</Label>
                      <p className="text-xs text-blue-600/70">
                        Add highlighted badge
                      </p>
                    </div>
                    <Switch
                      checked={formData.isPopular}
                      onCheckedChange={(c) =>
                        setFormData({ ...formData, isPopular: c })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* === Tab: Features === */}
        <TabsContent value="features" className="mt-0 space-y-6">
          <Card className="shadow-none border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-base">Features Checklist</CardTitle>
                <CardDescription>
                  What is included in this plan?
                </CardDescription>
              </div>
              <Button size="sm" onClick={addFeature} className="gap-2">
                <Plus size={16} /> Add Feature
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {formData.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 hover:bg-muted/50 group"
                  >
                    <GripVertical className="text-gray-300 cursor-move h-4 w-4" />
                    <Switch
                      checked={feature.included}
                      onCheckedChange={(c) => updateFeature(idx, "included", c)}
                      className="scale-75"
                    />
                    <Input
                      value={feature.text}
                      onChange={(e) =>
                        updateFeature(idx, "text", e.target.value)
                      }
                      placeholder="Feature description..."
                      className="h-9 border-0 bg-transparent focus-visible:ring-0 px-0 shadow-none font-medium"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFeature(idx)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
                {formData.features.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No features added. Click "Add Feature" to start.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* === Tab: Styling === */}
        <TabsContent value="styling" className="mt-0 space-y-6">
          <Card className="shadow-none border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Palette size={16} /> Visual Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Color Theme</Label>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  {COLOR_THEMES.map((c) => (
                    <div
                      key={c.value}
                      onClick={() =>
                        setFormData({ ...formData, colorTheme: c.value })
                      }
                      className={cn(
                        "cursor-pointer flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all",
                        formData.colorTheme === c.value
                          ? `border-${c.value}-600 bg-${c.value}-50`
                          : "border-transparent bg-muted/30 hover:bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full border-2 border-white shadow-sm",
                          c.bg
                        )}
                      ></div>
                      <span className="text-xs font-medium">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Tag size={14} /> Custom Badge Text
                  </Label>
                  <Input
                    value={formData.customBadge || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, customBadge: e.target.value })
                    }
                    placeholder="e.g. Best Value"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <LinkIcon size={14} /> Button Text
                  </Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </Tabs>
  );
}

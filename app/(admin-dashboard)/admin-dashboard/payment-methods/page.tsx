"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image"; // 🔥 Image কম্পোনেন্ট ইম্পোর্ট
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Power,
  Loader2,
  CreditCard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

// --- Types ---
interface PaymentMethod {
  _id: string;
  name: string;
  logo: string; // 🔥 লোগো ফিল্ড
  accountType: "Personal" | "Agent" | "Merchant";
  accountNumber: string;
  charge: number;
  instruction: string;
  isActive: boolean;
}

// 🔥 Predefined Providers Data
const PROVIDERS = [
  { name: "Bkash", logo: "/bkash.png", color: "bg-pink-600" },
  { name: "Nagad", logo: "/nagad.png", color: "bg-orange-600" },
  { name: "Rocket", logo: "/rocket.png", color: "bg-purple-600" },
];

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    logo: "", // Logo state added
    accountType: "Personal",
    accountNumber: "",
    charge: 0,
    instruction: "",
    isActive: true,
  });

  // --- Helper: Handle Provider Selection ---
  const handleProviderSelect = (providerName: string) => {
    const provider = PROVIDERS.find((p) => p.name === providerName);
    if (provider) {
      setFormData((prev) => ({
        ...prev,
        name: provider.name,
        logo: provider.logo, // অটো লোগো সেট হবে
      }));
    }
  };

  // --- 1. Fetch Data ---
  const fetchMethods = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payment-methods");
      const data = await res.json();
      if (data.success) {
        setMethods(data.data);
      }
    } catch (error) {
      toast.error("Failed to load methods");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // --- 2. Filter Logic ---
  const filteredMethods = methods.filter((method) => {
    const matchesSearch = method.name
      .toLowerCase()
      .includes(search.toLowerCase());

    let matchesFilter = true;
    if (filter === "active") matchesFilter = method.isActive;
    if (filter === "inactive") matchesFilter = !method.isActive;

    return matchesSearch && matchesFilter;
  });

  // --- 3. Form Handling ---
  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      logo: "",
      accountType: "Personal",
      accountNumber: "",
      charge: 0,
      instruction: "",
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (method: PaymentMethod) => {
    setIsEditing(true);
    setCurrentId(method._id);
    setFormData({
      name: method.name,
      logo: method.logo,
      accountType: method.accountType,
      accountNumber: method.accountNumber,
      charge: method.charge,
      instruction: method.instruction,
      isActive: method.isActive,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.accountNumber) {
      toast.error("Please select a provider and enter number");
      return;
    }

    try {
      const baseUrl = "/api/payment-methods";

      const url = isEditing && currentId ? `${baseUrl}/${currentId}` : baseUrl;

      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          isEditing
            ? "Method updated successfully"
            : "Method added successfully"
        );
        fetchMethods();
        setIsDialogOpen(false);
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to submit");
    }
  };

  // --- 4. Actions (Delete & Toggle) ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this method?")) return;
    try {
      const res = await fetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Deleted successfully");
        fetchMethods();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const handleToggleStatus = async (method: PaymentMethod) => {
    try {
      const updatedStatus = !method.isActive;

      const res = await fetch(`/api/payment-methods/${method._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: updatedStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.info(
          `Status changed to ${updatedStatus ? "Active" : "Inactive"}`
        );
        fetchMethods();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
          <p className="text-muted-foreground">
            Manage gateways (Bkash, Nagad) and instructions.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Method
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search methods..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Methods List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMethods.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No payment methods found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Account Info</TableHead>
                  <TableHead>Charge</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMethods.map((method) => (
                  <TableRow key={method._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        {/* 🔥 Logo Display */}
                        <div className="h-10 w-10 relative rounded-md overflow-hidden bg-muted border border-border/50">
                          {method.logo ? (
                            <Image
                              src={method.logo}
                              alt={method.name}
                              fill
                              className="object-cover p-1"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full">
                              <CreditCard className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{method.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                            {method.instruction}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {method.accountNumber}
                        </span>
                        <Badge
                          variant="outline"
                          className="w-fit mt-1 text-[10px]"
                        >
                          {method.accountType}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{method.charge}%</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          method.isActive
                            ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200"
                        }
                      >
                        {method.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleOpenEdit(method)}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(method)}
                          >
                            <Power className="w-4 h-4 mr-2" />
                            {method.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(method._id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Method" : "Add Payment Method"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              {/* 🔥 Provider Selection */}
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Select Provider</Label>
                <Select
                  value={formData.name}
                  onValueChange={handleProviderSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVIDERS.map((provider) => (
                      <SelectItem key={provider.name} value={provider.name}>
                        <div className="flex items-center gap-2">
                          {/* Optional: Show small icon in dropdown */}
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Account Type</Label>
                <Select
                  value={formData.accountType}
                  onValueChange={(val: any) =>
                    setFormData({ ...formData, accountType: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Personal">Personal</SelectItem>
                    <SelectItem value="Merchant">Merchant</SelectItem>
                    <SelectItem value="Agent">Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Display Selected Logo Preview */}
            {formData.logo && (
              <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-lg border border-dashed">
                <div className="relative h-10 w-10">
                  <Image
                    src={formData.logo}
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  Selected: {formData.name}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Label>Wallet Number</Label>
              <Input
                placeholder="01xxxxxxxxx"
                value={formData.accountNumber}
                onChange={(e) =>
                  setFormData({ ...formData, accountNumber: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label>Charge (%)</Label>
                <Input
                  type="number"
                  placeholder="1.85"
                  value={formData.charge}
                  onChange={(e) =>
                    setFormData({ ...formData, charge: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex flex-col space-y-3 pt-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active-mode"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                  <Label htmlFor="active-mode">Active for Users</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Instruction for User</Label>
              <Textarea
                placeholder="Go to Send Money option..."
                value={formData.instruction}
                onChange={(e) =>
                  setFormData({ ...formData, instruction: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {isEditing ? "Update Method" : "Save Method"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Loader2,
  User,
  AlertTriangle,
  Banknote,
  Users,
  ArrowRight,
  ArrowLeft,
  Copy,
  CreditCard,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";

// Hooks
import { useData } from "@/app/hooks/use-data";

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useUpdate } from "@/app/hooks/useUpdate";

// --- Types ---
interface Transaction {
  _id: string;
  user: {
    name: string;
    email: string;
    planExpiresAt?: string; // 🔥 নতুন ফিল্ড: Expire Date দেখানোর জন্য
  };
  paymentMethod: string;
  senderNumber: string;
  trxId: string;
  amount: number;
  planName?: string;
  plan?: {
    title: string;
  };
  billingCycle: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  adminNote?: string;
}

export default function TransactionsPage() {
  // 1. Fetch Data
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useData<any>(["transactions"], "/api/transactions");

  const transactions: Transaction[] = apiResponse?.data || [];

  // 2. Update Hook
  const updateTransaction = useUpdate("/api/transactions", {
    invalidateKeys: ["transactions"],
    onSuccess: () => {
      toast.success("Transaction updated successfully");
      closeAllModals();
    },
    onError: (error: any) => {
      toast.error(error.message || "Update failed");
    },
  });

  // State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Actions State
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const closeAllModals = () => {
    setIsDetailsOpen(false);
    setIsApproveOpen(false);
    setIsRejectOpen(false);
    setSelectedTx(null);
    setAdminNote("");
  };

  // Filter Logic
  const filteredData = transactions.filter((tx) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      tx.trxId.toLowerCase().includes(searchLower) ||
      tx.senderNumber.includes(searchLower) ||
      tx.user?.name?.toLowerCase().includes(searchLower) ||
      tx.user?.email?.toLowerCase().includes(searchLower);

    const matchesStatus =
      statusFilter === "all" ? true : tx.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // KPI Stats
  const totalRevenue = transactions
    .filter((t) => t.status === "approved")
    .reduce((sum, t) => sum + t.amount, 0);
  const pendingCount = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const approvedCount = transactions.filter(
    (t) => t.status === "approved"
  ).length;

  // Action Handler
  const handleUpdateStatus = (
    id: string,
    status: "approved" | "rejected",
    note?: string
  ) => {
    updateTransaction.mutate({
      id,
      data: { status, adminNote: note },
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const isUpdating = updateTransaction.isPending;

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Transactions
          </h1>
          <p className="text-slate-500">
            Manage user payments and plan activations.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => refetch()}
          disabled={isLoading}
          className="shadow-sm"
        >
          <Loader2
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />{" "}
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Revenue
            </CardTitle>
            <Banknote className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">
                ৳ {totalRevenue.toLocaleString()}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-orange-600">
                {pendingCount}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Approved
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <div className="text-2xl font-bold text-green-600">
                {approvedCount}
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Total Transactions
            </CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <div className="text-2xl font-bold text-slate-900">
                {transactions.length}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by TrxID, Phone or Email..."
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-600 hidden md:inline">
              Status:
            </span>
          </div>
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-slate-50 border-slate-200">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50 border-b border-slate-200">
              <TableRow>
                <TableHead className="w-[60px] font-semibold text-slate-600">
                  #
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  User Info
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Plan Details
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Payment Info
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Date & Time
                </TableHead>
                {/* 🔥 NEW COLUMN HEADER */}
                <TableHead className="font-semibold text-slate-600">
                  Expires On
                </TableHead>
                <TableHead className="font-semibold text-slate-600">
                  Status
                </TableHead>
                <TableHead className="text-right font-semibold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-10 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8} // Colspan increased
                    className="h-40 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="bg-slate-100 p-3 rounded-full">
                        <Search className="h-6 w-6 text-slate-400" />
                      </div>
                      <p>No transactions found matching your criteria.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((tx, index) => (
                  <TableRow
                    key={tx._id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-none"
                  >
                    <TableCell className="font-mono text-xs text-slate-500">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </TableCell>

                    {/* User Info */}
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-slate-900">
                          {tx.user?.name || "Unknown User"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {tx.user?.email}
                        </span>
                      </div>
                    </TableCell>

                    {/* Plan Details */}
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-800">
                          {tx.planName || tx.plan?.title || (
                            <span className="text-slate-400 italic">
                              Unknown Plan
                            </span>
                          )}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5 capitalize bg-slate-100 text-slate-600 border-slate-200"
                          >
                            {tx.billingCycle}
                          </Badge>
                          <span className="text-sm font-bold text-primary">
                            ৳ {tx.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Payment Info */}
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold uppercase bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                            {tx.paymentMethod}
                          </span>
                          <span className="text-slate-600 font-mono tracking-wide">
                            {tx.senderNumber}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-1 group cursor-pointer"
                          onClick={() => copyToClipboard(tx.trxId)}
                        >
                          <span className="font-mono text-[11px] bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200 font-medium group-hover:bg-yellow-100 transition-colors">
                            {tx.trxId}
                          </span>
                          <Copy className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </TableCell>

                    {/* Date */}
                    <TableCell>
                      <div className="text-xs text-slate-500">
                        <p className="font-medium text-slate-700">
                          {format(new Date(tx.createdAt), "dd MMM, yyyy")}
                        </p>
                        <p>{format(new Date(tx.createdAt), "hh:mm a")}</p>
                      </div>
                    </TableCell>

                    {/* 🔥 NEW CELL: Expire Date */}
                    <TableCell>
                      {tx.user?.planExpiresAt ? (
                        <div className="flex items-center gap-1.5 text-xs font-medium text-orange-700 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-100">
                          <CalendarDays className="w-3 h-3" />
                          {format(
                            new Date(tx.user.planExpiresAt),
                            "dd MMM, yyyy"
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          No Active Plan
                        </span>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge
                        className={`capitalize shadow-none border ${
                          tx.status === "approved"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : tx.status === "rejected"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-orange-50 text-orange-700 border-orange-200"
                        }`}
                      >
                        {tx.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1.5" />
                        )}
                        {tx.status === "approved" && (
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                        )}
                        {tx.status === "rejected" && (
                          <XCircle className="w-3 h-3 mr-1.5" />
                        )}
                        {tx.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <MoreVertical className="w-4 h-4 text-slate-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          {tx.status === "pending" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-green-600 focus:text-green-700 focus:bg-green-50 cursor-pointer"
                                onClick={() => {
                                  setSelectedTx(tx);
                                  setIsApproveOpen(true);
                                }}
                              >
                                <CheckCircle className="w-4 h-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                                onClick={() => {
                                  setSelectedTx(tx);
                                  setIsRejectOpen(true);
                                }}
                              >
                                <XCircle className="w-4 h-4 mr-2" /> Reject
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>

        {/* Pagination */}
        {!isLoading && filteredData.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <strong>
                {startIndex + 1}-
                {Math.min(startIndex + itemsPerPage, filteredData.length)}
              </strong>{" "}
              of <strong>{filteredData.length}</strong>
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* --- 1. DETAILS MODAL --- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg p-0 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200">
            <DialogHeader>
              <DialogTitle className="text-xl">Transaction Details</DialogTitle>
              <DialogDescription>Full payment information.</DialogDescription>
            </DialogHeader>
          </div>
          {selectedTx && (
            <div className="p-6 space-y-6">
              <div className="bg-white border rounded-xl p-4 shadow-sm grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Status
                  </p>
                  <Badge
                    className={
                      selectedTx.status === "approved"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                    }
                  >
                    {selectedTx.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-xs font-bold text-slate-500 uppercase">
                    Amount
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    ৳ {selectedTx.amount}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      USER DETAILS
                    </p>
                    <p className="font-medium text-slate-900">
                      {selectedTx.user?.name}
                    </p>
                    <p className="text-slate-500">{selectedTx.user?.email}</p>
                    {/* 🔥 MODAL: Expire Date Show */}
                    {selectedTx.user?.planExpiresAt && (
                      <div className="mt-2 text-xs flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded w-fit border border-orange-100">
                        <CalendarDays className="w-3 h-3" />
                        Expires:{" "}
                        {format(
                          new Date(selectedTx.user.planExpiresAt),
                          "dd MMM, yyyy"
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      PLAN REQUESTED
                    </p>
                    <p className="font-medium text-slate-900">
                      {selectedTx.planName ||
                        selectedTx.plan?.title ||
                        "Unknown Plan"}
                    </p>
                    <p className="text-slate-500 capitalize">
                      {selectedTx.billingCycle} Cycle
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      PAYMENT METHOD
                    </p>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="uppercase font-medium">
                        {selectedTx.paymentMethod}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold mb-1">
                      TRANSACTION INFO
                    </p>
                    <div className="bg-slate-100 p-2 rounded text-xs font-mono text-slate-700 space-y-1">
                      <p>
                        Sender:{" "}
                        <span className="font-bold">
                          {selectedTx.senderNumber}
                        </span>
                      </p>
                      <p>
                        TrxID:{" "}
                        <span className="font-bold text-slate-900 bg-yellow-200 px-1 rounded">
                          {selectedTx.trxId}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {selectedTx.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsApproveOpen(true);
                    }}
                  >
                    Approve Request
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => {
                      setIsDetailsOpen(false);
                      setIsRejectOpen(true);
                    }}
                  >
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* --- 2. BEAUTIFUL APPROVE MODAL --- */}
      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="bg-green-50 p-6 flex flex-col items-center justify-center border-b border-green-100">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-green-800 text-xl">
              Approve Payment?
            </DialogTitle>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-center text-slate-600 text-sm">
              You are about to approve the payment for{" "}
              <strong>{selectedTx?.user?.name}</strong>.
            </p>

            {/* Summary Box */}
            <div className="bg-slate-50 border rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Plan:</span>
                <span className="font-semibold">
                  {selectedTx?.planName || selectedTx?.plan?.title || "Unknown"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount:</span>
                <span className="font-bold text-green-600">
                  ৳ {selectedTx?.amount}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">TrxID:</span>
                <span className="font-mono text-xs">{selectedTx?.trxId}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsApproveOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() =>
                  selectedTx && handleUpdateStatus(selectedTx._id, "approved")
                }
                disabled={isUpdating}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}
                Confirm
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- 3. REJECT MODAL --- */}
      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden">
          <div className="bg-red-50 p-6 flex flex-col items-center justify-center border-b border-red-100">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <DialogTitle className="text-red-800 text-xl">
              Reject Transaction
            </DialogTitle>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-center text-slate-600 text-sm">
              This action cannot be undone. Please provide a reason for the
              user.
            </p>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase">
                Reason for rejection
              </span>
              <Textarea
                placeholder="e.g. Invalid Transaction ID provided..."
                className="min-h-[100px] bg-slate-50 border-slate-200"
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsRejectOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() =>
                  selectedTx &&
                  handleUpdateStatus(selectedTx._id, "rejected", adminNote)
                }
                disabled={!adminNote || isUpdating}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}{" "}
                Reject Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

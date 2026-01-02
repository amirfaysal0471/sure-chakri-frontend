"use client";

import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  RefreshCcw,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  MessageSquare,
  Loader2,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"; // 🔥 Fixed: Label Import Added
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Hooks
import { useData } from "@/app/hooks/use-data";
import { useUpdate } from "@/app/hooks/useUpdate";
import { useDelete } from "@/app/hooks/useDelete";

// --- Types ---
interface Message {
  _id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  message: string;
  status: "new" | "read" | "replied" | "closed";
  adminNote?: string;
  createdAt: string;
}

export default function AdminMessagesPage() {
  // 🔥 1. Data Fetching with Hook
  const {
    data: apiResponse,
    isLoading,
    refetch,
  } = useData<any>(["messages"], "/api/contact/messages");

  const messages: Message[] = apiResponse?.data || [];

  // 🔥 2. Mutations Hooks
  const updateMessage = useUpdate("/api/contact/messages", {
    invalidateKeys: ["messages"],
    onSuccess: () => {
      toast.success("Message updated successfully");
      setIsDetailsOpen(false);
    },
  });

  const deleteMessage = useDelete("/api/contact/messages", {
    invalidateKeys: ["messages"],
    onSuccess: () => toast.success("Message deleted"),
  });

  // Local States
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal States
  const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");

  // 🔥 3. Filtering Logic
  const filteredMessages = messages.filter((msg) => {
    const matchesSearch =
      msg.name.toLowerCase().includes(search.toLowerCase()) ||
      msg.email.toLowerCase().includes(search.toLowerCase()) ||
      msg.phone.includes(search);
    const matchesFilter =
      filterStatus === "all" ? true : msg.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // 🔥 4. KPI Stats
  const stats = {
    total: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    closed: messages.filter((m) => m.status === "closed").length,
  };

  // 🔥 5. Update Handler
  const handleUpdate = () => {
    if (!selectedMsg) return;
    updateMessage.mutate({
      id: selectedMsg._id,
      data: { status, adminNote: note },
    });
  };

  // 🔥 6. Delete Handler
  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    deleteMessage.mutate(id);
  };

  // Helper for Status Color
  const getStatusColor = (st: string) => {
    switch (st) {
      case "new":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "read":
        return "bg-slate-100 text-slate-700 border-slate-200";
      case "replied":
        return "bg-green-100 text-green-700 border-green-200";
      case "closed":
        return "bg-red-50 text-red-600 border-red-200";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* --- Header & KPIs --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Support Inbox
          </h1>
          <p className="text-slate-500">
            Manage student queries and support tickets.
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} className="gap-2">
          <RefreshCcw
            className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard
          title="Total Messages"
          value={stats.total}
          icon={MessageSquare}
        />
        <KpiCard
          title="New / Pending"
          value={stats.new}
          icon={AlertCircle}
          active
        />
        <KpiCard
          title="Resolved / Closed"
          value={stats.closed}
          icon={CheckCircle2}
        />
      </div>

      {/* --- Controls --- */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by name, email or phone..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="h-4 w-4 text-slate-500" />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">🔵 New</SelectItem>
              <SelectItem value="read">👀 Read</SelectItem>
              <SelectItem value="replied">✅ Replied</SelectItem>
              <SelectItem value="closed">❌ Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Sender Info</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="w-[300px]">Message Preview</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin w-5 h-5" /> Loading
                    messages...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-slate-500"
                >
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((msg) => (
                <TableRow
                  key={msg._id}
                  className={msg.status === "new" ? "bg-blue-50/40" : ""}
                >
                  <TableCell>
                    <div className="font-semibold text-slate-900">
                      {msg.name}
                    </div>
                    <div className="text-xs text-slate-500">{msg.email}</div>
                    <div className="text-xs text-slate-500">{msg.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {msg.department}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <p className="truncate text-sm text-slate-600 max-w-[300px]">
                      {msg.message}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {format(new Date(msg.createdAt), "dd MMM yyyy, hh:mm a")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={`capitalize border ${getStatusColor(
                        msg.status
                      )}`}
                    >
                      {msg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMsg(msg);
                            setNote(msg.adminNote || "");
                            setStatus(msg.status);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(msg._id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden bg-white rounded-2xl shadow-2xl border-0">
          {/* Header */}
          <div className="px-6 py-5 border-b bg-slate-50/80 backdrop-blur-sm flex justify-between items-center">
            <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Message Details
            </DialogTitle>
          </div>

          {selectedMsg && (
            <div className="flex flex-col md:flex-row h-full">
              {/* 🔥 Left Sidebar: User Info (Fixed Width) */}
              <div className="w-full md:w-[320px] bg-slate-50/50 p-6 border-r border-slate-100 flex-shrink-0">
                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-primary font-bold text-xl uppercase">
                    {selectedMsg.name.charAt(0)}
                  </div>
                  <div>
                    <p
                      className="font-bold text-slate-900 text-lg leading-tight line-clamp-1"
                      title={selectedMsg.name}
                    >
                      {selectedMsg.name}
                    </p>
                    <Badge
                      variant="secondary"
                      className="mt-1.5 text-xs font-medium border-slate-200 bg-white px-2"
                    >
                      Student
                    </Badge>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Contact Info Block */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Contact Information
                    </Label>

                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-blue-50 text-blue-600 rounded-md">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs text-slate-400 mb-0.5">Email</p>
                          <p className="text-sm font-medium text-slate-700 break-all leading-tight">
                            {selectedMsg.email}
                          </p>
                        </div>
                      </div>

                      <div className="w-full h-[1px] bg-slate-50"></div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-green-50 text-green-600 rounded-md">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 mb-0.5">Phone</p>
                          <p className="text-sm font-medium text-slate-700 leading-tight">
                            {selectedMsg.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Info Block */}
                  <div className="space-y-3">
                    <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">
                      Request Meta
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        <p className="text-xs text-slate-400 mb-1">Received</p>
                        <p className="text-sm font-semibold text-slate-700">
                          {format(new Date(selectedMsg.createdAt), "dd MMM")}
                        </p>
                        <p className="text-xs text-slate-500">
                          {format(new Date(selectedMsg.createdAt), "hh:mm a")}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-center">
                        <p className="text-xs text-slate-400 mb-1">
                          Department
                        </p>
                        <Badge
                          variant="outline"
                          className="w-fit capitalize bg-slate-50 text-slate-700 border-slate-200"
                        >
                          {selectedMsg.department}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔥 Right Content: Message & Actions (Flexible Width) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col bg-white">
                {/* Message Body */}
                <div className="flex-1 mb-8">
                  <Label className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Message Body
                  </Label>
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 text-sm leading-7 whitespace-pre-wrap">
                    {selectedMsg.message}
                  </div>
                </div>

                {/* Actions Area */}
                <div className="pt-6 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500" />
                    Admin Actions
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-medium text-slate-500">
                        Update Status
                      </Label>
                      <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full bg-white border-slate-200 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">🔵 New / Unread</SelectItem>
                          <SelectItem value="read">👀 Seen / Read</SelectItem>
                          <SelectItem value="replied">✅ Replied</SelectItem>
                          <SelectItem value="closed">
                            ❌ Closed / Solved
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs font-medium text-slate-500">
                        Internal Note
                      </Label>
                      <Textarea
                        placeholder="Add a private note..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[80px] bg-yellow-50/40 border-yellow-200 focus:border-yellow-400 focus:ring-yellow-100 resize-none text-sm rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setIsDetailsOpen(false)}
              className="hover:bg-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMessage.isPending}
              className="px-6 bg-slate-900 hover:bg-slate-800 text-white"
            >
              {updateMessage.isPending ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Simple KPI Card Component
function KpiCard({ title, value, icon: Icon, active }: any) {
  return (
    <Card className={active ? "border-blue-200 bg-blue-50/50" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">
          {title}
        </CardTitle>
        <Icon
          className={`h-4 w-4 ${active ? "text-blue-600" : "text-slate-400"}`}
        />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${
            active ? "text-blue-700" : "text-slate-900"
          }`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

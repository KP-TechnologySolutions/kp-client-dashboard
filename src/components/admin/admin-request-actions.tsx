"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle2,
  XCircle,
  Play,
  Eye,
  Send,
  UserCircle,
  ArrowRight,
} from "lucide-react";
import { ADMIN_TEAM } from "@/lib/constants";
import { updateRequestStatus, assignRequest, addComment, updateRequestEta } from "@/lib/actions";
import type { RequestStatus } from "@/lib/types";
import { Input } from "@/components/ui/input";

const STATUS_ACTIONS: {
  status: RequestStatus;
  label: string;
  icon: React.ElementType;
  activeClass: string;
  inactiveClass: string;
}[] = [
  {
    status: "reviewed",
    label: "Reviewed",
    icon: Eye,
    activeClass: "bg-violet-500 text-white shadow-lg shadow-violet-500/30",
    inactiveClass: "bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20",
  },
  {
    status: "in_progress",
    label: "Start Work",
    icon: Play,
    activeClass: "bg-amber-500 text-white shadow-lg shadow-amber-500/30",
    inactiveClass: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20",
  },
  {
    status: "complete",
    label: "Complete",
    icon: CheckCircle2,
    activeClass: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
    inactiveClass: "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20",
  },
  {
    status: "rejected",
    label: "Reject",
    icon: XCircle,
    activeClass: "bg-red-500 text-white shadow-lg shadow-red-500/30",
    inactiveClass: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
  },
];

export function AdminRequestActions({
  request,
}: {
  request: { id: string; status: string; assigned_to: string | null; request_number: number; due_date: string | null };
}) {
  const [currentStatus, setCurrentStatus] = useState<RequestStatus>(request.status as RequestStatus);
  const [assignee, setAssignee] = useState(request.assigned_to ?? "unassigned");
  const [eta, setEta] = useState(request.due_date ?? "");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleStatusChange(newStatus: RequestStatus) {
    setCurrentStatus(newStatus);
    try {
      await updateRequestStatus(request.id, newStatus);
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function handleAssign(value: string) {
    setAssignee(value);
    try {
      await assignRequest(request.id, value);
      toast.success(`Assigned to ${value === "unassigned" ? "nobody" : value}`);
    } catch {
      toast.error("Failed to assign");
    }
  }

  async function handleEtaChange(date: string) {
    setEta(date);
    try {
      await updateRequestEta(request.id, date || null);
      toast.success(date ? `ETA set to ${new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : "ETA cleared");
    } catch {
      toast.error("Failed to update ETA");
    }
  }

  async function handleAddComment() {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      await addComment(request.id, comment, false);
      toast.success("Comment sent");
      setComment("");
    } catch {
      toast.error("Failed to add comment");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-1 gradient-indigo" />
        <CardContent className="pt-5 space-y-4">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_ACTIONS.map((action) => {
                const isActive = currentStatus === action.status;
                return (
                  <motion.button
                    key={action.status}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleStatusChange(action.status)}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive ? action.activeClass : action.inactiveClass
                    }`}
                  >
                    <action.icon className="w-3.5 h-3.5" />
                    {action.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Assign To
            </p>
            <Select value={assignee} onValueChange={(v) => v && handleAssign(v)}>
              <SelectTrigger className="w-full h-10 rounded-xl bg-white/5 border-white/10">
                <div className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-muted-foreground" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {ADMIN_TEAM.map((member) => (
                  <SelectItem key={member.id} value={member.name}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ETA */}
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              ETA for Client
            </p>
            <Input
              type="date"
              value={eta}
              onChange={(e) => handleEtaChange(e.target.value)}
              className="h-10 rounded-xl bg-white/5 border-white/10 text-foreground [color-scheme:dark]"
            />
            {eta && (
              <p className="text-xs text-muted-foreground mt-1.5">
                Client will see: <span className="text-primary font-medium">
                  {new Date(eta + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5 space-y-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
            Add Comment
          </p>
          <Textarea
            placeholder="Write a comment..."
            className="min-h-24 resize-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            className="w-full shadow-xl shadow-primary/25"
            disabled={!comment.trim() || saving}
            onClick={handleAddComment}
          >
            <Send className="w-4 h-4 mr-2" />
            {saving ? "Sending..." : "Send Comment"}
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-40" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

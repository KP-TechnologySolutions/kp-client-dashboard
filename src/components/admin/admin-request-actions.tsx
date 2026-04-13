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
import { ADMIN_TEAM, STATUS_CONFIG } from "@/lib/constants";
import type { RequestWithDetails, RequestStatus } from "@/lib/types";

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
  request: RequestWithDetails;
}) {
  const [currentStatus, setCurrentStatus] = useState<RequestStatus>(request.status);
  const [assignee, setAssignee] = useState(request.assigned_to ?? "unassigned");
  const [comment, setComment] = useState("");

  function handleStatusChange(newStatus: RequestStatus) {
    setCurrentStatus(newStatus);
    toast.success(
      `Status updated to ${STATUS_CONFIG[newStatus].label}`,
      { description: `KP-${String(request.request_number).padStart(4, "0")}` }
    );
  }

  function handleAssign(value: string) {
    setAssignee(value);
    const name =
      value === "unassigned"
        ? "nobody"
        : ADMIN_TEAM.find((m) => m.id === value)?.name ?? value;
    toast.success(`Assigned to ${name}`);
  }

  function handleAddComment() {
    if (!comment.trim()) return;
    toast.success("Comment sent");
    setComment("");
  }

  return (
    <div className="space-y-4">
      {/* Status Control */}
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

          {/* Assign */}
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
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Comment */}
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
            disabled={!comment.trim()}
            onClick={handleAddComment}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Comment
            <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-40" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

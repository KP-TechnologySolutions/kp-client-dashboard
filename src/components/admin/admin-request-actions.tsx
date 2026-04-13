"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";
import { ADMIN_TEAM, STATUS_CONFIG } from "@/lib/constants";
import type { RequestWithDetails, RequestStatus } from "@/lib/types";

const STATUS_ACTIONS: {
  status: RequestStatus;
  label: string;
  icon: React.ElementType;
  variant: "default" | "outline" | "destructive";
}[] = [
  { status: "reviewed", label: "Mark Reviewed", icon: Eye, variant: "outline" },
  {
    status: "in_progress",
    label: "Start Work",
    icon: Play,
    variant: "outline",
  },
  {
    status: "complete",
    label: "Mark Complete",
    icon: CheckCircle2,
    variant: "default",
  },
  {
    status: "rejected",
    label: "Reject",
    icon: XCircle,
    variant: "destructive",
  },
];

export function AdminRequestActions({
  request,
}: {
  request: RequestWithDetails;
}) {
  const router = useRouter();
  const [assignee, setAssignee] = useState(request.assigned_to ?? "unassigned");
  const [comment, setComment] = useState("");

  function handleStatusChange(newStatus: RequestStatus) {
    toast.success(
      `Status changed to ${STATUS_CONFIG[newStatus].label}`
    );
    // In production: Server Action to update status + send email
  }

  function handleAssign(value: string) {
    setAssignee(value);
    const name =
      value === "unassigned"
        ? "nobody"
        : ADMIN_TEAM.find((m) => m.id === value)?.name ?? value;
    toast.success(`Assigned to ${name}`);
    // In production: Server Action to update assigned_to
  }

  function handleAddComment() {
    if (!comment.trim()) return;
    toast.success("Comment added");
    setComment("");
    // In production: Server Action to insert comment
  }

  const availableStatuses = STATUS_ACTIONS.filter(
    (a) => a.status !== request.status
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Assign */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
            Assign To
          </label>
          <Select value={assignee} onValueChange={(v) => v && handleAssign(v)}>
            <SelectTrigger className="w-full">
              <SelectValue />
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

        {/* Status transitions */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
            Update Status
          </label>
          <div className="grid grid-cols-2 gap-2">
            {availableStatuses.map((action) => (
              <Button
                key={action.status}
                variant={action.variant}
                size="sm"
                className="text-xs"
                onClick={() => handleStatusChange(action.status)}
              >
                <action.icon className="w-3.5 h-3.5 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Add Comment */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1.5">
            Add Comment
          </label>
          <Textarea
            placeholder="Write a comment..."
            className="min-h-20 text-sm"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <Button
            size="sm"
            className="mt-2 w-full"
            disabled={!comment.trim()}
            onClick={handleAddComment}
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            Send Comment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

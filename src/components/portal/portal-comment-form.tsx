"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { addComment } from "@/lib/actions";

export function PortalCommentForm({ requestId }: { requestId: string }) {
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!comment.trim()) return;
    setSaving(true);
    try {
      await addComment(requestId, comment, false);
      toast.success("Comment added");
      setComment("");
    } catch {
      toast.error("Failed to add comment");
    }
    setSaving(false);
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a comment or follow-up..."
        className="min-h-20 resize-none"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!comment.trim() || saving}
          onClick={handleSubmit}
          className="shadow-md shadow-primary/20"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          {saving ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}

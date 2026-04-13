"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function PortalCommentForm() {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    if (!comment.trim()) return;
    toast.success("Comment added");
    setComment("");
    // In production: Server Action to insert comment + email admin
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Add a comment or follow-up..."
        className="min-h-20 text-sm"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          disabled={!comment.trim()}
          onClick={handleSubmit}
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Send
        </Button>
      </div>
    </div>
  );
}

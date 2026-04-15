"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { deleteRequest } from "@/lib/actions";

export function DeleteRequestButton({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function handleDelete() {
    try {
      await deleteRequest(requestId);
      toast.success("Request deleted");
      router.push("/portal/requests");
    } catch {
      toast.error("Failed to delete request");
    }
  }

  if (!confirmDelete) {
    return (
      <button
        onClick={() => setConfirmDelete(true)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-red-400 transition-colors cursor-pointer w-full justify-center py-2 mt-4"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete Request
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 space-y-2 mt-4">
      <p className="text-xs text-red-400 text-center font-medium">Are you sure? This cannot be undone.</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
          onClick={() => setConfirmDelete(false)}
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="flex-1 text-xs"
          onClick={handleDelete}
        >
          <Trash2 className="w-3.5 h-3.5 mr-1" />
          Delete
        </Button>
      </div>
    </div>
  );
}

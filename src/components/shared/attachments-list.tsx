"use client";

import { FileIcon, ImageIcon, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Attachment {
  id: string;
  file_name: string;
  file_size_kb: number;
  mime_type: string;
  storage_path: string;
}

export function AttachmentsList({ attachments }: { attachments: Attachment[] }) {
  if (attachments.length === 0) return null;

  async function handleDownload(attachment: Attachment) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("request-attachments")
      .download(attachment.storage_path);

    if (error || !data) return;

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.file_name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
        Attachments ({attachments.length})
      </p>
      <div className="space-y-1.5">
        {attachments.map((att) => (
          <button
            key={att.id}
            onClick={() => handleDownload(att)}
            className="flex items-center gap-3 w-full p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer group text-left"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {att.mime_type?.startsWith("image/") ? (
                <ImageIcon className="w-4 h-4 text-primary" />
              ) : (
                <FileIcon className="w-4 h-4 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/90 truncate">{att.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {att.file_size_kb ? `${att.file_size_kb} KB` : ""}
              </p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

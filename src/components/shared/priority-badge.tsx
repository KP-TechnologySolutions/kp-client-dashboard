import { Badge } from "@/components/ui/badge";
import type { RequestPriority } from "@/lib/types";

const PRIORITY_STYLES: Record<
  RequestPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  },
  normal: {
    label: "Normal",
    className: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  },
  high: {
    label: "High",
    className: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
  },
};

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const style = PRIORITY_STYLES[priority];
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold border px-2 py-0.5 ${style.className}`}
    >
      {priority === "urgent" && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400 mr-1 animate-pulse" />
      )}
      {style.label}
    </Badge>
  );
}

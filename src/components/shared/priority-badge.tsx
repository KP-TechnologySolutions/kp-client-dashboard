import { Badge } from "@/components/ui/badge";
import type { RequestPriority } from "@/lib/types";

const PRIORITY_STYLES: Record<
  RequestPriority,
  { label: string; className: string }
> = {
  low: {
    label: "Low",
    className: "bg-slate-50 text-slate-600 border-slate-200/80",
  },
  normal: {
    label: "Normal",
    className: "bg-sky-50 text-sky-700 border-sky-200/80",
  },
  high: {
    label: "High",
    className: "bg-orange-50 text-orange-700 border-orange-200/80",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-50 text-red-700 border-red-200/80",
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
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1 animate-pulse" />
      )}
      {style.label}
    </Badge>
  );
}

import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  RequestStatus,
  { label: string; className: string }
> = {
  submitted: {
    label: "Submitted",
    className: "bg-blue-50 text-blue-700 border-blue-200/80 shadow-blue-100/50",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-violet-50 text-violet-700 border-violet-200/80 shadow-violet-100/50",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-amber-100/50",
  },
  complete: {
    label: "Complete",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-emerald-100/50",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-600 border-red-200/80 shadow-red-100/50",
  },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold border px-2 py-0.5 shadow-sm ${style.className}`}
    >
      <span
        className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${
          status === "submitted"
            ? "bg-blue-500"
            : status === "reviewed"
              ? "bg-violet-500"
              : status === "in_progress"
                ? "bg-amber-500"
                : status === "complete"
                  ? "bg-emerald-500"
                  : "bg-red-500"
        }`}
      />
      {style.label}
    </Badge>
  );
}

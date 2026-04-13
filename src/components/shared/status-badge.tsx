import { Badge } from "@/components/ui/badge";
import type { RequestStatus } from "@/lib/types";

const STATUS_STYLES: Record<
  RequestStatus,
  { label: string; className: string; dotColor: string }
> = {
  submitted: {
    label: "Submitted",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    dotColor: "bg-blue-400",
  },
  reviewed: {
    label: "Reviewed",
    className: "bg-violet-500/15 text-violet-400 border-violet-500/20",
    dotColor: "bg-violet-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    dotColor: "bg-amber-400",
  },
  complete: {
    label: "Complete",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    dotColor: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-500/15 text-red-400 border-red-500/20",
    dotColor: "bg-red-400",
  },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <Badge
      variant="outline"
      className={`text-[11px] font-semibold border px-2.5 py-0.5 ${style.className}`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${style.dotColor}`} />
      {style.label}
    </Badge>
  );
}

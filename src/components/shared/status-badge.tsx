import { Badge } from "@/components/ui/badge";
import { STATUS_CONFIG } from "@/lib/constants";
import type { RequestStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} border font-medium text-xs`}
    >
      {config.label}
    </Badge>
  );
}

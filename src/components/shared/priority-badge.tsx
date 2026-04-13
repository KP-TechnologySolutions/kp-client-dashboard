import { Badge } from "@/components/ui/badge";
import { PRIORITY_CONFIG } from "@/lib/constants";
import type { RequestPriority } from "@/lib/types";

export function PriorityBadge({ priority }: { priority: RequestPriority }) {
  const config = PRIORITY_CONFIG[priority];
  return (
    <Badge
      variant="outline"
      className={`${config.bgColor} ${config.color} border font-medium text-xs`}
    >
      {config.label}
    </Badge>
  );
}

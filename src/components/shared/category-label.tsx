import {
  UtensilsCrossed,
  FileText,
  Sparkles,
  Bug,
  Palette,
  MoreHorizontal,
} from "lucide-react";
import { CATEGORY_CONFIG } from "@/lib/constants";
import type { RequestCategory } from "@/lib/types";

const ICONS: Record<string, React.ElementType> = {
  UtensilsCrossed,
  FileText,
  Sparkles,
  Bug,
  Palette,
  MoreHorizontal,
};

export function CategoryLabel({ category }: { category: RequestCategory }) {
  const config = CATEGORY_CONFIG[category];
  const Icon = ICONS[config.icon] ?? MoreHorizontal;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}

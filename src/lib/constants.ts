import type { RequestStatus, RequestCategory, RequestPriority } from "./types";

export const STATUS_CONFIG: Record<
  RequestStatus,
  { label: string; color: string; bgColor: string }
> = {
  submitted: {
    label: "Submitted",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
  },
  reviewed: {
    label: "Reviewed",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
  },
  in_progress: {
    label: "In Progress",
    color: "text-amber-700",
    bgColor: "bg-amber-50 border-amber-200",
  },
  complete: {
    label: "Complete",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50 border-emerald-200",
  },
  rejected: {
    label: "Rejected",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
  },
};

export const CATEGORY_CONFIG: Record<
  RequestCategory,
  { label: string; icon: string }
> = {
  menu_update: { label: "Menu Update", icon: "UtensilsCrossed" },
  content_change: { label: "Content Change", icon: "FileText" },
  feature_request: { label: "Feature Request", icon: "Sparkles" },
  bug_fix: { label: "Bug Fix", icon: "Bug" },
  design_change: { label: "Design Change", icon: "Palette" },
  other: { label: "Other", icon: "MoreHorizontal" },
};

export const PRIORITY_CONFIG: Record<
  RequestPriority,
  { label: string; color: string; bgColor: string }
> = {
  low: {
    label: "Low",
    color: "text-slate-600",
    bgColor: "bg-slate-50 border-slate-200",
  },
  normal: {
    label: "Normal",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  high: {
    label: "High",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
  urgent: {
    label: "Urgent",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
};

export const STATUS_ORDER: RequestStatus[] = [
  "submitted",
  "reviewed",
  "in_progress",
  "complete",
  "rejected",
];

export const ADMIN_TEAM = [
  { id: "admin-hal", name: "Hal" },
  { id: "admin-shawn", name: "Shawn" },
];

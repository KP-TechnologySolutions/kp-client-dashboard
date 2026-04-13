import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Building2,
  MessageSquare,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  Timer,
  Target,
} from "lucide-react";
import { getRequestWithDetails, getProfile } from "@/lib/mock-data";
import { STATUS_CONFIG } from "@/lib/constants";
import { AdminRequestActions } from "@/components/admin/admin-request-actions";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = getRequestWithDetails(id, "admin");

  if (!request) {
    notFound();
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back link */}
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All Requests
      </Link>

      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-sm text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md">
            KP-{String(request.request_number).padStart(4, "0")}
          </span>
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
          <CategoryLabel category={request.category} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">
          {request.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {request.organization.name}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {request.submitter.full_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.created_at)}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                {request.description}
              </p>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          {request.internal_notes && (
            <div className="rounded-xl bg-gradient-to-br from-amber-50 to-orange-50/60 border border-amber-200/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-amber-200/60 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                </div>
                <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  Internal Note
                </span>
              </div>
              <p className="text-sm text-amber-900/80 leading-relaxed">
                {request.internal_notes}
              </p>
            </div>
          )}

          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/8 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                </div>
                Comments
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  ({request.comments.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {request.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No comments yet.
                </p>
              ) : (
                request.comments.map((comment) => {
                  const author = getProfile(comment.author_id);
                  const isInternal = comment.is_internal;
                  return (
                    <div
                      key={comment.id}
                      className={`p-3.5 rounded-xl ${
                        isInternal
                          ? "bg-amber-50/70 border border-amber-200/50"
                          : "bg-muted/40 border border-border/40"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          author?.role === "admin"
                            ? "bg-gradient-to-br from-primary to-primary/70 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}>
                          {author?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") ?? "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-semibold">
                            {author?.full_name ?? "Unknown"}
                          </span>
                          {author?.role === "admin" && (
                            <span className="text-[10px] font-medium text-primary ml-1.5">
                              Team
                            </span>
                          )}
                        </div>
                        {isInternal && (
                          <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-200/80">
                            Internal
                          </Badge>
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm pl-9 text-foreground/80 leading-relaxed">
                        {comment.body}
                      </p>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          {request.activity.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-border">
                  {request.activity.map((log) => {
                    const actor = getProfile(log.actor_id);
                    let description = "";
                    switch (log.action) {
                      case "created":
                        description = "created this request";
                        break;
                      case "status_changed":
                        description = `changed status from ${STATUS_CONFIG[log.old_value as keyof typeof STATUS_CONFIG]?.label ?? log.old_value} to ${STATUS_CONFIG[log.new_value as keyof typeof STATUS_CONFIG]?.label ?? log.new_value}`;
                        break;
                      case "assigned":
                        description = `assigned to ${log.new_value}`;
                        break;
                      case "commented":
                        description = "added a comment";
                        break;
                      case "priority_changed":
                        description = `changed priority from ${log.old_value} to ${log.new_value}`;
                        break;
                    }
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 text-sm relative"
                      >
                        <div className="w-[23px] h-[23px] rounded-full bg-card border-2 border-border flex items-center justify-center shrink-0 z-10">
                          <div className="w-2 h-2 rounded-full bg-primary/40" />
                        </div>
                        <div className="pt-0.5">
                          <span className="font-semibold">
                            {actor?.full_name ?? "Unknown"}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {description}
                          </span>
                          <p className="text-[11px] text-muted-foreground/70 mt-0.5">
                            {formatDate(log.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <AdminRequestActions request={request} />

          {/* Details Card */}
          <Card>
            <CardContent className="pt-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Details
              </p>
              <div className="space-y-3.5">
                <DetailRow
                  icon={User}
                  label="Assigned"
                  value={request.assignee?.full_name ?? "Unassigned"}
                  muted={!request.assignee}
                />
                <DetailRow
                  icon={Calendar}
                  label="Due Date"
                  value={request.due_date ? formatShortDate(request.due_date) : "Not set"}
                  muted={!request.due_date}
                />
                <DetailRow
                  icon={Target}
                  label="Estimate"
                  value={request.estimated_minutes ? `${request.estimated_minutes} min` : "Not set"}
                  muted={!request.estimated_minutes}
                />
                {request.actual_minutes && (
                  <DetailRow
                    icon={Timer}
                    label="Actual"
                    value={`${request.actual_minutes} min`}
                  />
                )}
                {request.completed_at && (
                  <DetailRow
                    icon={Clock}
                    label="Completed"
                    value={formatDate(request.completed_at)}
                    sub={request.completed_by ? `by ${getProfile(request.completed_by)?.full_name}` : undefined}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardContent className="pt-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                Client
              </p>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    {request.organization.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {request.organization.primary_contact_name}
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Mail className="w-3.5 h-3.5" />
                  {request.organization.primary_contact_email}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {request.organization.primary_contact_phone}
                </div>
                {request.organization.website_url && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">
                      {request.organization.website_url.replace(/https?:\/\//, "")}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  sub,
  muted,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted/60 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${muted ? "text-muted-foreground" : ""}`}>
          {value}
        </p>
        {sub && (
          <p className="text-[11px] text-muted-foreground">{sub}</p>
        )}
      </div>
    </div>
  );
}

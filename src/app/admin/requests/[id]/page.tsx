import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        All Requests
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm text-muted-foreground">
              KP-{String(request.request_number).padStart(4, "0")}
            </span>
            <StatusBadge status={request.status} />
            <PriorityBadge priority={request.priority} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {request.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
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
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {request.description}
              </p>
              <div className="mt-3">
                <CategoryLabel category={request.category} />
              </div>
            </CardContent>
          </Card>

          {/* Internal Notes */}
          {request.internal_notes && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Internal Notes (Admin Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-amber-900 whitespace-pre-wrap">
                  {request.internal_notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Comments ({request.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {request.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No comments yet.
                </p>
              ) : (
                request.comments.map((comment) => {
                  const author = getProfile(comment.author_id);
                  return (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border ${
                        comment.is_internal
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {author?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("") ?? "?"}
                        </div>
                        <span className="text-sm font-medium">
                          {author?.full_name ?? "Unknown"}
                        </span>
                        {comment.is_internal && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-amber-100 text-amber-700 border-amber-200"
                          >
                            Internal
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground ml-auto">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm pl-8">{comment.body}</p>
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
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
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
                        className="flex items-start gap-3 text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                        <div>
                          <span className="font-medium">
                            {actor?.full_name ?? "Unknown"}
                          </span>{" "}
                          <span className="text-muted-foreground">
                            {description}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
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

          <Card>
            <CardContent className="pt-5 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Assigned To
                </p>
                <p className="text-sm font-medium">
                  {request.assignee?.full_name ?? (
                    <span className="text-amber-600">Unassigned</span>
                  )}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Due Date
                </p>
                <p className="text-sm font-medium">
                  {request.due_date
                    ? formatShortDate(request.due_date)
                    : "Not set"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                  Time Estimate
                </p>
                <p className="text-sm font-medium">
                  {request.estimated_minutes
                    ? `${request.estimated_minutes} min`
                    : "Not set"}
                </p>
              </div>
              {request.actual_minutes && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Actual Time
                    </p>
                    <p className="text-sm font-medium">
                      {request.actual_minutes} min
                    </p>
                  </div>
                </>
              )}
              {request.completed_at && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
                      Completed
                    </p>
                    <p className="text-sm font-medium">
                      {formatDate(request.completed_at)}
                    </p>
                    {request.completed_by && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        by {getProfile(request.completed_by)?.full_name}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Client Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">
                {request.organization.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.organization.primary_contact_email}
              </p>
              <p className="text-xs text-muted-foreground">
                {request.organization.primary_contact_phone}
              </p>
              {request.organization.website_url && (
                <p className="text-xs text-primary truncate">
                  {request.organization.website_url}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

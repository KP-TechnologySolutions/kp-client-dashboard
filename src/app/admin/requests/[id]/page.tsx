import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import {
  ArrowLeft, Calendar, Clock, User, Building2, MessageSquare,
  AlertTriangle, Globe, Mail, Phone, Timer, Target,
} from "lucide-react";
import { getRequestById, getRequestComments, getRequestActivity, getRequestAttachments } from "@/lib/queries";
import { AdminRequestActions } from "@/components/admin/admin-request-actions";
import { AttachmentsList } from "@/components/shared/attachments-list";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

export default async function AdminRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getRequestById(id);
  if (!request) notFound();

  const [comments, activity, attachments] = await Promise.all([
    getRequestComments(id, true),
    getRequestActivity(id),
    getRequestAttachments(id),
  ]);

  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/admin/requests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        All Requests
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-mono text-sm text-primary/70 bg-primary/10 px-2 py-0.5 rounded-md">
            KP-{String(request.request_number).padStart(4, "0")}
          </span>
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
          <CategoryLabel category={request.category} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{request.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            {request.organization?.name}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {request.submitter?.full_name}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(request.created_at)}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Description */}
          <Card>
            <CardContent className="pt-5">
              <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{request.description}</p>
            </CardContent>
          </Card>

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card>
              <CardContent className="pt-5">
                <AttachmentsList attachments={attachments} />
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          {request.internal_notes && (
            <div className="rounded-xl bg-amber-500/5 border border-amber-500/15 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Internal Note</span>
              </div>
              <p className="text-sm text-amber-200/80 leading-relaxed">{request.internal_notes}</p>
            </div>
          )}

          {/* Comments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-primary" />
                </div>
                Comments
                <span className="text-xs font-normal text-muted-foreground ml-1">({comments.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No comments yet.</p>
              ) : (
                comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-xl ${
                      comment.is_internal
                        ? "bg-amber-500/5 border border-amber-500/15"
                        : "bg-white/[0.03] border border-white/[0.06]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                        comment.author?.role === "admin"
                          ? "gradient-indigo text-white"
                          : "bg-white/10 text-white/70"
                      }`}>
                        {comment.author?.full_name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-white">{comment.author?.full_name ?? "Unknown"}</span>
                        {comment.author?.role === "admin" && (
                          <span className="text-[10px] font-medium text-primary ml-1.5">Team</span>
                        )}
                      </div>
                      {comment.is_internal && (
                        <Badge className="text-[10px] bg-amber-500/15 text-amber-400 border-amber-500/20">Internal</Badge>
                      )}
                      <span className="text-[11px] text-muted-foreground">{formatDate(comment.created_at)}</span>
                    </div>
                    <p className="text-sm pl-9 text-foreground/80 leading-relaxed">{comment.body}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Activity */}
          {activity.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-white/[0.06]">
                  {activity.map((log: any) => {
                    let description = log.action;
                    if (log.action === "created") description = "created this request";
                    else if (log.action === "status_changed") description = `changed status to ${log.new_value?.replace("_", " ")}`;
                    else if (log.action === "assigned") description = `assigned to ${log.new_value ?? "nobody"}`;
                    else if (log.action === "commented") description = "added a comment";
                    return (
                      <div key={log.id} className="flex items-start gap-3 text-sm relative">
                        <div className="w-[23px] h-[23px] rounded-full bg-card border-2 border-white/10 flex items-center justify-center shrink-0 z-10">
                          <div className="w-2 h-2 rounded-full bg-primary/40" />
                        </div>
                        <div className="pt-0.5">
                          <span className="font-semibold text-white">{log.actor?.full_name ?? "Unknown"}</span>{" "}
                          <span className="text-muted-foreground">{description}</span>
                          <p className="text-[11px] text-muted-foreground/70 mt-0.5">{formatDate(log.created_at)}</p>
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
            <CardContent className="pt-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Details</p>
              <div className="space-y-3.5">
                <DetailRow icon={User} label="Assigned" value={request.assigned_to ?? "Unassigned"} muted={!request.assigned_to} />
                <DetailRow icon={Calendar} label="Due Date" value={request.due_date ? formatShortDate(request.due_date) : "Not set"} muted={!request.due_date} />
                <DetailRow icon={Target} label="Estimate" value={request.estimated_minutes ? `${request.estimated_minutes} min` : "Not set"} muted={!request.estimated_minutes} />
                {request.actual_minutes && <DetailRow icon={Timer} label="Actual" value={`${request.actual_minutes} min`} />}
                {request.completed_at && <DetailRow icon={Clock} label="Completed" value={formatDate(request.completed_at)} />}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-5">
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Client</p>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-9 h-9 rounded-xl gradient-indigo flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{request.organization?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{request.organization?.primary_contact_name}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2 border-t border-white/[0.06]">
                {request.organization?.primary_contact_email && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                    <Mail className="w-3.5 h-3.5" />{request.organization.primary_contact_email}
                  </div>
                )}
                {request.organization?.primary_contact_phone && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />{request.organization.primary_contact_phone}
                  </div>
                )}
                {request.organization?.website_url && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate">{request.organization.website_url.replace(/https?:\/\//, "")}</span>
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

function DetailRow({ icon: Icon, label, value, muted }: { icon: React.ElementType; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 pt-0.5">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${muted ? "text-muted-foreground" : "text-white"}`}>{value}</p>
      </div>
    </div>
  );
}

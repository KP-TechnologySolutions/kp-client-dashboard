import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { CategoryLabel } from "@/components/shared/category-label";
import { ArrowLeft, Calendar, User, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getRequestById, getRequestComments, getRequestActivity, getRequestAttachments } from "@/lib/queries";
import { PortalCommentForm } from "@/components/portal/portal-comment-form";
import { AttachmentsList } from "@/components/shared/attachments-list";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export default async function PortalRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user || !user.organization_id) redirect("/login");

  const { id } = await params;
  const request = await getRequestById(id);
  if (!request || request.organization_id !== user.organization_id) notFound();

  const [comments, activity, attachments] = await Promise.all([
    getRequestComments(id, false),
    getRequestActivity(id),
    getRequestAttachments(id),
  ]);

  const statusSteps = [
    { key: "submitted", label: "Submitted" },
    { key: "reviewed", label: "Reviewed" },
    { key: "in_progress", label: "In Progress" },
    { key: "complete", label: "Complete" },
  ];
  const currentStepIndex = statusSteps.findIndex(s => s.key === request.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/portal/requests" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />My Requests
      </Link>

      <div className="space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-sm text-primary/70 bg-primary/10 px-2 py-0.5 rounded-md">KP-{String(request.request_number).padStart(4, "0")}</span>
          <StatusBadge status={request.status} />
          <PriorityBadge priority={request.priority} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{request.title}</h1>
        <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{formatDate(request.created_at)}</span>
          {request.assigned_to && <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" />Assigned to {request.assigned_to}</span>}
        </div>
      </div>

      {/* Status Timeline */}
      {request.status !== "rejected" && (
        <Card className="overflow-hidden">
          <div className="h-1 gradient-indigo" />
          <CardContent className="pt-6 pb-5">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, i) => {
                const isComplete = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                        isComplete ? "gradient-indigo text-white shadow-md shadow-primary/20" : "border-2 border-white/10 text-muted-foreground"
                      } ${isCurrent ? "ring-4 ring-primary/15" : ""}`}>
                        {isComplete ? <CheckCircle2 className="w-4.5 h-4.5" /> : i + 1}
                      </div>
                      <span className={`text-xs mt-2 font-semibold ${isCurrent ? "text-primary" : isComplete ? "text-white" : "text-muted-foreground/40"}`}>
                        {step.label}
                      </span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 mt-[-1.25rem] rounded-full ${i < currentStepIndex ? "gradient-indigo" : "bg-white/[0.06]"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card>
        <CardContent className="pt-5">
          <p className="text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">{request.description}</p>
          <div className="mt-3"><CategoryLabel category={request.category} /></div>
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

      {/* Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Status</p><StatusBadge status={request.status} /></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Priority</p><PriorityBadge priority={request.priority} /></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Due Date</p><p className="text-sm font-medium text-white">{request.due_date ? new Date(request.due_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD"}</p></CardContent></Card>
        <Card><CardContent className="pt-4 pb-3 text-center"><p className="text-xs text-muted-foreground mb-0.5">Assigned</p><p className="text-sm font-medium text-white">{request.assigned_to ?? "Pending"}</p></CardContent></Card>
      </div>

      {/* Comments */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center"><MessageSquare className="w-3.5 h-3.5 text-primary" /></div>
            Comments <span className="text-xs font-normal text-muted-foreground ml-1">({comments.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet. We&apos;ll update you here as we work on your request.</p>
          ) : (
            comments.map((comment: any) => {
              const isAdmin = comment.author?.role === "admin";
              return (
                <div key={comment.id} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${isAdmin ? "gradient-indigo text-white" : "bg-white/10 text-white/70"}`}>
                      {comment.author?.full_name?.split(" ").map((n: string) => n[0]).join("") ?? "?"}
                    </div>
                    <span className="text-sm font-semibold text-white">{comment.author?.full_name ?? "Unknown"}</span>
                    {isAdmin && <span className="text-[10px] font-medium text-primary">KP Team</span>}
                    <span className="text-[11px] text-muted-foreground ml-auto">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="text-sm pl-9 text-foreground/80 leading-relaxed">{comment.body}</p>
                </div>
              );
            })
          )}
          <Separator className="bg-white/[0.06]" />
          <PortalCommentForm requestId={id} />
        </CardContent>
      </Card>

      {/* Activity */}
      {activity.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-muted-foreground" /></div>
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activity.map((log: any) => {
                let description = log.action;
                if (log.action === "created") description = "submitted this request";
                else if (log.action === "status_changed") description = `updated status to ${log.new_value?.replace("_", " ")}`;
                else if (log.action === "assigned") description = `assigned to ${log.new_value}`;
                else if (log.action === "commented") description = "added a comment";
                return (
                  <div key={log.id} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40 mt-2 shrink-0" />
                    <div>
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
  );
}

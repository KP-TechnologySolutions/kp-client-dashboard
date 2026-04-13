import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import {
  ClipboardList,
  AlertCircle,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react";
import {
  getAdminStats,
  requests,
  getProfile,
  getOrganization,
} from "@/lib/mock-data";

export default function AdminDashboard() {
  const stats = getAdminStats();

  const needsAttention = requests
    .filter(
      (r) =>
        (r.status === "submitted" && !r.assigned_to) ||
        (r.status !== "complete" && r.status !== "rejected" && r.priority === "urgent")
    )
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  const recentRequests = requests
    .filter((r) => r.status !== "complete" && r.status !== "rejected")
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 8);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of all client requests
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Unassigned"
          value={stats.unassigned}
          icon={AlertCircle}
          accent="text-amber-600"
          bgAccent="bg-amber-50"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Loader2}
          accent="text-blue-600"
          bgAccent="bg-blue-50"
        />
        <StatCard
          title="Completed (Week)"
          value={stats.completedThisWeek}
          icon={CheckCircle2}
          accent="text-emerald-600"
          bgAccent="bg-emerald-50"
        />
        <StatCard
          title="Total Active"
          value={stats.totalActive}
          icon={ClipboardList}
          accent="text-primary"
          bgAccent="bg-primary/5"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Needs Attention */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAttention.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                All caught up!
              </p>
            ) : (
              needsAttention.map((req) => {
                const org = getOrganization(req.organization_id);
                return (
                  <Link
                    key={req.id}
                    href={`/admin/requests/${req.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          KP-{String(req.request_number).padStart(4, "0")}
                        </span>
                        <PriorityBadge priority={req.priority} />
                      </div>
                      <p className="text-sm font-medium truncate">
                        {req.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {org?.name}
                      </p>
                    </div>
                    <StatusBadge status={req.status} />
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Active Requests */}
        <Card className="lg:col-span-3">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              Active Requests
            </CardTitle>
            <Link
              href="/admin/requests"
              className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs"}
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentRequests.map((req) => {
                const org = getOrganization(req.organization_id);
                const assignee = req.assigned_to
                  ? getProfile(req.assigned_to)
                  : null;
                return (
                  <Link
                    key={req.id}
                    href={`/admin/requests/${req.id}`}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          KP-{String(req.request_number).padStart(4, "0")}
                        </span>
                        <span className="text-sm font-medium truncate">
                          {req.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {org?.name}
                        </span>
                        {assignee && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              {assignee.full_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={req.status} />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  accent,
  bgAccent,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  accent: string;
  bgAccent: string;
}) {
  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground font-medium">
            {title}
          </span>
          <div
            className={`w-8 h-8 rounded-lg ${bgAccent} flex items-center justify-center`}
          >
            <Icon className={`w-4 h-4 ${accent}`} />
          </div>
        </div>
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </CardContent>
    </Card>
  );
}

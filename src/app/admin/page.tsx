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
  TrendingUp,
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
          gradient="stat-gradient-amber"
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Loader2}
          gradient="stat-gradient-blue"
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatCard
          title="Completed"
          value={stats.completedThisWeek}
          subtitle="this week"
          icon={CheckCircle2}
          gradient="stat-gradient-emerald"
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />
        <StatCard
          title="Total Active"
          value={stats.totalActive}
          icon={TrendingUp}
          gradient="stat-gradient-indigo"
          iconColor="text-primary"
          iconBg="bg-primary/8"
        />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Needs Attention */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              Needs Attention
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {needsAttention.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-emerald-700">
                  All caught up!
                </p>
              </div>
            ) : (
              needsAttention.map((req) => {
                const org = getOrganization(req.organization_id);
                return (
                  <Link
                    key={req.id}
                    href={`/admin/requests/${req.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/20 hover:bg-primary/[0.02] hover:shadow-sm transition-all cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-muted-foreground">
                          KP-{String(req.request_number).padStart(4, "0")}
                        </span>
                        <PriorityBadge priority={req.priority} />
                      </div>
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
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
        <Card className="lg:col-span-3 shadow-sm">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-primary/8 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              Active Requests
            </CardTitle>
            <Link
              href="/admin/requests"
              className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs cursor-pointer"}
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentRequests.map((req) => {
                const org = getOrganization(req.organization_id);
                const assignee = req.assigned_to
                  ? getProfile(req.assigned_to)
                  : null;
                return (
                  <Link
                    key={req.id}
                    href={`/admin/requests/${req.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/60 transition-all cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">
                          KP-{String(req.request_number).padStart(4, "0")}
                        </span>
                        <span className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                          {req.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {org?.name}
                        </span>
                        {assignee && (
                          <>
                            <span className="text-muted-foreground/40">·</span>
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
  subtitle,
  icon: Icon,
  gradient,
  iconColor,
  iconBg,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className={`h-1 ${gradient}`} />
      <CardContent className="pt-5 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-[13px] text-muted-foreground font-medium">
              {title}
            </span>
            {subtitle && (
              <span className="text-[11px] text-muted-foreground/60 block">
                {subtitle}
              </span>
            )}
          </div>
          <div
            className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <span className="text-3xl font-bold tracking-tight">{value}</span>
      </CardContent>
    </Card>
  );
}

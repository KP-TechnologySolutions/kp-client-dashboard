import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import {
  PlusCircle,
  ClipboardList,
  Loader2,
  CheckCircle2,
  Send,
  ArrowRight,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getPortalStats, getRequestsForOrg, getProfile } from "@/lib/mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default async function PortalDashboard() {
  const user = await getCurrentUser();
  if (!user || !user.organization_id) redirect("/login");

  const stats = getPortalStats(user.organization_id);
  const recentRequests = getRequestsForOrg(user.organization_id)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user.full_name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s an overview of your website requests
          </p>
        </div>
        <Link href="/portal/requests/new" className={buttonVariants()}>
          <PlusCircle className="w-4 h-4 mr-2" />
          New Request
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Submitted"
          value={stats.submitted}
          icon={Send}
          accent="text-blue-600"
          bgAccent="bg-blue-50"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Loader2}
          accent="text-amber-600"
          bgAccent="bg-amber-50"
        />
        <StatCard
          title="Completed"
          value={stats.complete}
          icon={CheckCircle2}
          accent="text-emerald-600"
          bgAccent="bg-emerald-50"
        />
        <StatCard
          title="Total"
          value={stats.total}
          icon={ClipboardList}
          accent="text-primary"
          bgAccent="bg-primary/5"
        />
      </div>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Requests</CardTitle>
          <Link
            href="/portal/requests"
            className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs"}
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </CardHeader>
        <CardContent>
          {recentRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm mb-3">
                No requests yet
              </p>
              <Link href="/portal/requests/new" className={buttonVariants({ size: "sm" })}>
                Submit Your First Request
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRequests.map((req) => {
                const assignee = req.assigned_to
                  ? getProfile(req.assigned_to)
                  : null;
                return (
                  <Link
                    key={req.id}
                    href={`/portal/requests/${req.id}`}
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
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(req.created_at)}
                        </span>
                        {assignee && (
                          <>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">
                              Assigned to {assignee.full_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
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

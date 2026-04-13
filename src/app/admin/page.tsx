"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import {
  FadeIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/motion";
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
      <FadeIn>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of all client requests
          </p>
        </div>
      </FadeIn>

      {/* Gradient Stat Cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StaggerItem>
          <GradientStatCard
            title="Unassigned"
            value={stats.unassigned}
            icon={AlertCircle}
            gradient="gradient-amber"
            glow="glow-amber"
          />
        </StaggerItem>
        <StaggerItem>
          <GradientStatCard
            title="In Progress"
            value={stats.inProgress}
            icon={Loader2}
            gradient="gradient-blue"
            glow="glow-blue"
          />
        </StaggerItem>
        <StaggerItem>
          <GradientStatCard
            title="Completed"
            value={stats.completedThisWeek}
            subtitle="this week"
            icon={CheckCircle2}
            gradient="gradient-emerald"
            glow="glow-emerald"
          />
        </StaggerItem>
        <StaggerItem>
          <GradientStatCard
            title="Total Active"
            value={stats.totalActive}
            icon={TrendingUp}
            gradient="gradient-indigo"
            glow="glow-indigo"
          />
        </StaggerItem>
      </StaggerContainer>

      <div className="grid lg:grid-cols-5 gap-5">
        {/* Needs Attention */}
        <FadeIn delay={0.3} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gradient-amber flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">Needs Attention</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {needsAttention.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-10 h-10 rounded-xl gradient-emerald flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-emerald-400">
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
                      className="flex items-start gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary/20 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs text-primary/70">
                            KP-{String(req.request_number).padStart(4, "0")}
                          </span>
                          <PriorityBadge priority={req.priority} />
                        </div>
                        <p className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors">
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
        </FadeIn>

        {/* Active Requests */}
        <FadeIn delay={0.4} className="lg:col-span-3">
          <Card>
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <span className="text-white">Active Requests</span>
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
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary/60">
                            KP-{String(req.request_number).padStart(4, "0")}
                          </span>
                          <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                            {req.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {org?.name}
                          </span>
                          {assignee && (
                            <>
                              <span className="text-white/10">·</span>
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
        </FadeIn>
      </div>
    </div>
  );
}

function GradientStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  glow,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: React.ElementType;
  gradient: string;
  glow: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      {/* Subtle glow on hover */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glow} rounded-2xl`} />
      <CardContent className="pt-5 pb-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[13px] text-muted-foreground font-medium">
              {title}
            </p>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground/50">{subtitle}</p>
            )}
          </div>
          <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

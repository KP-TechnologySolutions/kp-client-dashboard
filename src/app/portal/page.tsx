"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/shared/motion";
import {
  PlusCircle, ClipboardList, Loader2, CheckCircle2, Send, ArrowRight, TrendingUp,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PortalDashboard() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ submitted: 0, inProgress: 0, complete: 0, total: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
      if (!profile?.organization_id) return;

      setUser(profile);

      // Get all orgs this user belongs to
      const { data: orgLinks } = await supabase
        .from("user_organizations")
        .select("organization_id")
        .eq("user_id", authUser.id);

      const orgIds = orgLinks?.map((l: any) => l.organization_id) ?? [];
      if (orgIds.length === 0 && profile.organization_id) {
        orgIds.push(profile.organization_id);
      }

      const { data: requests } = await supabase
        .from("requests")
        .select("*, organization:organizations(name)")
        .in("organization_id", orgIds)
        .order("updated_at", { ascending: false });

      const reqs = requests ?? [];
      setStats({
        submitted: reqs.filter(r => r.status === "submitted").length,
        inProgress: reqs.filter(r => r.status === "in_progress" || r.status === "reviewed").length,
        complete: reqs.filter(r => r.status === "complete").length,
        total: reqs.length,
      });
      setRecentRequests(reqs.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back{user ? `, ${user.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="text-muted-foreground mt-1">Here&apos;s an overview of your website requests</p>
          </div>
          <Link href="/portal/requests/new" className={buttonVariants({ size: "lg" }) + " shadow-xl shadow-primary/30"}>
            <PlusCircle className="w-5 h-5 mr-2" />New Request
          </Link>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StaggerItem><GradientStatCard title="Submitted" value={stats.submitted} icon={Send} gradient="gradient-blue" glow="glow-blue" /></StaggerItem>
        <StaggerItem><GradientStatCard title="In Progress" value={stats.inProgress} icon={Loader2} gradient="gradient-amber" glow="glow-amber" /></StaggerItem>
        <StaggerItem><GradientStatCard title="Completed" value={stats.complete} icon={CheckCircle2} gradient="gradient-emerald" glow="glow-emerald" /></StaggerItem>
        <StaggerItem><GradientStatCard title="Total" value={stats.total} icon={TrendingUp} gradient="gradient-indigo" glow="glow-indigo" /></StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.4}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-sm flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center"><ClipboardList className="w-4 h-4 text-white" /></div>
              <span className="text-white">Recent Requests</span>
            </CardTitle>
            <Link href="/portal/requests" className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs"}>
              View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardHeader>
          <CardContent>
            {recentRequests.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-2xl gradient-indigo flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-medium text-white mb-1">No requests yet</p>
                <p className="text-xs text-muted-foreground mb-4">Submit your first request and we&apos;ll get working on it</p>
                <Link href="/portal/requests/new" className={buttonVariants({ size: "sm" })}>Submit Your First Request</Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentRequests.map((req) => (
                  <Link key={req.id} href={`/portal/requests/${req.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-primary/60">KP-{String(req.request_number).padStart(4, "0")}</span>
                        <span className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">{req.title}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {req.organization?.name && (<><span className="text-xs text-primary/50">{req.organization.name}</span><span className="text-white/10">·</span></>)}
                        <span className="text-xs text-muted-foreground">{formatDate(req.created_at)}</span>
                        {req.assigned_to && (<><span className="text-white/10">·</span><span className="text-xs text-muted-foreground">Assigned to {req.assigned_to}</span></>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={req.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}

function GradientStatCard({ title, value, icon: Icon, gradient, glow }: { title: string; value: number; icon: React.ElementType; gradient: string; glow: string; }) {
  return (
    <Card className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glow} rounded-2xl`} />
      <CardContent className="pt-5 pb-5 relative z-10">
        <div className="flex items-start justify-between mb-4">
          <p className="text-[13px] text-muted-foreground font-medium">{title}</p>
          <div className={`w-11 h-11 rounded-xl ${gradient} flex items-center justify-center shadow-lg`}><Icon className="w-5 h-5 text-white" /></div>
        </div>
        <p className="text-4xl font-bold text-white tracking-tight">{value}</p>
      </CardContent>
    </Card>
  );
}

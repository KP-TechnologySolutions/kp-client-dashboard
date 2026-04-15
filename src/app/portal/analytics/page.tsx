"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  FadeIn, StaggerContainer, StaggerItem,
} from "@/components/shared/motion";
import {
  Users, Eye, Clock, ArrowUpDown, TrendingUp, Globe, Loader2, BarChart3, Building2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AnalyticsData {
  orgName: string;
  period: number;
  overview: {
    users: number;
    sessions: number;
    pageViews: number;
    avgDuration: number;
    bounceRate: number;
  };
  topPages: { title: string; views: number; users: number }[];
  trafficSources: { source: string; sessions: number; users: number }[];
  daily: { date: string; users: number; sessions: number }[];
}

interface UserOrg {
  organization_id: string;
  name: string;
  ga_property_id: string | null;
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

function formatBounceRate(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

const SOURCE_COLORS: Record<string, string> = {
  "Organic Search": "gradient-emerald",
  "Direct": "gradient-indigo",
  "Organic Social": "gradient-pink",
  "Referral": "gradient-amber",
  "Paid Search": "gradient-blue",
  "Email": "gradient-purple",
};

export default function AnalyticsPage() {
  const [orgs, setOrgs] = useState<UserOrg[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [period, setPeriod] = useState("28");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load user's orgs
  useEffect(() => {
    async function loadOrgs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: orgLinks } = await supabase
        .from("user_organizations")
        .select("organization_id, organizations(name, ga_property_id)")
        .eq("user_id", user.id);

      if (orgLinks && orgLinks.length > 0) {
        const userOrgs = orgLinks
          .map((l: any) => ({
            organization_id: l.organization_id,
            name: l.organizations?.name ?? "",
            ga_property_id: l.organizations?.ga_property_id,
          }))
          .filter((o: UserOrg) => o.ga_property_id);
        setOrgs(userOrgs);
        if (userOrgs.length > 0) setSelectedOrgId(userOrgs[0].organization_id);
      } else {
        const { data: profile } = await supabase.from("profiles").select("organization_id").eq("id", user.id).single();
        if (profile?.organization_id) {
          const { data: org } = await supabase.from("organizations").select("name, ga_property_id").eq("id", profile.organization_id).single();
          if (org?.ga_property_id) {
            setOrgs([{ organization_id: profile.organization_id, name: org.name, ga_property_id: org.ga_property_id }]);
            setSelectedOrgId(profile.organization_id);
          }
        }
      }
      setLoading(false);
    }
    loadOrgs();
  }, []);

  // Fetch analytics when org or period changes
  useEffect(() => {
    if (!selectedOrgId) return;
    async function fetchAnalytics() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/analytics?orgId=${selectedOrgId}&period=${period}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setData(json);
      } catch (e: any) {
        setError(e.message);
        setData(null);
      }
      setLoading(false);
    }
    fetchAnalytics();
  }, [selectedOrgId, period]);

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (orgs.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-14 h-14 rounded-2xl gradient-indigo flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
          <BarChart3 className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm font-medium text-white mb-1">Analytics not available</p>
        <p className="text-xs text-muted-foreground">No analytics have been configured for your websites yet.</p>
      </div>
    );
  }

  const maxDailyUsers = data ? Math.max(...data.daily.map((d) => d.users), 1) : 1;

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Website Analytics</h1>
            <p className="text-muted-foreground mt-1">See how your website is performing</p>
          </div>
          <div className="flex items-center gap-3">
            {orgs.length > 1 && (
              <Select value={selectedOrgId} onValueChange={(v) => v && setSelectedOrgId(v)}>
                <SelectTrigger className="w-52 bg-white/5 border-white/10">
                  <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span className="truncate">{orgs.find(o => o.organization_id === selectedOrgId)?.name ?? "Select"}</span>
                </SelectTrigger>
                <SelectContent>
                  {orgs.map((org) => (
                    <SelectItem key={org.organization_id} value={org.organization_id}>{org.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
              <SelectTrigger className="w-40 bg-white/5 border-white/10">
                <span>{period === "7" ? "Last 7 days" : period === "14" ? "Last 14 days" : period === "28" ? "Last 28 days" : "Last 90 days"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="14">Last 14 days</SelectItem>
                <SelectItem value="28">Last 28 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FadeIn>

      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{error}</div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}

      {data && !loading && (
        <>
          {/* Overview Stats */}
          <StaggerContainer className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <StaggerItem>
              <StatCard title="Visitors" value={data.overview.users.toLocaleString()} icon={Users} gradient="gradient-indigo" glow="glow-indigo" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Sessions" value={data.overview.sessions.toLocaleString()} icon={TrendingUp} gradient="gradient-blue" glow="glow-blue" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Page Views" value={data.overview.pageViews.toLocaleString()} icon={Eye} gradient="gradient-emerald" glow="glow-emerald" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Avg. Duration" value={formatDuration(data.overview.avgDuration)} icon={Clock} gradient="gradient-amber" glow="glow-amber" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Bounce Rate" value={formatBounceRate(data.overview.bounceRate)} icon={ArrowUpDown} gradient="gradient-pink" glow="glow-indigo" />
            </StaggerItem>
          </StaggerContainer>

          {/* Visitors Chart */}
          <FadeIn delay={0.3}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">Daily Visitors</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {data.daily.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No daily data available</p>
                ) : (
                  <div>
                    <div className="flex items-end gap-[2px]" style={{ height: 160 }}>
                      {data.daily.map((day, i) => {
                        const pct = Math.max((day.users / maxDailyUsers) * 100, 2);
                        return (
                          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative">
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {day.users}
                            </div>
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-primary to-primary/50 group-hover:from-primary group-hover:to-primary/70 transition-all"
                              style={{ height: `${pct}%` }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-[2px] mt-2">
                      {data.daily.map((day, i) => (
                        <div key={i} className="flex-1 text-center">
                          <span className="text-[8px] text-muted-foreground/40">
                            {i % Math.max(Math.ceil(data.daily.length / 7), 1) === 0 ? day.date : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Top Pages */}
            <FadeIn delay={0.4}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl gradient-emerald flex items-center justify-center">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Top Pages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.topPages.map((page, i) => {
                    const maxViews = data.topPages[0]?.views || 1;
                    return (
                      <div key={i} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-white/80 truncate flex-1 mr-4">{page.title}</span>
                          <span className="text-xs text-muted-foreground shrink-0">{page.views.toLocaleString()} views</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full rounded-full gradient-emerald transition-all duration-500"
                            style={{ width: `${(page.views / maxViews) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {data.topPages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No page data available</p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>

            {/* Traffic Sources */}
            <FadeIn delay={0.5}>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl gradient-blue flex items-center justify-center">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white">Traffic Sources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.trafficSources.map((source, i) => {
                    const totalSessions = data.trafficSources.reduce((sum, s) => sum + s.sessions, 0) || 1;
                    const pct = ((source.sessions / totalSessions) * 100).toFixed(1);
                    const colorClass = SOURCE_COLORS[source.source] || "gradient-indigo";
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${colorClass} shrink-0`} />
                        <span className="text-xs text-white/80 flex-1">{source.source}</span>
                        <span className="text-xs text-muted-foreground">{source.sessions.toLocaleString()}</span>
                        <span className="text-xs text-primary font-medium w-12 text-right">{pct}%</span>
                      </div>
                    );
                  })}
                  {data.trafficSources.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No source data available</p>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, gradient, glow }: {
  title: string; value: string; icon: React.ElementType; gradient: string; glow: string;
}) {
  return (
    <Card className="relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${glow} rounded-2xl`} />
      <CardContent className="pt-4 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${gradient} flex items-center justify-center shadow-lg shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">{title}</p>
            <p className="text-xl font-bold text-white">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

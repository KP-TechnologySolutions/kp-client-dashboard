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
  Users, Eye, Clock, ArrowUpDown, TrendingUp, Globe, Loader2, BarChart3, Building2, ChevronRight, X,
} from "lucide-react";

interface OrgOverview {
  orgId: string;
  orgName: string;
  slug: string;
  users: number;
  sessions: number;
  pageViews: number;
  avgDuration: number;
  bounceRate: number;
  error: string | null;
}

interface AllAnalyticsResponse {
  period: number;
  orgs: OrgOverview[];
}

interface DetailedAnalytics {
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

const SOURCE_COLORS: Record<string, string> = {
  "Organic Search": "gradient-emerald",
  "Direct": "gradient-indigo",
  "Organic Social": "gradient-pink",
  "Referral": "gradient-amber",
  "Paid Search": "gradient-blue",
  "Email": "gradient-purple",
};

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}m ${secs}s`;
}

function formatBounceRate(rate: number) {
  return `${(rate * 100).toFixed(1)}%`;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState("28");
  const [overview, setOverview] = useState<AllAnalyticsResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");

  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [detail, setDetail] = useState<DetailedAnalytics | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    async function load() {
      setOverviewLoading(true);
      setOverviewError("");
      try {
        const res = await fetch(`/api/analytics/all?period=${period}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setOverview(json);
      } catch (e: any) {
        setOverviewError(e.message);
        setOverview(null);
      }
      setOverviewLoading(false);
    }
    load();
  }, [period]);

  useEffect(() => {
    if (!selectedOrgId) {
      setDetail(null);
      return;
    }
    async function loadDetail() {
      setDetailLoading(true);
      setDetailError("");
      try {
        const res = await fetch(`/api/analytics?orgId=${selectedOrgId}&period=${period}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        setDetail(json);
      } catch (e: any) {
        setDetailError(e.message);
        setDetail(null);
      }
      setDetailLoading(false);
    }
    loadDetail();
  }, [selectedOrgId, period]);

  const totals = overview?.orgs.reduce(
    (acc, o) => ({
      users: acc.users + o.users,
      sessions: acc.sessions + o.sessions,
      pageViews: acc.pageViews + o.pageViews,
    }),
    { users: 0, sessions: 0, pageViews: 0 },
  ) ?? { users: 0, sessions: 0, pageViews: 0 };

  const maxOrgUsers = Math.max(...(overview?.orgs.map(o => o.users) ?? [0]), 1);

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Analytics</h1>
            <p className="text-muted-foreground mt-1">Traffic across all client websites</p>
          </div>
          <Select value={period} onValueChange={(v) => v && setPeriod(v)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="28">Last 28 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FadeIn>

      {overviewError && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{overviewError}</div>
      )}

      {overviewLoading && !overview ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : overview && overview.orgs.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 rounded-2xl gradient-indigo flex items-center justify-center mx-auto mb-3 shadow-lg shadow-primary/20">
            <BarChart3 className="w-7 h-7 text-white" />
          </div>
          <p className="text-sm font-medium text-white mb-1">No analytics configured</p>
          <p className="text-xs text-muted-foreground">No organizations have a GA4 property ID set yet.</p>
        </div>
      ) : overview && (
        <>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StaggerItem>
              <StatCard title="Total Visitors" value={totals.users.toLocaleString()} icon={Users} gradient="gradient-indigo" glow="glow-indigo" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Total Sessions" value={totals.sessions.toLocaleString()} icon={TrendingUp} gradient="gradient-blue" glow="glow-blue" />
            </StaggerItem>
            <StaggerItem>
              <StatCard title="Total Page Views" value={totals.pageViews.toLocaleString()} icon={Eye} gradient="gradient-emerald" glow="glow-emerald" />
            </StaggerItem>
          </StaggerContainer>

          <FadeIn delay={0.2}>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white">By Client</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {overview.orgs.map((org) => {
                    const isSelected = selectedOrgId === org.orgId;
                    const pct = (org.users / maxOrgUsers) * 100;
                    return (
                      <button
                        key={org.orgId}
                        onClick={() => setSelectedOrgId(isSelected ? null : org.orgId)}
                        className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-primary/10 border-primary/40 shadow-md shadow-primary/10"
                            : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-white truncate">{org.orgName}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? "rotate-90 text-primary" : "text-muted-foreground"}`} />
                        </div>
                        {org.error ? (
                          <p className="text-xs text-red-400">{org.error}</p>
                        ) : (
                          <>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              <div>
                                <p className="text-[10px] text-muted-foreground">Visitors</p>
                                <p className="text-sm font-bold text-white">{org.users.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">Sessions</p>
                                <p className="text-sm font-bold text-white">{org.sessions.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground">Views</p>
                                <p className="text-sm font-bold text-white">{org.pageViews.toLocaleString()}</p>
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <div
                                className="h-full rounded-full gradient-indigo transition-all duration-500"
                                style={{ width: `${Math.max(pct, 2)}%` }}
                              />
                            </div>
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>

          {selectedOrgId && (
            <FadeIn>
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl gradient-indigo flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-white" />
                    </div>
                    <h2 className="text-lg font-semibold text-white">
                      {detail?.orgName ?? overview.orgs.find(o => o.orgId === selectedOrgId)?.orgName ?? "Details"}
                    </h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrgId(null)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    aria-label="Close detail view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {detailError && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400">{detailError}</div>
                )}

                {detailLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : detail && (
                  <DetailView data={detail} />
                )}
              </div>
            </FadeIn>
          )}
        </>
      )}
    </div>
  );
}

function DetailView({ data }: { data: DetailedAnalytics }) {
  const maxDailyUsers = Math.max(...data.daily.map((d) => d.users), 1);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard title="Visitors" value={data.overview.users.toLocaleString()} icon={Users} gradient="gradient-indigo" glow="glow-indigo" />
        <StatCard title="Sessions" value={data.overview.sessions.toLocaleString()} icon={TrendingUp} gradient="gradient-blue" glow="glow-blue" />
        <StatCard title="Page Views" value={data.overview.pageViews.toLocaleString()} icon={Eye} gradient="gradient-emerald" glow="glow-emerald" />
        <StatCard title="Avg. Duration" value={formatDuration(data.overview.avgDuration)} icon={Clock} gradient="gradient-amber" glow="glow-amber" />
        <StatCard title="Bounce Rate" value={formatBounceRate(data.overview.bounceRate)} icon={ArrowUpDown} gradient="gradient-pink" glow="glow-indigo" />
      </div>

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

      <div className="grid lg:grid-cols-2 gap-5">
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
      </div>
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

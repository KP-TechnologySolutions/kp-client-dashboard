import { NextRequest, NextResponse } from "next/server";
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import { createClient } from "@/lib/supabase/server";

function getAnalyticsClient() {
  const json = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!json) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON not configured");
  const credentials = JSON.parse(json);
  return new BetaAnalyticsDataClient({ credentials });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get("orgId");
  const period = searchParams.get("period") || "28"; // days

  if (!orgId) {
    return NextResponse.json({ error: "orgId required" }, { status: 400 });
  }

  // Verify the user has access to this org
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Get the org's GA property ID
  const { data: org } = await supabase
    .from("organizations")
    .select("ga_property_id, name")
    .eq("id", orgId)
    .single();

  if (!org?.ga_property_id) {
    return NextResponse.json({ error: "No analytics configured for this organization" }, { status: 404 });
  }

  try {
    const startDate = `${period}daysAgo`;
    const propertyId = `properties/${org.ga_property_id}`;
    const analyticsClient = getAnalyticsClient();

    // Run multiple reports in parallel
    const [overviewRes, pagesRes, sourcesRes, dailyRes] = await Promise.all([
      // Overview metrics
      analyticsClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: "today" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
          { name: "screenPageViews" },
          { name: "averageSessionDuration" },
          { name: "bounceRate" },
        ],
      }),
      // Top pages
      analyticsClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "pageTitle" }],
        metrics: [
          { name: "screenPageViews" },
          { name: "activeUsers" },
        ],
        orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
        limit: 8,
      }),
      // Traffic sources
      analyticsClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "sessionDefaultChannelGroup" }],
        metrics: [
          { name: "sessions" },
          { name: "activeUsers" },
        ],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 6,
      }),
      // Daily visitors (for chart)
      analyticsClient.runReport({
        property: propertyId,
        dateRanges: [{ startDate, endDate: "today" }],
        dimensions: [{ name: "date" }],
        metrics: [
          { name: "activeUsers" },
          { name: "sessions" },
        ],
        orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
      }),
    ]);

    // Parse overview
    const overviewRow = overviewRes[0]?.rows?.[0];
    const overview = {
      users: parseInt(overviewRow?.metricValues?.[0]?.value || "0"),
      sessions: parseInt(overviewRow?.metricValues?.[1]?.value || "0"),
      pageViews: parseInt(overviewRow?.metricValues?.[2]?.value || "0"),
      avgDuration: parseFloat(overviewRow?.metricValues?.[3]?.value || "0"),
      bounceRate: parseFloat(overviewRow?.metricValues?.[4]?.value || "0"),
    };

    // Parse top pages
    const topPages = (pagesRes[0]?.rows || []).map((row) => ({
      title: row.dimensionValues?.[0]?.value || "Unknown",
      views: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Parse traffic sources
    const trafficSources = (sourcesRes[0]?.rows || []).map((row) => ({
      source: row.dimensionValues?.[0]?.value || "Unknown",
      sessions: parseInt(row.metricValues?.[0]?.value || "0"),
      users: parseInt(row.metricValues?.[1]?.value || "0"),
    }));

    // Parse daily data
    const daily = (dailyRes[0]?.rows || []).map((row) => {
      const dateStr = row.dimensionValues?.[0]?.value || "";
      return {
        date: `${dateStr.slice(4, 6)}/${dateStr.slice(6, 8)}`,
        users: parseInt(row.metricValues?.[0]?.value || "0"),
        sessions: parseInt(row.metricValues?.[1]?.value || "0"),
      };
    });

    return NextResponse.json({
      orgName: org.name,
      period: parseInt(period),
      overview,
      topPages,
      trafficSources,
      daily,
    });
  } catch (error: any) {
    console.error("GA4 API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

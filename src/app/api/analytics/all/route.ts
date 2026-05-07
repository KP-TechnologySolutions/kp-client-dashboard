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
  const period = searchParams.get("period") || "28";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: orgs, error: orgErr } = await supabase
    .from("organizations")
    .select("id, name, slug, ga_property_id")
    .not("ga_property_id", "is", null)
    .eq("active", true)
    .order("name", { ascending: true });

  if (orgErr) {
    return NextResponse.json({ error: orgErr.message }, { status: 500 });
  }

  if (!orgs || orgs.length === 0) {
    return NextResponse.json({ period: parseInt(period), orgs: [] });
  }

  const startDate = `${period}daysAgo`;
  const analyticsClient = getAnalyticsClient();

  const results = await Promise.all(
    orgs.map(async (org) => {
      try {
        const [res] = await analyticsClient.runReport({
          property: `properties/${org.ga_property_id}`,
          dateRanges: [{ startDate, endDate: "today" }],
          metrics: [
            { name: "activeUsers" },
            { name: "sessions" },
            { name: "screenPageViews" },
            { name: "averageSessionDuration" },
            { name: "bounceRate" },
          ],
        });
        const row = res.rows?.[0];
        return {
          orgId: org.id,
          orgName: org.name,
          slug: org.slug,
          users: parseInt(row?.metricValues?.[0]?.value || "0"),
          sessions: parseInt(row?.metricValues?.[1]?.value || "0"),
          pageViews: parseInt(row?.metricValues?.[2]?.value || "0"),
          avgDuration: parseFloat(row?.metricValues?.[3]?.value || "0"),
          bounceRate: parseFloat(row?.metricValues?.[4]?.value || "0"),
          error: null as string | null,
        };
      } catch (e: any) {
        return {
          orgId: org.id,
          orgName: org.name,
          slug: org.slug,
          users: 0,
          sessions: 0,
          pageViews: 0,
          avgDuration: 0,
          bounceRate: 0,
          error: e.message || "Failed to fetch",
        };
      }
    }),
  );

  return NextResponse.json({ period: parseInt(period), orgs: results });
}

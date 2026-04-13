import { createClient } from "./supabase/server";

// ── Organizations ──
export async function getOrganizations() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("active", true)
    .order("name");
  return data ?? [];
}

export async function getOrganizationBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();
  return data;
}

export async function getOrganizationById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

// ── Requests ──
export async function getAllRequests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("requests")
    .select(`
      *,
      organization:organizations(id, name, slug),
      submitter:profiles!submitted_by(id, full_name, email, role)
    `)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getRequestsForOrg(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("requests")
    .select(`
      *,
      organization:organizations(id, name, slug),
      submitter:profiles!submitted_by(id, full_name, email, role)
    `)
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getRequestById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("requests")
    .select(`
      *,
      organization:organizations(*),
      submitter:profiles!submitted_by(*)
    `)
    .eq("id", id)
    .single();
  return data;
}

export async function getRequestComments(requestId: string, includeInternal: boolean) {
  const supabase = await createClient();
  let query = supabase
    .from("request_comments")
    .select(`
      *,
      author:profiles!author_id(id, full_name, email, role)
    `)
    .eq("request_id", requestId)
    .order("created_at");

  if (!includeInternal) {
    query = query.eq("is_internal", false);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getRequestActivity(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_log")
    .select(`
      *,
      actor:profiles!actor_id(id, full_name)
    `)
    .eq("request_id", requestId)
    .order("created_at");
  return data ?? [];
}

export async function getRequestAttachments(requestId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("request_attachments")
    .select("*")
    .eq("request_id", requestId)
    .order("created_at");
  return data ?? [];
}

// ── Stats ──
export async function getAdminStats() {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("requests")
    .select("status, assigned_to, completed_at, created_at, priority");

  if (!requests) return { unassigned: 0, inProgress: 0, completedThisWeek: 0, totalActive: 0 };

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    unassigned: requests.filter(
      (r) => !r.assigned_to && r.status !== "complete" && r.status !== "rejected"
    ).length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    completedThisWeek: requests.filter(
      (r) => r.status === "complete" && r.completed_at && new Date(r.completed_at) >= weekAgo
    ).length,
    totalActive: requests.filter(
      (r) => r.status !== "complete" && r.status !== "rejected"
    ).length,
  };
}

export async function getPortalStats(orgId: string) {
  const supabase = await createClient();
  const { data: requests } = await supabase
    .from("requests")
    .select("status")
    .eq("organization_id", orgId);

  if (!requests) return { submitted: 0, inProgress: 0, complete: 0, total: 0 };

  return {
    submitted: requests.filter((r) => r.status === "submitted").length,
    inProgress: requests.filter(
      (r) => r.status === "in_progress" || r.status === "reviewed"
    ).length,
    complete: requests.filter((r) => r.status === "complete").length,
    total: requests.length,
  };
}

// ── Profiles ──
export async function getOrgMembers(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("organization_id", orgId);
  return data ?? [];
}

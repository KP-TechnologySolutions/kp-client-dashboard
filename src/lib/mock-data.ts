import type {
  Organization,
  Profile,
  Request,
  RequestComment,
  ActivityLog,
  RequestWithDetails,
} from "./types";

// ── Organizations ──────────────────────────────────────────────────
export const organizations: Organization[] = [
  {
    id: "org-56kitchen",
    name: "56 Kitchen",
    slug: "56-kitchen",
    website_url: "https://56kitchen.com",
    primary_contact_name: "Mike Chen",
    primary_contact_email: "mike@56kitchen.com",
    primary_contact_phone: "(843) 555-0101",
    notes: "Restaurant. Menu changes are frequent — usually weekly specials.",
    active: true,
    created_at: "2025-06-15T10:00:00Z",
  },
  {
    id: "org-elle",
    name: "Elle",
    slug: "elle",
    website_url: "https://ellesalon.com",
    primary_contact_name: "Sarah Williams",
    primary_contact_email: "sarah@ellesalon.com",
    primary_contact_phone: "(843) 555-0202",
    notes: "Salon. Seasonal promotions and service list updates.",
    active: true,
    created_at: "2025-07-01T10:00:00Z",
  },
  {
    id: "org-56social",
    name: "56 Social",
    slug: "56-social",
    website_url: "https://56social.com",
    primary_contact_name: "James Park",
    primary_contact_email: "james@56social.com",
    primary_contact_phone: "(843) 555-0303",
    notes: "Bar/lounge. Event schedule and drink menu updates.",
    active: true,
    created_at: "2025-08-10T10:00:00Z",
  },
  {
    id: "org-lowcountry",
    name: "Lowcountry Septic",
    slug: "lowcountry-septic",
    website_url: "https://lowcountryseptic.com",
    primary_contact_name: "Tom Bradley",
    primary_contact_email: "tom@lowcountryseptic.com",
    primary_contact_phone: "(843) 555-0404",
    notes: "Service company. Mainly content and SEO updates.",
    active: true,
    created_at: "2025-09-01T10:00:00Z",
  },
];

// ── Profiles ───────────────────────────────────────────────────────
export const profiles: Profile[] = [
  {
    id: "admin-kp",
    role: "admin",
    organization_id: null,
    full_name: "KP Admin",
    email: "admin@kptechnology.com",
    avatar_url: null,
    created_at: "2025-01-01T10:00:00Z",
  },
  // Team members (for assignment display, not separate logins)
  {
    id: "admin-hal",
    role: "admin",
    organization_id: null,
    full_name: "Hal",
    email: "hal@kptechnology.com",
    avatar_url: null,
    created_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "admin-shawn",
    role: "admin",
    organization_id: null,
    full_name: "Shawn",
    email: "shawn@kptechnology.com",
    avatar_url: null,
    created_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "client-mike",
    role: "client",
    organization_id: "org-56kitchen",
    full_name: "Mike Chen",
    email: "mike@56kitchen.com",
    avatar_url: null,
    created_at: "2025-06-15T10:00:00Z",
  },
  {
    id: "client-sarah",
    role: "client",
    organization_id: "org-elle",
    full_name: "Sarah Williams",
    email: "sarah@ellesalon.com",
    avatar_url: null,
    created_at: "2025-07-01T10:00:00Z",
  },
  {
    id: "client-james",
    role: "client",
    organization_id: "org-56social",
    full_name: "James Park",
    email: "james@56social.com",
    avatar_url: null,
    created_at: "2025-08-10T10:00:00Z",
  },
  {
    id: "client-tom",
    role: "client",
    organization_id: "org-lowcountry",
    full_name: "Tom Bradley",
    email: "tom@lowcountryseptic.com",
    avatar_url: null,
    created_at: "2025-09-01T10:00:00Z",
  },
];

// ── Requests ───────────────────────────────────────────────────────
export const requests: Request[] = [
  {
    id: "req-001",
    request_number: 1,
    organization_id: "org-56kitchen",
    title: "Update lunch menu prices",
    description:
      "We need to update the lunch menu prices for the spring season. The new prices are attached in the PDF. Please update by Friday.",
    category: "menu_update",
    priority: "high",
    status: "in_progress",
    submitted_by: "client-mike",
    assigned_to: "admin-hal",
    due_date: "2026-04-18",
    completed_at: null,
    completed_by: null,
    estimated_minutes: 30,
    actual_minutes: null,
    internal_notes: "Menu PDF is in their shared drive. Simple price swap.",
    created_at: "2026-04-10T14:30:00Z",
    updated_at: "2026-04-11T09:15:00Z",
  },
  {
    id: "req-002",
    request_number: 2,
    organization_id: "org-56kitchen",
    title: "Add online reservation button",
    description:
      "We signed up with OpenTable and need a reservation button added to the homepage and contact page. Here is the embed code they gave us.",
    category: "feature_request",
    priority: "normal",
    status: "submitted",
    submitted_by: "client-mike",
    assigned_to: null,
    due_date: null,
    completed_at: null,
    completed_by: null,
    estimated_minutes: null,
    actual_minutes: null,
    internal_notes: null,
    created_at: "2026-04-12T10:00:00Z",
    updated_at: "2026-04-12T10:00:00Z",
  },
  {
    id: "req-003",
    request_number: 3,
    organization_id: "org-elle",
    title: "Update service pricing page",
    description:
      "We've added three new services: balayage, keratin treatment, and scalp facial. Please add them to the services page with the attached descriptions and pricing.",
    category: "content_change",
    priority: "normal",
    status: "reviewed",
    submitted_by: "client-sarah",
    assigned_to: "admin-shawn",
    due_date: "2026-04-20",
    completed_at: null,
    completed_by: null,
    estimated_minutes: 45,
    actual_minutes: null,
    internal_notes: "Sarah will send photos for each service by Wednesday.",
    created_at: "2026-04-08T16:00:00Z",
    updated_at: "2026-04-09T11:00:00Z",
  },
  {
    id: "req-004",
    request_number: 4,
    organization_id: "org-elle",
    title: "Fix mobile navigation overlap",
    description:
      "On iPhone, the hamburger menu overlaps the logo when you scroll down. Can you fix this? Attached a screenshot.",
    category: "bug_fix",
    priority: "urgent",
    status: "in_progress",
    submitted_by: "client-sarah",
    assigned_to: "admin-hal",
    due_date: "2026-04-14",
    completed_at: null,
    completed_by: null,
    estimated_minutes: 20,
    actual_minutes: null,
    internal_notes: "z-index issue on the sticky header. Quick fix.",
    created_at: "2026-04-11T08:30:00Z",
    updated_at: "2026-04-12T14:00:00Z",
  },
  {
    id: "req-005",
    request_number: 5,
    organization_id: "org-56social",
    title: "Add upcoming events section",
    description:
      "We want to showcase our upcoming DJ nights and themed events on the homepage. Should show event name, date, and a short description. We'll update this weekly.",
    category: "feature_request",
    priority: "normal",
    status: "submitted",
    submitted_by: "client-james",
    assigned_to: null,
    due_date: null,
    completed_at: null,
    completed_by: null,
    estimated_minutes: null,
    actual_minutes: null,
    internal_notes: null,
    created_at: "2026-04-13T09:00:00Z",
    updated_at: "2026-04-13T09:00:00Z",
  },
  {
    id: "req-006",
    request_number: 6,
    organization_id: "org-56social",
    title: "Update drink menu photos",
    description:
      "We have new cocktail photos from our photographer. Please replace the current ones on the menu page. Will send the files via email.",
    category: "menu_update",
    priority: "low",
    status: "submitted",
    submitted_by: "client-james",
    assigned_to: null,
    due_date: null,
    completed_at: null,
    completed_by: null,
    estimated_minutes: null,
    actual_minutes: null,
    internal_notes: null,
    created_at: "2026-04-13T09:30:00Z",
    updated_at: "2026-04-13T09:30:00Z",
  },
  {
    id: "req-007",
    request_number: 7,
    organization_id: "org-56kitchen",
    title: "Update staff photos on About page",
    description:
      "We have new team photos. Please replace the current headshots on the About Us page.",
    category: "content_change",
    priority: "low",
    status: "complete",
    submitted_by: "client-mike",
    assigned_to: "admin-shawn",
    due_date: "2026-04-05",
    completed_at: "2026-04-04T16:00:00Z",
    completed_by: "admin-shawn",
    estimated_minutes: 20,
    actual_minutes: 15,
    internal_notes: null,
    created_at: "2026-04-01T11:00:00Z",
    updated_at: "2026-04-04T16:00:00Z",
  },
  {
    id: "req-008",
    request_number: 8,
    organization_id: "org-lowcountry",
    title: "Add new service area page for Summerville",
    description:
      "We're expanding to Summerville. Need a new service area page similar to the Charleston page but with Summerville-specific content. I'll provide the text.",
    category: "content_change",
    priority: "normal",
    status: "reviewed",
    submitted_by: "client-tom",
    assigned_to: "admin-hal",
    due_date: "2026-04-22",
    completed_at: null,
    completed_by: null,
    estimated_minutes: 60,
    actual_minutes: null,
    internal_notes:
      "Clone the Charleston page and swap content. Tom will send copy by Wednesday.",
    created_at: "2026-04-07T13:00:00Z",
    updated_at: "2026-04-08T10:00:00Z",
  },
  {
    id: "req-009",
    request_number: 9,
    organization_id: "org-elle",
    title: "Add Instagram feed to homepage",
    description:
      "We want to show our latest Instagram posts on the homepage. Our handle is @ellesalon. Something that auto-updates would be ideal.",
    category: "feature_request",
    priority: "low",
    status: "complete",
    submitted_by: "client-sarah",
    assigned_to: "admin-hal",
    due_date: "2026-03-28",
    completed_at: "2026-03-27T14:00:00Z",
    completed_by: "admin-hal",
    estimated_minutes: 90,
    actual_minutes: 75,
    internal_notes: "Used Elfsight widget. Free plan has branding.",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-27T14:00:00Z",
  },
  {
    id: "req-010",
    request_number: 10,
    organization_id: "org-lowcountry",
    title: "Fix contact form not sending emails",
    description:
      "Customers are filling out the contact form but we're not getting the emails. This has been going on for about a week.",
    category: "bug_fix",
    priority: "urgent",
    status: "complete",
    submitted_by: "client-tom",
    assigned_to: "admin-shawn",
    due_date: "2026-04-02",
    completed_at: "2026-04-01T17:00:00Z",
    completed_by: "admin-shawn",
    estimated_minutes: 30,
    actual_minutes: 45,
    internal_notes: "PHP mail() was blocked by host. Switched to SMTP.",
    created_at: "2026-04-01T09:00:00Z",
    updated_at: "2026-04-01T17:00:00Z",
  },
];

// ── Comments ───────────────────────────────────────────────────────
export const comments: RequestComment[] = [
  {
    id: "comment-001",
    request_id: "req-001",
    author_id: "client-mike",
    body: "The new prices are in the attached PDF. Let me know if anything is unclear.",
    is_internal: false,
    created_at: "2026-04-10T14:35:00Z",
  },
  {
    id: "comment-002",
    request_id: "req-001",
    author_id: "admin-hal",
    body: "Got it, Mike. I'll have the prices updated by end of day tomorrow.",
    is_internal: false,
    created_at: "2026-04-11T09:15:00Z",
  },
  {
    id: "comment-003",
    request_id: "req-001",
    author_id: "admin-hal",
    body: "Prices are straightforward — just swapping numbers on 12 items.",
    is_internal: true,
    created_at: "2026-04-11T09:20:00Z",
  },
  {
    id: "comment-004",
    request_id: "req-003",
    author_id: "admin-shawn",
    body: "Hi Sarah, I see the three services. Could you send over the photos before I get started?",
    is_internal: false,
    created_at: "2026-04-09T11:00:00Z",
  },
  {
    id: "comment-005",
    request_id: "req-004",
    author_id: "admin-hal",
    body: "Found the issue — z-index conflict on the sticky header. Fixing now.",
    is_internal: false,
    created_at: "2026-04-12T14:00:00Z",
  },
  {
    id: "comment-006",
    request_id: "req-008",
    author_id: "admin-hal",
    body: "Tom, once you send the copy I can have this done same day. It's basically a clone of the Charleston page.",
    is_internal: false,
    created_at: "2026-04-08T10:00:00Z",
  },
  {
    id: "comment-007",
    request_id: "req-008",
    author_id: "admin-hal",
    body: "Need to make sure the schema markup has the right service area. Check SEO checklist.",
    is_internal: true,
    created_at: "2026-04-08T10:05:00Z",
  },
];

// ── Activity Log ───────────────────────────────────────────────────
export const activityLogs: ActivityLog[] = [
  {
    id: "log-001",
    request_id: "req-001",
    actor_id: "client-mike",
    action: "created",
    old_value: null,
    new_value: null,
    created_at: "2026-04-10T14:30:00Z",
  },
  {
    id: "log-002",
    request_id: "req-001",
    actor_id: "admin-hal",
    action: "status_changed",
    old_value: "submitted",
    new_value: "reviewed",
    created_at: "2026-04-11T09:10:00Z",
  },
  {
    id: "log-003",
    request_id: "req-001",
    actor_id: "admin-hal",
    action: "assigned",
    old_value: null,
    new_value: "Hal Pickus",
    created_at: "2026-04-11T09:12:00Z",
  },
  {
    id: "log-004",
    request_id: "req-001",
    actor_id: "admin-hal",
    action: "status_changed",
    old_value: "reviewed",
    new_value: "in_progress",
    created_at: "2026-04-11T09:15:00Z",
  },
];

// ── Helper functions ───────────────────────────────────────────────
export function getProfile(id: string): Profile | undefined {
  return profiles.find((p) => p.id === id);
}

export function getOrganization(id: string): Organization | undefined {
  return organizations.find((o) => o.id === id);
}

export function getRequestsForOrg(orgId: string): Request[] {
  return requests.filter((r) => r.organization_id === orgId);
}

export function getRequestWithDetails(
  requestId: string,
  viewerRole: "admin" | "client"
): RequestWithDetails | undefined {
  const request = requests.find((r) => r.id === requestId);
  if (!request) return undefined;

  const organization = getOrganization(request.organization_id);
  const submitter = getProfile(request.submitted_by);
  const assignee = request.assigned_to
    ? getProfile(request.assigned_to)
    : null;

  const requestComments = comments
    .filter((c) => c.request_id === requestId)
    .filter((c) => (viewerRole === "admin" ? true : !c.is_internal));

  const activity = activityLogs.filter((a) => a.request_id === requestId);

  if (!organization || !submitter) return undefined;

  return {
    ...request,
    organization,
    submitter,
    assignee: assignee ?? null,
    comments: requestComments,
    activity,
    attachments: [],
  };
}

export function getAdminStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return {
    newToday: requests.filter((r) => new Date(r.created_at) >= today).length,
    unassigned: requests.filter(
      (r) => !r.assigned_to && r.status !== "complete" && r.status !== "rejected"
    ).length,
    inProgress: requests.filter((r) => r.status === "in_progress").length,
    completedThisWeek: requests.filter(
      (r) =>
        r.status === "complete" &&
        r.completed_at &&
        new Date(r.completed_at) >= weekAgo
    ).length,
    totalActive: requests.filter(
      (r) => r.status !== "complete" && r.status !== "rejected"
    ).length,
    totalComplete: requests.filter((r) => r.status === "complete").length,
  };
}

export function getPortalStats(orgId: string) {
  const orgRequests = getRequestsForOrg(orgId);
  return {
    submitted: orgRequests.filter((r) => r.status === "submitted").length,
    inProgress: orgRequests.filter(
      (r) => r.status === "in_progress" || r.status === "reviewed"
    ).length,
    complete: orgRequests.filter((r) => r.status === "complete").length,
    total: orgRequests.length,
  };
}

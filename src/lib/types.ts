export type UserRole = "admin" | "client";

export type RequestStatus =
  | "submitted"
  | "reviewed"
  | "in_progress"
  | "complete"
  | "rejected";

export type RequestCategory =
  | "menu_update"
  | "content_change"
  | "feature_request"
  | "bug_fix"
  | "design_change"
  | "other";

export type RequestPriority = "low" | "normal" | "high" | "urgent";

export type ActivityAction =
  | "created"
  | "status_changed"
  | "assigned"
  | "commented"
  | "priority_changed";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  website_url: string;
  primary_contact_name: string;
  primary_contact_email: string;
  primary_contact_phone: string;
  notes: string;
  active: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  role: UserRole;
  organization_id: string | null;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Request {
  id: string;
  request_number: number;
  organization_id: string;
  title: string;
  description: string;
  category: RequestCategory;
  priority: RequestPriority;
  status: RequestStatus;
  submitted_by: string;
  assigned_to: string | null;
  due_date: string | null;
  completed_at: string | null;
  completed_by: string | null;
  estimated_minutes: number | null;
  actual_minutes: number | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequestAttachment {
  id: string;
  request_id: string;
  storage_path: string;
  file_name: string;
  file_size_kb: number;
  mime_type: string;
  uploaded_by: string;
  created_at: string;
}

export interface RequestComment {
  id: string;
  request_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  request_id: string;
  actor_id: string;
  action: ActivityAction;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
}

// Enriched types with joined data for display
export interface RequestWithDetails extends Request {
  organization: Organization;
  submitter: Profile;
  assignee: Profile | null;
  comments: RequestComment[];
  activity: ActivityLog[];
  attachments: RequestAttachment[];
}

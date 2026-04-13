"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";

export async function createRequest(formData: {
  title: string;
  description: string;
  category: string;
  priority: string;
  organization_id: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("requests")
    .insert({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      organization_id: formData.organization_id,
      submitted_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Log activity
  await supabase.from("activity_log").insert({
    request_id: data.id,
    actor_id: user.id,
    action: "created",
  });

  revalidatePath("/portal");
  revalidatePath("/portal/requests");
  revalidatePath("/admin");
  revalidatePath("/admin/requests");

  return data;
}

export async function updateRequestStatus(
  requestId: string,
  newStatus: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Get current status
  const { data: current } = await supabase
    .from("requests")
    .select("status")
    .eq("id", requestId)
    .single();

  const updateData: Record<string, unknown> = { status: newStatus };
  if (newStatus === "complete") {
    updateData.completed_at = new Date().toISOString();
    updateData.completed_by = user.id;
  }

  const { error } = await supabase
    .from("requests")
    .update(updateData)
    .eq("id", requestId);

  if (error) throw new Error(error.message);

  // Log activity
  await supabase.from("activity_log").insert({
    request_id: requestId,
    actor_id: user.id,
    action: "status_changed",
    old_value: current?.status,
    new_value: newStatus,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath("/portal");
  revalidatePath("/portal/requests");
}

export async function assignRequest(requestId: string, assigneeName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("requests")
    .update({ assigned_to: assigneeName === "unassigned" ? null : assigneeName })
    .eq("id", requestId);

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    request_id: requestId,
    actor_id: user.id,
    action: "assigned",
    new_value: assigneeName === "unassigned" ? null : assigneeName,
  });

  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath("/admin/requests");
  revalidatePath("/admin");
}

export async function addComment(
  requestId: string,
  body: string,
  isInternal: boolean = false
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("request_comments").insert({
    request_id: requestId,
    author_id: user.id,
    body,
    is_internal: isInternal,
  });

  if (error) throw new Error(error.message);

  await supabase.from("activity_log").insert({
    request_id: requestId,
    actor_id: user.id,
    action: "commented",
  });

  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/portal/requests/${requestId}`);
}

export async function updateRequestEta(requestId: string, dueDate: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("requests")
    .update({ due_date: dueDate })
    .eq("id", requestId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/requests/${requestId}`);
  revalidatePath(`/portal/requests/${requestId}`);
  revalidatePath("/portal/requests");
}

export async function createOrganization(formData: {
  name: string;
  slug: string;
  website_url?: string;
  primary_contact_name?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  notes?: string;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizations")
    .insert(formData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  revalidatePath("/admin/clients");
  return data;
}

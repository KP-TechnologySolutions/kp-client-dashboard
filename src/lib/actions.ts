"use server";

import { createClient } from "./supabase/server";
import { revalidatePath } from "next/cache";
import {
  sendNewRequestNotification,
  sendStatusChangeNotification,
  sendCommentNotification,
} from "./email";

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

  // Get org name and submitter name for email
  const [{ data: org }, { data: profile }] = await Promise.all([
    supabase.from("organizations").select("name").eq("id", formData.organization_id).single(),
    supabase.from("profiles").select("full_name").eq("id", user.id).single(),
  ]);

  // Email admins
  try {
    await sendNewRequestNotification({
      requestNumber: data.request_number,
      title: formData.title,
      clientName: org?.name ?? "Unknown",
      submittedBy: profile?.full_name ?? user.email ?? "Unknown",
      priority: formData.priority,
      category: formData.category,
    });
  } catch (e) {
    console.error("Failed to send email:", e);
  }

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

  // Get current request with org and submitter info
  const { data: request } = await supabase
    .from("requests")
    .select("*, organization:organizations(name), submitter:profiles!submitted_by(full_name, email)")
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
    old_value: request?.status,
    new_value: newStatus,
  });

  // Email the client who submitted the request
  if (request?.submitter?.email) {
    try {
      await sendStatusChangeNotification({
        requestNumber: request.request_number,
        title: request.title,
        newStatus,
        clientEmail: request.submitter.email,
        clientName: request.submitter.full_name ?? "there",
      });
    } catch (e) {
      console.error("Failed to send email:", e);
    }
  }

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

  // Send comment notification (skip internal comments)
  if (!isInternal) {
    const [{ data: request }, { data: commenter }] = await Promise.all([
      supabase.from("requests").select("*, submitter:profiles!submitted_by(full_name, email)").eq("id", requestId).single(),
      supabase.from("profiles").select("full_name, role").eq("id", user.id).single(),
    ]);

    if (request) {
      try {
        if (commenter?.role === "admin" && request.submitter?.email) {
          // Admin commented → notify client
          await sendCommentNotification({
            requestNumber: request.request_number,
            title: request.title,
            commentBy: commenter.full_name ?? "KP Team",
            commentBody: body,
            recipientEmail: request.submitter.email,
            recipientName: request.submitter.full_name ?? "there",
          });
        } else if (commenter?.role === "client") {
          // Client commented → admins get notified via CC (built into sendCommentNotification)
          await sendCommentNotification({
            requestNumber: request.request_number,
            title: request.title,
            commentBy: commenter.full_name ?? "Client",
            commentBody: body,
            recipientEmail: process.env.ADMIN_EMAIL_1 || "KPTechnologySolutions@gmail.com",
            recipientName: "KP Team",
          });
        }
      } catch (e) {
        console.error("Failed to send comment email:", e);
      }
    }
  }

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

export async function deleteRequest(requestId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  // Check if user is admin or the submitter
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: request } = await supabase
    .from("requests")
    .select("submitted_by")
    .eq("id", requestId)
    .single();

  if (!request) throw new Error("Request not found");
  if (profile?.role !== "admin" && request.submitted_by !== user.id) {
    throw new Error("Not authorized to delete this request");
  }

  const { error } = await supabase
    .from("requests")
    .delete()
    .eq("id", requestId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/requests");
  revalidatePath("/portal");
  revalidatePath("/portal/requests");
}

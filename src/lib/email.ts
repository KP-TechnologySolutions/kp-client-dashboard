import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.GMAIL_USER || "KPTechnologySolutions@gmail.com";
const ADMIN_EMAILS = [
  process.env.ADMIN_EMAIL_1 || "KPTechnologySolutions@gmail.com",
  process.env.ADMIN_EMAIL_2,
].filter(Boolean) as string[];

async function sendEmail({
  to,
  cc,
  subject,
  html,
}: {
  to: string | string[];
  cc?: string[];
  subject: string;
  html: string;
}) {
  try {
    await transporter.sendMail({
      from: `KP Technology Portal <${FROM_EMAIL}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      cc: cc?.join(", "),
      subject,
      html,
    });
  } catch (e) {
    console.error("Failed to send email:", e);
  }
}

export async function sendNewRequestNotification({
  requestNumber,
  title,
  clientName,
  submittedBy,
  priority,
  category,
}: {
  requestNumber: number;
  title: string;
  clientName: string;
  submittedBy: string;
  priority: string;
  category: string;
}) {
  await sendEmail({
    to: ADMIN_EMAILS,
    subject: `[KP-${String(requestNumber).padStart(4, "0")}] New request from ${clientName}: ${title}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">New Request Submitted</h2>
        </div>
        <div style="background: #1a1d2e; padding: 24px; border: 1px solid #2a2f42; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #94a3b8; margin: 0 0 4px;">KP-${String(requestNumber).padStart(4, "0")}</p>
          <h3 style="color: #e2e8f0; margin: 0 0 16px; font-size: 20px;">${title}</h3>
          <table style="width: 100%; color: #94a3b8; font-size: 14px;">
            <tr><td style="padding: 4px 0;">Client</td><td style="color: #e2e8f0; text-align: right;">${clientName}</td></tr>
            <tr><td style="padding: 4px 0;">Submitted by</td><td style="color: #e2e8f0; text-align: right;">${submittedBy}</td></tr>
            <tr><td style="padding: 4px 0;">Priority</td><td style="color: #e2e8f0; text-align: right;">${priority}</td></tr>
            <tr><td style="padding: 4px 0;">Category</td><td style="color: #e2e8f0; text-align: right;">${category.replace("_", " ")}</td></tr>
          </table>
          <div style="margin-top: 20px;">
            <a href="https://portal.kptechnologysolutions.com/admin" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View in Dashboard</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendStatusChangeNotification({
  requestNumber,
  title,
  newStatus,
  clientEmail,
  clientName,
}: {
  requestNumber: number;
  title: string;
  newStatus: string;
  clientEmail: string;
  clientName: string;
}) {
  const statusLabels: Record<string, string> = {
    submitted: "Submitted",
    reviewed: "Reviewed",
    in_progress: "In Progress",
    complete: "Complete",
    rejected: "Rejected",
  };

  const statusLabel = statusLabels[newStatus] || newStatus;
  const isComplete = newStatus === "complete";

  await sendEmail({
    to: clientEmail,
    cc: ADMIN_EMAILS,
    subject: `[KP-${String(requestNumber).padStart(4, "0")}] Your request is now ${statusLabel}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${isComplete ? "#10b981" : "#6366f1"}; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">${isComplete ? "Request Complete!" : "Status Update"}</h2>
        </div>
        <div style="background: #1a1d2e; padding: 24px; border: 1px solid #2a2f42; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #94a3b8; margin: 0 0 4px;">Hi ${clientName},</p>
          <p style="color: #e2e8f0; margin: 8px 0 16px;">Your request <strong>KP-${String(requestNumber).padStart(4, "0")}</strong> has been updated:</p>
          <div style="background: #0f1117; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="color: #e2e8f0; margin: 0 0 8px; font-size: 16px; font-weight: 600;">${title}</p>
            <p style="color: #94a3b8; margin: 0;">Status: <span style="color: ${isComplete ? "#10b981" : "#818cf8"}; font-weight: 600;">${statusLabel}</span></p>
          </div>
          <div style="margin-top: 20px;">
            <a href="https://portal.kptechnologysolutions.com/portal" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Request</a>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendCommentNotification({
  requestNumber,
  title,
  commentBy,
  commentBody,
  recipientEmail,
  recipientName,
}: {
  requestNumber: number;
  title: string;
  commentBy: string;
  commentBody: string;
  recipientEmail: string;
  recipientName: string;
}) {
  await sendEmail({
    to: recipientEmail,
    cc: ADMIN_EMAILS,
    subject: `[KP-${String(requestNumber).padStart(4, "0")}] New comment on: ${title}`,
    html: `
      <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 20px 24px; border-radius: 12px 12px 0 0;">
          <h2 style="color: white; margin: 0; font-size: 18px;">New Comment</h2>
        </div>
        <div style="background: #1a1d2e; padding: 24px; border: 1px solid #2a2f42; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #94a3b8; margin: 0 0 4px;">Hi ${recipientName},</p>
          <p style="color: #e2e8f0; margin: 8px 0 16px;"><strong>${commentBy}</strong> commented on <strong>KP-${String(requestNumber).padStart(4, "0")}</strong>:</p>
          <div style="background: #0f1117; border-radius: 8px; padding: 16px; margin-bottom: 16px; border-left: 3px solid #6366f1;">
            <p style="color: #e2e8f0; margin: 0; white-space: pre-wrap;">${commentBody}</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">Request: ${title}</p>
          <div style="margin-top: 20px;">
            <a href="https://portal.kptechnologysolutions.com/portal" style="display: inline-block; background: #6366f1; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: 600;">View Request</a>
          </div>
        </div>
      </div>
    `,
  });
}

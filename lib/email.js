import { Resend } from "resend";
import nodemailer from "nodemailer";

function getTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465 || !process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
}

async function sendMail({ to, subject, html }) {
  // Option 1: Resend API
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const fromEmail = process.env.EMAIL_FROM || "SYNCD <onboarding@resend.dev>";
      const result = await resend.emails.send({
        from: fromEmail,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      });
      console.log(`[Email] Sent via Resend to ${to}:`, result);
      return { success: true, provider: "resend", result };
    } catch (err) {
      console.error("[Email Error] Failed to send via Resend:", err);
      return { success: false, error: err.message };
    }
  }

  // Option 2: SMTP / Nodemailer (e.g. Gmail App Password)
  const transporter = getTransporter();
  if (transporter) {
    try {
      const fromEmail = process.env.EMAIL_FROM || `"SYNCD" <${process.env.SMTP_USER}>`;
      const result = await transporter.sendMail({
        from: fromEmail,
        to: Array.isArray(to) ? to.join(", ") : to,
        subject,
        html,
      });
      console.log(`[Email] Sent via SMTP to ${to}:`, result.messageId);
      return { success: true, provider: "smtp", result };
    } catch (err) {
      console.error("[Email Error] Failed to send via SMTP:", err);
      return { success: false, error: err.message };
    }
  }

  console.warn(
    `[Email Warning] No email provider configured (RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env). Email to ${to} ("${subject}") was skipped.`
  );
  return { success: false, reason: "No credentials in .env" };
}

/**
 * Send an email when a task/issue is assigned to a user
 */
export async function sendTaskAssignedEmail({
  to,
  recipientName,
  taskTitle,
  projectName,
  priority,
  reporterName,
  taskUrl,
}) {
  if (!to) return { success: false, reason: "No recipient email provided" };

  const subject = `[${projectName}] Task Assigned to You: ${taskTitle}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a111f; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #1a202c; border: 1px solid #2d3748; border-radius: 12px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: #3b82f6; color: white; margin-bottom: 12px; }
          .priority-URGENT { background: #dc2626; }
          .priority-HIGH { background: #ea580c; }
          .priority-MEDIUM { background: #ca8a04; }
          .priority-LOW { background: #16a34a; }
          h1 { color: #f8fafc; font-size: 22px; margin-top: 0; }
          p { color: #cbd5e1; font-size: 15px; line-height: 1.6; }
          .details { background: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .row:last-child { margin-bottom: 0; }
          .label { color: #94a3b8; font-weight: 500; }
          .value { color: #f1f5f9; font-weight: 600; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 16px; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge priority-${priority}">${priority} Priority</div>
          <h1>New Task Assigned to You</h1>
          <p>Hello <strong>${recipientName || "Team Member"}</strong>,</p>
          <p>You have been assigned to a new issue in <strong>${projectName}</strong> by <strong>${reporterName || "an admin"}</strong>.</p>
          
          <div class="details">
            <div class="row">
              <span class="label">Task:</span>
              <span class="value">${taskTitle}</span>
            </div>
            <div class="row">
              <span class="label">Project:</span>
              <span class="value">${projectName}</span>
            </div>
            <div class="row">
              <span class="label">Priority:</span>
              <span class="value">${priority}</span>
            </div>
          </div>

          ${
            taskUrl
              ? `<a href="${taskUrl}" class="btn" target="_blank">View Task in SYNCD</a>`
              : ""
          }

          <div class="footer">
            Sent by <strong>SYNCD</strong> Agile Project Management
          </div>
        </div>
      </body>
    </html>
  `;

  return sendMail({ to, subject, html });
}

/**
 * Send an email to team members when a sprint is started
 */
export async function sendSprintStartedEmail({
  toList,
  sprintName,
  projectName,
  startDate,
  endDate,
  sprintUrl,
}) {
  if (!toList || toList.length === 0) return { success: false, reason: "No recipient emails" };

  const validEmails = toList.filter((email) => Boolean(email));
  if (validEmails.length === 0) return { success: false, reason: "No valid emails" };

  const subject = `[${projectName}] Sprint Started: ${sprintName}`;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a111f; color: #e2e8f0; margin: 0; padding: 24px; }
          .container { max-width: 580px; margin: 0 auto; background: #1a202c; border: 1px solid #2d3748; border-radius: 12px; padding: 32px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; background: #16a34a; color: white; margin-bottom: 12px; }
          h1 { color: #f8fafc; font-size: 22px; margin-top: 0; }
          p { color: #cbd5e1; font-size: 15px; line-height: 1.6; }
          .details { background: #0f172a; border-radius: 8px; padding: 16px; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .row:last-child { margin-bottom: 0; }
          .label { color: #94a3b8; font-weight: 500; }
          .value { color: #f1f5f9; font-weight: 600; }
          .btn { display: inline-block; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 16px; }
          .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #334155; font-size: 12px; color: #64748b; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">Sprint Active</div>
          <h1>🚀 Sprint Started: ${sprintName}</h1>
          <p>The sprint <strong>${sprintName}</strong> in <strong>${projectName}</strong> has officially started!</p>
          
          <div class="details">
            <div class="row">
              <span class="label">Project:</span>
              <span class="value">${projectName}</span>
            </div>
            <div class="row">
              <span class="label">Sprint:</span>
              <span class="value">${sprintName}</span>
            </div>
            <div class="row">
              <span class="label">Duration:</span>
              <span class="value">${startDate ? new Date(startDate).toLocaleDateString() : ""} - ${endDate ? new Date(endDate).toLocaleDateString() : ""}</span>
            </div>
          </div>

          ${
            sprintUrl
              ? `<a href="${sprintUrl}" class="btn" target="_blank">Open Sprint Board</a>`
              : ""
          }

          <div class="footer">
            Sent by <strong>SYNCD</strong> Agile Project Management
          </div>
        </div>
      </body>
    </html>
  `;

  return sendMail({ to: validEmails, subject, html });
}

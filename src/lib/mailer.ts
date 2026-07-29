import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/data/site";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP is not configured — set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.");
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

export type EnquiryPayload = {
  source: string;
  name?: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
};

// Enquiry text comes straight from a public form — escape before it ever
// touches the HTML email body.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderEnquiryHtml(payload: EnquiryPayload, submittedAt: string) {
  const rows: [string, string][] = [
    ...(payload.name ? ([["Name", payload.name]] as [string, string][]) : []),
    ...(payload.company ? ([["Company", payload.company]] as [string, string][]) : []),
    ["Email", payload.email],
    ...(payload.phone ? ([["Phone", payload.phone]] as [string, string][]) : []),
  ];

  const detailRows = rows
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:7px 0;font-size:13px;color:#64748b;width:96px;vertical-align:top;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(label)}</td>
          <td style="padding:7px 0;font-size:14px;color:#0f172a;font-weight:600;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");

  const logoUrl = `${site.url}/images/logo/real_switchgear_white.png`;
  const preview = `New enquiry (${payload.source})${payload.company ? ` — ${payload.company}` : ""}: ${payload.message.slice(0, 90)}`;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>New enquiry</title>
  </head>
  <body style="margin:0;padding:0;background:#f1f5f9;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background-color:#0b6fb8;background:linear-gradient(90deg,#006db1,#03a099);padding:26px 32px;">
                <img src="${logoUrl}" alt="${escapeHtml(site.shortName)}" height="30" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:28px 32px 4px;">
                <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#03a099;font-family:Arial,Helvetica,sans-serif;">New website enquiry</p>
                <h1 style="margin:6px 0 0;font-size:21px;line-height:1.3;color:#0f172a;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(payload.source)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 32px 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #e2e8f0;margin-top:10px;padding-top:4px;">
                  ${detailRows}
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px 0;">
                <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:.06em;font-family:Arial,Helvetica,sans-serif;">Message</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;font-size:14px;line-height:1.6;color:#1e293b;font-family:Arial,Helvetica,sans-serif;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 32px 26px;">
                <a href="mailto:${encodeURIComponent(payload.email)}" style="display:inline-block;background-color:#0b6fb8;background:linear-gradient(90deg,#006db1,#03a099);color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 24px;border-radius:999px;font-family:Arial,Helvetica,sans-serif;">Reply to ${escapeHtml(payload.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 32px 22px;border-top:1px solid #e2e8f0;">
                <p style="margin:0;font-size:12px;color:#94a3b8;font-family:Arial,Helvetica,sans-serif;">Sent automatically from the enquiry form on ${escapeHtml(site.url.replace(/^https?:\/\//, ""))} &middot; ${escapeHtml(submittedAt)}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendEnquiryEmail(payload: EnquiryPayload) {
  const to = process.env.ENQUIRY_TO_EMAIL || process.env.SMTP_USER!;

  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  const lines = [
    payload.name ? `Name: ${payload.name}` : null,
    payload.company ? `Company: ${payload.company}` : null,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    "",
    payload.message,
    "",
    `Sent automatically from the enquiry form on ${site.url.replace(/^https?:\/\//, "")} · ${submittedAt}`,
  ].filter((line): line is string => line !== null);

  await getTransporter().sendMail({
    from: `"Real Switchgears Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: payload.email,
    subject: `New enquiry (${payload.source})${payload.company ? ` — ${payload.company}` : ""}`,
    text: lines.join("\n"),
    html: renderEnquiryHtml(payload, submittedAt),
  });
}

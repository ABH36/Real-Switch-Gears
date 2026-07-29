import nodemailer, { type Transporter } from "nodemailer";

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

export async function sendEnquiryEmail(payload: EnquiryPayload) {
  const to = process.env.ENQUIRY_TO_EMAIL || process.env.SMTP_USER!;

  const lines = [
    payload.name ? `Name: ${payload.name}` : null,
    payload.company ? `Company: ${payload.company}` : null,
    `Email: ${payload.email}`,
    payload.phone ? `Phone: ${payload.phone}` : null,
    "",
    payload.message,
  ].filter((line): line is string => line !== null);

  await getTransporter().sendMail({
    from: `"Real Switchgears Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: payload.email,
    subject: `New enquiry (${payload.source})${payload.company ? ` — ${payload.company}` : ""}`,
    text: lines.join("\n"),
  });
}

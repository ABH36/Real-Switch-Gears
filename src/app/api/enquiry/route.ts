import { NextResponse } from "next/server";
import { sendEnquiryEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { source, name, company, email, phone, message } = body as Record<string, string | undefined>;

  if (!source || !email || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    await sendEnquiryEmail({ source, name, company, email, phone, message });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Enquiry email failed:", err);
    return NextResponse.json({ error: "Could not send your enquiry. Please try again." }, { status: 502 });
  }
}

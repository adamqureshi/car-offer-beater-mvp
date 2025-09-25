import { Resend } from "resend";

export const runtime = "nodejs"; // Use Node runtime for email SDKs

function isNonEmpty(x: any): boolean {
  return x !== undefined && x !== null && String(x).trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Normalize snake_case to camelCase for safety
    const normalized = {
      ...body,
      titleStatus: body.titleStatus ?? body.title_status,
    };

    const required = [
      "name","email","phone","zip",
      "vin","mileage","year","make","model",
      "titleStatus","offerSource","offerAmount","offerExpires"
    ];
    for (const k of required) {
      if (!isNonEmpty((normalized as any)[k])) {
        return new Response(JSON.stringify({ error: `Missing required field: ${k}` }), { status: 400 });
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.EMAIL_TO;
    if (!resendKey || !to) {
      return new Response(JSON.stringify({ error: "Server not configured (RESEND_API_KEY/EMAIL_TO)." }), { status: 500 });
    }

    const resend = new Resend(resendKey);

    const subject = `OfferBeater: ${normalized.year} ${normalized.make} ${normalized.model} — ${normalized.vin}`;

    const lines = [
      `Name: ${normalized.name}`,
      `Email: ${normalized.email}`,
      `Phone: ${normalized.phone}`,
      `ZIP: ${normalized.zip}`,
      `Vehicle: ${normalized.year} ${normalized.make} ${normalized.model}`,
      `Mileage: ${normalized.mileage}`,
      `VIN: ${normalized.vin}`,
      `Title Status: ${normalized.titleStatus}`,
      `Payoff: ${normalized.payoff || "-"}`,
      `Payoff Bank: ${normalized.payoffBank || "-"}`,
      `Offer Source: ${normalized.offerSource}`,
      `Offer Amount: ${normalized.offerAmount}`,
      `Offer Expires: ${normalized.offerExpires}`,
      `CARFAX Consent: ${normalized.carfaxConsent ? "Yes" : "No"}`,
      `Damage Notes: ${normalized.damageNotes || "-"}`,
    ].join("\n");

    const attachments: any[] = [];
    if (Array.isArray(normalized.offerAttachments)) {
      for (const a of normalized.offerAttachments.slice(0, 4)) {
        attachments.push({ filename: `offer-${a.filename}`, content: a.base64, contentType: a.contentType });
      }
    }
    if (Array.isArray(normalized.photoAttachments)) {
      for (const a of normalized.photoAttachments.slice(0, 6)) {
        attachments.push({ filename: `photo-${a.filename}`, content: a.base64, contentType: a.contentType });
      }
    }

    await resend.emails.send({
      from: "OfferBeater <noreply@offerbeater.app>",
      to: [to],
      subject,
      text: lines,
      attachments,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), { status: 500 });
  }
}


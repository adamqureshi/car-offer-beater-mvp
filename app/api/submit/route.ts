import { Resend } from "@resend/node";

export const runtime = "edge";

function isNonEmpty(x: any): boolean {
  return x !== undefined && x !== null && String(x).trim().length > 0;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const required = ["name","email","phone","zip","vin","mileage","year","make","model","titleStatus","offerSource","offerAmount","offerExpires"];
    for (const k of required) {
      if (!isNonEmpty(body[k])) {
        return new Response(JSON.stringify({ error: `Missing required field: ${k}` }), { status: 400 });
      }
    }

    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.EMAIL_TO;
    if (!resendKey || !to) {
      return new Response(JSON.stringify({ error: "Server not configured (RESEND_API_KEY/EMAIL_TO)." }), { status: 500 });
    }

    const resend = new Resend(resendKey);

    const subject = `OfferBeater: ${body.year} ${body.make} ${body.model} — ${body.vin}`;

    const lines = [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone}`,
      `ZIP: ${body.zip}`,
      `Vehicle: ${body.year} ${body.make} ${body.model}`,
      `Mileage: ${body.mileage}`,
      `VIN: ${body.vin}`,
      `Title Status: ${body.titleStatus}`,
      `Payoff: ${body.payoff || "-"}`,
      `Payoff Bank: ${body.payoffBank || "-"}`,
      `Offer Source: ${body.offerSource}`,
      `Offer Amount: ${body.offerAmount}`,
      `Offer Expires: ${body.offerExpires}`,
      `CARFAX Consent: ${body.carfaxConsent ? "Yes" : "No"}`,
      `Damage Notes: ${body.damageNotes || "-"}`,
    ].join("\n");

    // Prepare attachments if present
    const attach = [];
    if (Array.isArray(body.offerAttachments)) {
      for (const a of body.offerAttachments.slice(0, 4)) {
        attach.push({ filename: `offer-${a.filename}`, content: a.base64, path: undefined, contentType: a.contentType });
      }
    }
    if (Array.isArray(body.photoAttachments)) {
      for (const a of body.photoAttachments.slice(0, 6)) {
        attach.push({ filename: `photo-${a.filename}`, content: a.base64, path: undefined, contentType: a.contentType });
      }
    }

    await resend.emails.send({
      from: "OfferBeater <noreply@offerbeater.app>",
      to: [to],
      subject,
      text: lines,
      attachments: attach as any,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), { status: 500 });
  }
}

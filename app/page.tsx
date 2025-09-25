"use client";

import { useState } from "react";
import Logo from "@/components/Logo";

type Attachment = { filename: string; base64: string; contentType: string };

export default function Home() {
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSuccess(null);
    setError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Collect files into base64 attachments
    async function fileToAttachment(file: File): Promise<Attachment> {
      const arrayBuf = await file.arrayBuffer();
      const base64 = Buffer.from(arrayBuf).toString("base64");
      return { filename: file.name, base64, contentType: file.type || "application/octet-stream" };
    }

    const offerFiles = fd.getAll("offer_files") as File[];
    const photoFiles = fd.getAll("photos") as File[];

    const offerAttachments: Attachment[] = [];
    for (const f of offerFiles) {
      if (f && f.size > 0) offerAttachments.push(await fileToAttachment(f));
    }

    const photoAttachments: Attachment[] = [];
    for (const f of photoFiles) {
      if (f && f.size > 0) photoAttachments.push(await fileToAttachment(f));
    }

    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      zip: fd.get("zip"),
      vin: fd.get("vin"),
      mileage: fd.get("mileage"),
      year: fd.get("year"),
      make: fd.get("make"),
      model: fd.get("model"),
      titleStatus: fd.get("title_status"),
      payoff: fd.get("payoff"),
      payoffBank: fd.get("payoff_bank"),
      offerSource: fd.get("offer_source"),
      offerAmount: fd.get("offer_amount"),
      offerExpires: fd.get("offer_expires"),
      damageNotes: fd.get("damage_notes"),
      carfaxConsent: fd.get("carfax_consent") === "on",
      offerAttachments,
      photoAttachments,
    };

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data?.error || "Something went wrong.");
    } else {
      setSuccess("Thanks! We received your offer and will text you shortly.");
      (e.target as HTMLFormElement).reset();
    }
    setSending(false);
  }

  return (
    <main className="min-h-screen">
      <header className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
        <Logo />
        <a href="#form" className="btn btn-primary text-sm">Beat My Offer</a>
      </header>

      <section className="mx-auto max-w-5xl px-4 pb-8 pt-4">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card">
            <div className="badge mb-3">Seller MVP</div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Upload your <span className="text-emerald-600">CarMax / Carvana</span> offer. We try to beat it.
            </h1>
            <p className="mt-3 text-slate-600">
              Free for sellers. If a dealer in our network buys your car, they pay us a small fee. You get a higher
              number and a smooth transaction.
            </p>
            <ul className="mt-4 space-y-2 text-slate-700 list-disc pl-5">
              <li>Offer must be valid & unexpired.</li>
              <li>We verify VIN, mileage, and condition. No Photoshops.</li>
              <li>Title on hand or loan payoff PDF from your bank.</li>
              <li>We may request a quick FaceTime condition check.</li>
            </ul>
            <div className="mt-6">
              <a href="#form" className="btn btn-primary">Get Started</a>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold">Why not KBB Instant Cash?</h2>
            <p className="mt-2 text-slate-600">
              KBB routes you to dealers who can change their price onsite; they don't cut the check. We only accept
              real purchase offers from major buyers (CarMax, Carvana, etc.) or franchised dealers with a written
              number—so you're comparing real, cashable offers.
            </p>
            <hr className="divider" />
            <h3 className="text-lg font-semibold">How it works</h3>
            <ol className="mt-2 list-decimal pl-5 space-y-2 text-slate-700">
              <li>Upload a valid offer + basic vehicle details.</li>
              <li>We blast it to our vetted dealer network.</li>
              <li>If a dealer beats it, we connect you to close fast.</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="form" className="mx-auto max-w-5xl px-4 pb-16">
        <form onSubmit={onSubmit} className="card space-y-4">
          <h2 className="text-2xl font-bold">Beat My Offer</h2>

          {success && <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800">{success}</div>}
          {error && <div className="rounded-xl bg-rose-50 p-3 text-rose-800">{error}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">Full name*</label>
              <input required name="name" className="input" placeholder="Jane Doe"/>
            </div>
            <div>
              <label className="label">Email*</label>
              <input required type="email" name="email" className="input" placeholder="you@email.com"/>
            </div>
            <div>
              <label className="label">Mobile number (SMS)*</label>
              <input required name="phone" className="input" placeholder="555-555-5555"/>
            </div>
            <div>
              <label className="label">ZIP code*</label>
              <input required name="zip" className="input" placeholder="11713"/>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="label">Year*</label>
              <input required name="year" className="input" placeholder="2019"/>
            </div>
            <div>
              <label className="label">Make*</label>
              <input required name="make" className="input" placeholder="Tesla"/>
            </div>
            <div>
              <label className="label">Model*</label>
              <input required name="model" className="input" placeholder="Model 3"/>
            </div>
            <div>
              <label className="label">Mileage*</label>
              <input required name="mileage" className="input" placeholder="92238"/>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">VIN*</label>
              <input required name="vin" className="input" placeholder="17 characters"/>
            </div>
            <div>
              <label className="label">Title status*</label>
              <select required name="title_status" className="input">
                <option value="">Select</option>
                <option value="title_in_hand">Title in hand</option>
                <option value="loan_payoff">Loan / lien payoff</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="label">If loan: payoff amount (USD)</label>
              <input name="payoff" className="input" placeholder="e.g., 21,430.55"/>
            </div>
            <div>
              <label className="label">If loan: bank / lender</label>
              <input name="payoff_bank" className="input" placeholder="e.g., US Bank"/>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="label">Offer source*</label>
              <select required name="offer_source" className="input">
                <option value="">Choose</option>
                <option>CarMax</option>
                <option>Carvana</option>
                <option>Shift</option>
                <option>Franchised Dealer</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label">Offer amount (USD)*</label>
              <input required name="offer_amount" className="input" placeholder="15200"/>
            </div>
            <div>
              <label className="label">Offer expiration date*</label>
              <input required type="date" name="offer_expires" className="input"/>
            </div>
          </div>

          <div>
            <label className="label">Upload the offer (PDF or image)*</label>
            <input required name="offer_files" multiple type="file" accept=".pdf,image/*" className="input"/>
            <p className="mt-1 text-xs text-slate-500">Must be unexpired. No edits or Photoshops.</p>
          </div>

          <div>
            <label className="label">Optional: vehicle photos (up to 6)</label>
            <input name="photos" multiple type="file" accept="image/*" className="input"/>
          </div>

          <div>
            <label className="label">Any damage or issues we should know?</label>
            <textarea name="damage_notes" className="input" rows={4} placeholder="Be honest. Tires, dents, scratches, windshield, warning lights, accidents, etc."/>
          </div>

          <div className="flex items-center gap-2">
            <input id="carfax" name="carfax_consent" type="checkbox" className="h-4 w-4"/>
            <label htmlFor="carfax" className="text-sm text-slate-700">
              I consent to you pulling a vehicle history report to verify details.
            </label>
          </div>

          <button disabled={sending} className="btn-primary">
            {sending ? "Submitting..." : "Submit Offer"}
          </button>

          <p className="text-xs text-slate-500">
            By submitting, you agree to our <a href="/terms" className="underline">Terms</a> and <a href="/privacy" className="underline">Privacy</a>.
          </p>
        </form>
      </section>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-slate-500">
        © {new Date().getFullYear()} OfferBeater. A Qureshi Media project. All rights reserved.
      </footer>
    </main>
  );
}

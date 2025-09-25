# OfferBeater — MVP

Upload a valid CarMax/Carvana (or franchised dealer) cash offer and we try to beat it via our dealer network. Free for sellers. Dealers pay a success fee.

## Quick Start

```bash
# 1) Clone & install
pnpm i  # or npm i, or yarn

# 2) Configure environment
cp .env.example .env.local
# Fill RESEND_API_KEY and EMAIL_TO

# 3) Run
pnpm dev  # or npm run dev
```

Deploy on Vercel. This is a Next.js App Router app with Tailwind.

### Environment

- `RESEND_API_KEY` — from https://resend.com/ (or switch to your preferred mailer)
- `EMAIL_TO` — where lead emails are sent

### Notes

- File attachments are base64'd in the browser and sent to the API route, which forwards to Resend as email attachments. Keep uploads small.
- This is a seller-only MVP. Dealer portal, pricing, and verification services can be added next.
- Legal copy is lightweight; replace with your counsel's language before launch.

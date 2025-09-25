import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OfferBeater — Get a Better Cash Offer for Your Car",
  description:
    "Upload a valid CarMax or Carvana offer, and our dealer network will try to beat it. Free to sellers. Fast. No pressure.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// Centralized JSON-LD builders for the marketing site.
//
// The plan prices are ALSO rendered visibly on the homepage (§3) and on
// /pricing (the `tiers` array). Keeping the machine-readable prices here — one
// source, imported by both pages — stops the structured data from drifting away
// from the visible price (the sitemap is auto-enumerated for the same reason).
//
// 2026 note: FAQPage no longer produces a Google rich result (removed
// 2026-05-07), but the markup still helps AI Mode / answer engines parse the
// Q&A and is harmless to keep. SoftwareApplication + Offer are still supported
// and feed price/plan answers. We deliberately DON'T emit aggregateRating — we
// have no real reviews, and inventing them is a penalty risk.

const SITE = "https://ollastack.com";

export interface Plan {
  name: string;
  price: string; // whole USD, no symbol
  submissions: string;
}

export const PLANS: Plan[] = [
  { name: "Free", price: "0", submissions: "100" },
  { name: "Solo", price: "9", submissions: "1,000" },
  { name: "Team", price: "29", submissions: "10,000" },
];

export const softwareApplicationLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Ollastack",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  url: `${SITE}/`,
  description:
    "Agent email API, form backend, and email-testing platform — send and receive email as an AI agent, collect form submissions, and read OTP codes and links in CI.",
  offers: PLANS.map((p) => ({
    "@type": "Offer",
    name: p.name,
    price: p.price,
    priceCurrency: "USD",
    url: `${SITE}/pricing`,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: p.price,
      priceCurrency: "USD",
      unitText: "MONTH",
    },
  })),
};

export interface Faq {
  q: string;
  a: string;
}

export const faqPageLd = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});

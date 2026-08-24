export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
}

export const posts: PostMeta[] = [
  {
    slug: "how-to-build-a-form-backend-for-a-static-site",
    title:
      "How to Build a Form Backend for a Static Site Without Writing a Server",
    description:
      "You don't need Express, a database, or a $5/month droplet just to catch a contact form. Here's exactly how to give a static site a real form backend — spam filtering, notifications, webhooks and all — without writing a line of server code.",
    date: "2026-08-24",
    readingTime: "21 min read",
  },
  {
    slug: "netlify-forms-alternatives",
    title: "Netlify Forms alternatives in 2026: a migration guide",
    description:
      "Netlify Forms moved to credit-based billing. Here's how to move your forms off Netlify without rewriting your site — with the actual code diff for each alternative.",
    date: "2026-05-16",
    readingTime: "10 min read",
  },
  {
    slug: "formspree-vs-netlify-forms",
    title: "Formspree vs Netlify Forms (2026): a fair comparison",
    description:
      "Both handle form submissions for static sites — but on different assumptions. When each one fits, when each one breaks, and what else to consider.",
    date: "2026-05-16",
    readingTime: "8 min read",
  },
  {
    slug: "basin-vs-web3forms",
    title: "Basin vs Web3Forms (2026): which form backend fits you",
    description:
      "Basin invests in dashboard polish, Web3Forms invests in unlimited free submissions. They're optimizing for different users. Here's how to pick — and when neither is the right answer.",
    date: "2026-05-16",
    readingTime: "7 min read",
  },
  {
    slug: "forminit-alternatives",
    title:
      "Forminit alternatives in 2026 (formerly Getform): an honest comparison",
    description:
      "Getform rebranded to Forminit in early 2026. A straight comparison of the form backends worth considering — Formspree, Basin, Formcarry, Web3Forms, Netlify Forms, Formspark, Ollastack — with the tradeoffs each carries.",
    date: "2026-05-16",
    readingTime: "11 min read",
  },
  {
    slug: "can-ai-agents-submit-forms-safely",
    title:
      "Can AI Agents Submit Forms Safely? Here's What Developers Need to Know",
    description:
      "AI agents are filling out and submitting forms on behalf of humans at scale. Here's what \"safe\" actually means for that traffic, where it breaks, and how to build (or choose) a form backend that handles it properly.",
    date: "2026-08-21",
    readingTime: "21 min read",
  },
  {
    slug: "form-backend-for-ai-agents",
    title:
      "Form backend for AI agents: why forms break for LLMs (and what to do)",
    description:
      "AI agents are increasingly submitting forms on behalf of users — and traditional form backends flag every one of them as spam. Here's why, and how to design a backend that treats agents as first-class users.",
    date: "2026-05-16",
    readingTime: "9 min read",
  },
  {
    slug: "html-form-to-email-without-backend",
    title: "Send an HTML form to email without writing a backend",
    description:
      "A practical walkthrough: point an HTML form at an endpoint, get an email when someone submits, skip the server. With the gotchas nobody warns you about.",
    date: "2026-05-15",
    readingTime: "7 min read",
  },
];

export const fmtDate = (iso: string, opts: Intl.DateTimeFormatOptions = {}) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  });

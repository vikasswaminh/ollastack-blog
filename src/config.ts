// ─────────────────────────────────────────────────────────────────────────────
//  PER-PROJECT BRANDING  ·  the ONLY file that changes between blog repos.
//  Owner-locked via CODEOWNERS — the SEO team does not edit this (see CONTRIBUTING.md).
// ─────────────────────────────────────────────────────────────────────────────
export const SITE = {
  brand: 'OllaStack',
  title: 'OllaStack Blog',
  description: 'Guides, tips, and product updates from the OllaStack team.',
  url: 'https://blogs.ollastack.com',
  marketingUrl: 'https://ollastack.com',
  marketingLabel: 'ollastack.com',
  author: 'OllaStack Team',
  accent: '#6366f1',
  tagline: 'Your whole stack, together.',
  locale: 'en',
} as const;

export const NAV = [
  { label: 'Blog', href: '/blog' },
];

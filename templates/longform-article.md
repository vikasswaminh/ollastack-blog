---
# Template: Long-form technical article (>= 4,000 words)
# Copy this frontmatter into a new post and replace placeholders.
---

---
title: "{{TITLE}}"
description: "{{ONE-LINE DESCRIPTION (70-160 chars)}}"
date: {{YYYY-MM-DD}}
tags: [ ]
author: "{{AUTHOR NAME}}"
readingTime: 40
draft: true
canonical: "{{CANONICAL PATH}}"
ogImage: "{{OG_IMAGE_PATH}}"
---

Writing notes
- Target length: 4,000–5,500 words (minimum 4,000). Aim for thorough, code-first content.
- Use concrete code samples for every technical section. Prefer runnable examples (GitHub gist or repo link).
- Include a TL;DR at the top (50–80 words) and a short summary box with recommended actions.
- Where applicable include a small benchmark or time-to-migrate estimate and at least one real-world example or case snippet.
- Add at least 2 internal links: one to `/email-api` (pillar) and 2 lateral sibling posts.
- Add JSON-LD Article schema and FAQ schema (if the post answers common migration/usage questions).
- Provide an assets list (screenshots, diagrams, sample output, OG image) below the content.

Suggested section structure (word allocations)

1) Hero & TL;DR — 150–300 words
   - H1 + 1–2 sentence hook, 2–3 sentence TL;DR summary

2) Introduction / Why this matters — 300–450 words
   - Context, audience, short value prop and what to expect in the article

3) Background & terminology — 300–500 words
   - Define key concepts and abbreviations used in the post (inbound API, mailbox, tenant SMTP, agent mail)

4) Deep technical sections (this is the bulk) — 1,700–2,400 words total split across 3–5 sub-sections
   - Each subsection 400–800 words with runnable code and explanations. Example subsections:
     * API model & payloads (code examples) — 500–800
     * Webhook delivery, retries & idempotency patterns — 400–700
     * Attachments, streaming & storage patterns — 400–700

5) Migration / Implementation walkthrough (hands-on) — 600–1,000 words
   - Step-by-step code-driven migration or setup guide, checklists, copy/paste scripts

6) Testing & CI: deterministic inboxes, Playwright/CI examples — 400–700 words
   - Sample CI YAML, ephemeral inbox creation, test assertions

7) Troubleshooting, pitfalls & operational notes — 300–600 words
   - Common errors, DNS propagation, rate-limit surprises, spam/quarantine interactions

8) Case study / Example outcome (if available) — 250–500 words
   - Real metrics or simulated numbers to show impact

9) Conclusion & next steps — 150–300 words
   - TL;DR recap + recommended next actions

10) FAQ (3–8 Qs) — 300–500 words total
   - Short Q/A entries for common search intents

11) Resources & links — 100–200 words
   - Links to docs, SDKs, relevant posts, sample repos

Minimum assets checklist (deliver with post)
- 1 hero OG image (1200x630)
- 1 architecture diagram (SVG/PNG)
- 1 code sandbox / GitHub gist / minimal repo with runnable examples
- Optional: short demo video (MP4/OGV) or GIF showing workflow

SEO & publishing checklist
- Title tag: include primary keyword near the front, keep < 60 chars where possible
- Meta description: 120–160 characters with CTAs and target keyword
- H1: same as title or an obvious variant
- Use canonical URLs and ensure sitemap entry
- Structured data: Article schema + FAQ schema when applicable
- Add open graph tags and alt text for images

Editorial checklist for technical reviewer
- Verify every code sample compiles/runs locally or in CI
- Check for any leaked secrets or API keys in examples (redact)
- Confirm statements of fact (benchmarks, limits) are accurate

Publishing notes
- Add `readingTime` estimate based on final word count (words/200)
- Update `marketing/content-calendar-12weeks.csv` or equivalent schedule with publish date
- Link the post into the appropriate pillar hub and 2 sibling posts

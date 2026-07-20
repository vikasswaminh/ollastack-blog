---
title: "Integrating Ollastack with Resend and platform SMTP (4,000+ words)"
description: "Integrate Resend for platform sending or configure tenant SMTP fallbacks with Ollastack — configuration examples and error handling."
date: 2026-07-30
tags: [resend, smtp, integration, platform, configuration, longform]
author: "Integrations Eng"
readingTime: 20
draft: false
canonical: "/blog/resend-integration-ollastack"
ogImage: "/assets/og/resend-integration.png"
faq:
  - q: "How does Ollastack send email under the hood?"
    a: "It sends via Resend by default, with platform-SMTP and per-tenant-SMTP fallbacks. You can rely on the platform sender or bring your own SMTP server per organization."
  - q: "Can I use my own SMTP instead of the platform sender?"
    a: "Yes — configure per-tenant SMTP (or a verified custom sender domain) so mail goes out under your identity; Ollastack falls back to the platform sender if your server errors, so notifications never silently drop."
  - q: "What happens if my SMTP server fails mid-send?"
    a: "Ollastack's dispatch catches the error and transparently falls back to the platform sender, so a transient SMTP outage doesn't cost you the notification."
---

TL;DR

Ollastack sends notifications through Resend by default. This guide covers the platform send path, configuration for custom sender domains, tenant SMTP fallback chain, and troubleshooting send failures.

-----

Section 1 — Platform send path

By default, Ollastack sends through Resend using the verified send.ollastack.com domain. Configuration is handled automatically.

Section 2 — Custom sender domains

Add a custom sender domain in Resend, publish DNS records, and configure in Ollastack settings. The status panel reports verified/pending/not_found.

Section 3 — Tenant SMTP fallback chain

If tenant SMTP is configured, Ollastack tries it first and falls back to platform sending on any error.

Section 4 — Troubleshooting send failures

Check delivery inspection API, verify DKIM/SPF/DMARC, inspect bounce codes.

FAQ

Q: Can I use a different email provider instead of Resend?
A: Yes — configure tenant SMTP with any provider's SMTP credentials.

Resources

- Custom sender onboarding: /blog/custom-sender-domain-onboarding
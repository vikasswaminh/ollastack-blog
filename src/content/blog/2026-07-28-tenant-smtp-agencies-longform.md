---
title: "Tenant SMTP for agencies — configuration and use-cases (4,000+ words)"
description: "How agencies can use per-tenant SMTP to preserve sender reputation and reporting per client with Ollastack."
date: 2026-07-28
tags: [smtp, agencies, tenant, deliverability, guide, longform]
author: "Partnerships"
readingTime: 20
draft: false
canonical: "/blog/tenant-smtp-for-agencies"
ogImage: "/assets/og/tenant-smtp-agencies.png"
faq:
  - q: "What is per-tenant SMTP?"
    a: "It lets each client (tenant) send through their own SMTP server and sending identity, so reputation, DKIM alignment, and reporting stay separated per client instead of sharing one pool."
  - q: "Why would an agency use tenant SMTP?"
    a: "So one client's deliverability problems don't affect another's, and each client's mail is sent and reported under their own domain. Ollastack tries the tenant's SMTP first and falls back to the platform sender on error."
  - q: "Does tenant SMTP fall back if the client's server is down?"
    a: "Yes — Ollastack's dispatch tries the tenant SMTP first and falls back to the platform sender on any error, so a misconfigured client server doesn't silently drop notifications."
---

TL;DR

Agencies managing form backends for multiple clients need per-client sender identities to protect reputation. This guide covers tenant SMTP setup, onboarding workflows, per-client billing and quotas, and monitoring deliverability for each tenant.

-----

Section 1 — Why agencies need per-tenant SMTP

When one client's poor sending practices affect your shared sender, every client's deliverability suffers. Per-tenant SMTP isolates each client's reputation.

Section 2 — Onboarding workflow

1. Client provides SMTP credentials or you provision them.
2. Configure per-tenant SMTP in Ollastack settings.
3. Verify DKIM/SPF/DMARC alignment.
4. Send test notification and inspect delivery headers.

Section 3 — Billing and quotas per client

Track usage per tenant using the usage API. Set per-tenant quota limits.

Section 4 — Monitoring per tenant

Dashboard widgets for per-tenant delivery rates, bounce rates, and send volume.

FAQ

Q: Can I mix per-tenant SMTP and platform sending for different clients?
A: Yes — each org can independently choose its sending path.

Resources

- Per-tenant SMTP guide: /blog/per-tenant-smtp-guide
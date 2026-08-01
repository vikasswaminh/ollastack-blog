---
draft: true
title: "Custom sender domain onboarding — DNS, verification and common errors (4,000+ words)"
description: "A step-by-step guide to add and verify custom sender domains with Ollastack, including common DNS pitfalls and Resend-specific verification steps."
date: 2026-07-29
tags: [dns, sender-domain, verification, onboarding, longform]
author: "Email Ops"
readingTime: 22
canonical: "/blog/custom-sender-domain-onboarding"
ogImage: "/assets/og/custom-sender-domain.png"
faq:
  - q: "How do I send from my own domain?"
    a: "Add your domain as a custom sender, publish the SPF, DKIM, and (recommended) DMARC DNS records, and wait for verification. Once verified, notifications and agent mail send from your domain instead of the platform default."
  - q: "Why isn't my custom sender domain verifying?"
    a: "Almost always a DNS issue — a missing or mistyped DKIM/SPF record, a record on the wrong host, or provider caching. Confirm each record resolves publicly and give DNS time to propagate before retrying."
  - q: "Do I need DMARC for a custom sender domain?"
    a: "It's not required to send, but a DMARC record (start at p=none, then tighten) protects your domain from spoofing and improves inbox placement once your legitimate mail aligns on SPF and DKIM."
---

TL;DR

Sending form notifications from your own domain requires DNS configuration, provider verification, and patience for propagation. This guide walks through every step — SPF, DKIM, DMARC records, Resend verification, status checks, and troubleshooting common errors.

-----

Section 1 — DNS records checklist

- SPF: v=spf1 include:_spf.provider.com ~all
- DKIM: selector._domainkey.yourdomain.com CNAME
- DMARC: _dmarc.yourdomain.com TXT p=none; rua=mailto:dmarc@yourdomain.com

Section 2 — Resend verification

Add the records in Resend's dashboard. Wait for DNS propagation (minutes to hours). Use dig to verify.

Section 3 — Status panel

Ollastack's dashboard reports verified/pending/not_found. The panel polls Resend automatically.

Section 4 — Common errors

Two SPF records, DKIM record with typo, DMARC p=reject before alignment verified.

FAQ

Q: How long does DNS propagation take?
A: Minutes to hours depending on TTL.

Resources

- DKIM/SPF/DMARC guide: /blog/dkim-spf-dmarc-custom-sender
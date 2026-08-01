---
draft: true
title: "Debugging email deliverability — bounces, reputation and webhooks (4,000+ words)"
description: "Tools and workflows to diagnose bounces, complaints, and reputation issues for inbound and outbound email with Ollastack."
date: 2026-07-20
tags: [deliverability, debugging, bounces, email-ops, longform]
author: "Email Ops"
readingTime: 22
canonical: "/blog/debug-email-deliverability"
ogImage: "/assets/og/debug-deliverability.png"
faq:
  - q: "Why is my email going to spam or bouncing?"
    a: "The usual causes are missing SPF/DKIM/DMARC alignment, a cold or shared sending domain, or content that trips spam filters. Confirm all three auth records pass first, then inspect bounce webhooks for the specific reason code."
  - q: "How do I see why a message bounced?"
    a: "Consume Ollastack's bounce and complaint webhooks and check the email log — each carries the reason (hard vs soft bounce, complaint) so you can suppress bad addresses and diagnose reputation issues."
  - q: "What is DMARC p=REJECT and do I need it?"
    a: "DMARC tells receivers what to do when SPF and DKIM fail; p=REJECT means discard unauthenticated mail sent as your domain. It's the strongest anti-spoofing stance and, once your legitimate mail aligns, it improves inbox placement."
---

TL;DR

Email deliverability issues are hard to diagnose because failures are often silent. This guide covers bounce code interpretation, complaint feedback loops, reputation monitoring tools, the Ollastack delivery inspection API, and a step-by-step debugging playbook.

-----

Section 1 — Interpreting bounce codes

Soft bounces (temporary): mailbox full, server timeout. Hard bounces (permanent): invalid recipient, domain does not exist. Each bounce type needs a different handling strategy.

Section 2 — Complaint feedback loops

When recipients mark mail as spam, feedback loops report this. Set up FBL handling to automatically suppress repeat complainers.

Section 3 — Reputation monitoring

Track IP/domain reputation using Google Postmaster Tools, Microsoft SNDS, and third-party monitoring. A sudden drop correlates with spam complaints or bad sending practices.

Section 4 — Ollastack's delivery inspection API

```bash
curl -H "Authorization: Bearer $OLLASTACK_KEY" \
  "https://api.ollastack.local/delivery-logs?status=failed&limit=20"
```

Section 5 — Debugging playbook

1. Check bounce code and category.
2. Verify DKIM/SPF/DMARC alignment.
3. Inspect delivery inspection API for the specific message.
4. Check quarantine status in the spam pipeline.

FAQ

Q: How do I know if my emails are being bounced?
A: Check the delivery inspection API — all bounce events are recorded with codes and timestamps.

Resources

- DKIM/SPF/DMARC guide: /blog/dkim-spf-dmarc-custom-sender
- Deliverability hub: /resources/deliverability-hub
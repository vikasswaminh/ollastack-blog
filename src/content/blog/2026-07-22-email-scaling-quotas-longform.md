---
title: "Safe email scaling — quotas, backoff and retry policies explained (4,000+ words)"
description: "Designing send quotas, exponential backoff and robust retry strategies for high-volume form traffic with Ollastack."
date: 2026-07-22
tags: [scaling, quotas, retries, email, best-practices, longform]
author: "SRE"
readingTime: 20
draft: false
canonical: "/blog/email-scaling-quotas-retries"
ogImage: "/assets/og/email-scaling.png"
---

TL;DR

Sending email at scale requires deliberate quota design, backoff strategies, and retry policies. This guide covers Ollastack's send quotas by plan, the per-IP and per-form rate-limit buckets, exponential backoff patterns for webhook consumers, and monitoring for quota exhaustion.

-----

Section 1 — Send quotas by plan

Free: 100 submissions/month. Solo: 2,000. Team: 20,000. Agent submissions count against normal quotas.

Section 2 — Rate-limit buckets (three layers)

- ip_form: per-IP-per-form. The critical abuse defense.
- ip: per-IP global. Prevents single-IP flooding.
- form: per-form global. High DDoS-only backstop.

Section 3 — Exponential backoff for webhooks

Consumer timeout + backoff schedule: 1m/5m/30m/2h/10h (5 attempts).

Section 4 — Monitoring quota exhaustion

Set up alerts when usage reaches 80% of the monthly quota. Use the usage API to programmatically check remaining quota.

FAQ

Q: What happens when I hit the quota limit?
A: Submissions are rejected with a 429 status. The failure is logged in the submission_failures table.

Resources

- Rate limit documentation: /docs/rate-limits
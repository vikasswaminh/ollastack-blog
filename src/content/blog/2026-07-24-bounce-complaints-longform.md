---
title: "Handling bounces and complaints — best practices for webhook consumers (4,000+ words)"
description: "Practical guide to receive, interpret and react to bounce and complaint webhooks in your application using Ollastack."
date: 2026-07-24
tags: [bounces, complaints, webhooks, best-practices, email-ops, longform]
author: "Backend Eng"
readingTime: 20
draft: false
canonical: "/blog/handling-bounces-complaints"
ogImage: "/assets/og/bounce-complaints.png"
---

TL;DR

Bounce and complaint webhooks are critical feedback signals. This guide covers the webhook schema for bounce/complaint events, retry and queueing strategies, suppression list management, and metrics to track for sender health.

-----

Section 1 — Webhook schema for bounces

Each bounce event includes: recipient, bounce type (hard/soft), bounce code, diagnostic message, and timestamp. Hard bounces should trigger immediate suppression; soft bounces should be retried with backoff.

Section 2 — Webhook schema for complaints

Complaint events include: recipient, complaint type, timestamp, and feedback loop identifier. Complaints should trigger immediate suppression and alert the team.

Section 3 — Suppression list management

Maintain separate lists for hard bounces, soft bounces (with TTL), and complaints. Expose a suppression API for programmatic management.

Section 4 — Monitoring bounce and complaint rates

Track bounce rate (target <5%) and complaint rate (target <0.1%). Set up alerts when thresholds are exceeded.

FAQ

Q: What's the difference between a hard and soft bounce?
A: Hard bounce = permanent failure (invalid address). Soft bounce = temporary failure (mailbox full).

Resources

- Webhooks best practices: /blog/webhooks-retries-idempotency
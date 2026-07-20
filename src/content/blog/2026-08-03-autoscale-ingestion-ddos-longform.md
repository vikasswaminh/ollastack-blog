---
title: "Autoscaling form ingestion and DDoS resilience — architecture notes (4,000+ words)"
description: "Architectural patterns to survive traffic bursts and DDoS while preserving important per-IP rate-limits and submission integrity."
date: 2026-08-03
tags: [architecture, scaling, ddos, rate-limits, sre, longform]
author: "SRE"
readingTime: 22
draft: false
canonical: "/blog/autoscale-form-ingestion-ddos"
ogImage: "/assets/og/autoscale-ddos.png"
faq:
  - q: "How does Ollastack stay up during a traffic burst?"
    a: "Layered rate limits (per-IP-per-form, per-IP, and a high per-form DDoS backstop) shed abusive traffic while legitimate submissions pass, and quota reservation is atomic so concurrency can't over-admit."
  - q: "What's the difference between the rate-limit buckets?"
    a: "The per-IP-per-form limit is the real abuse defense — tripping it only affects that one IP on that one form. The per-form global limit is a high DDoS-only backstop that sits far above legitimate traffic."
  - q: "Do rejected submissions during a burst just disappear?"
    a: "No — a submission blocked by rate-limit, captcha, or validation is recorded in a failures log with a payload snapshot, so the owner can see lost enquiries rather than guess."
---

TL;DR

Form ingestion pipelines must handle traffic bursts and DDoS while maintaining per-IP rate limits and data integrity. This guide covers rate-limit strategy (three buckets), queue-based backpressure, auto-scaling triggers, and failover patterns for Ollastack's submission path.

-----

Section 1 — Rate-limit strategy (three buckets)

- ip_form: per-IP-per-form. Critical abuse defense. Tripping it only affects that one IP on that one form.
- ip: per-IP global. Prevents single-IP flooding across forms.
- form: per-form global. High DDoS-only backstop above legit traffic.

Section 2 — Queue-based backpressure

Submissions are queued before processing. Queue depth signals backpressure to upstream consumers.

Section 3 — Auto-scaling triggers

Scale ingestion workers based on queue depth and submission rate. Use Cloudflare for edge-level DDoS absorption.

Section 4 — Failover patterns

Multi-region deployment with active-active ingestion. Database read replicas for submission queries.

FAQ

Q: How does Ollastack handle traffic spikes?
A: Rate limits absorb abuse traffic. Queuing smooths legitimate bursts. Auto-scaling handles sustained increases.

Resources

- Rate limits: /docs/rate-limits
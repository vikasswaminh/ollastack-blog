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
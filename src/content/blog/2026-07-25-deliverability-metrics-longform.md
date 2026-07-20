---
title: "Measuring email deliverability — open rate, bounce rate and reputation metrics (4,000+ words)"
description: "Which metrics matter for deliverability and how to instrument them for speedy diagnosis using Ollastack's analytics."
date: 2026-07-25
tags: [metrics, deliverability, analytics, monitoring, longform]
author: "Analytics"
readingTime: 20
draft: false
canonical: "/blog/measure-email-deliverability-metrics"
ogImage: "/assets/og/deliverability-metrics.png"
faq:
  - q: "Which email metrics actually matter for deliverability?"
    a: "Bounce rate, complaint rate, and authentication pass rate matter most — they directly affect whether mailbox providers accept your mail. Open rate is a softer signal and increasingly unreliable due to privacy proxies."
  - q: "What bounce rate is too high?"
    a: "As a rule of thumb, keep hard bounces under about 2% and complaints under about 0.1%; sustained higher rates get your domain throttled or blocked. Instrument them per-send so you catch a spike early."
  - q: "How do I instrument deliverability?"
    a: "Capture bounce and complaint webhooks plus the email log, then track auth pass rate (SPF/DKIM/DMARC) and per-domain delivery outcomes so a regression is visible before it costs you the inbox."
---

TL;DR

You can't improve deliverability without measuring it. This guide covers the essential metrics: delivery rate, bounce rate, complaint rate, open rate, click rate, and reputation scores — with instrumentation guidance and sample dashboard templates.

-----

Section 1 — Key metrics

Delivery rate: percentage of sent emails accepted by the receiving server. Bounce rate: percentage rejected. Complaint rate: percentage marked as spam. Open rate: percentage opened (requires tracking pixel). Click rate: percentage clicked.

Section 2 — Instrumentation

Use Ollastack's delivery inspection API to programmatically track metrics. Set up a dashboard with Datadog/Grafana.

Section 3 — Sample dashboard template

Widgets: daily delivery rate, bounce rate trend, complaint rate, top bounce codes, reputation score.

Section 4 — Alerts

Alert on: bounce rate > 5%, complaint rate > 0.1%, delivery rate < 95%.

FAQ

Q: How do I track open rates without a tracking pixel?
A: Ollastack supports embedded tracking pixels for open detection.

Resources

- API docs: /email-api
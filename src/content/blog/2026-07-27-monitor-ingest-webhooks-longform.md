---
title: "Monitoring mail ingest and webhook health — alerts and runbooks (4,000+ words)"
description: "Set up effective monitoring and alerts for mailbox ingest, webhook delivery success and failure modes with Ollastack."
date: 2026-07-27
tags: [monitoring, alerts, webhooks, ingest, runbooks, longform]
author: "SRE"
readingTime: 20
draft: false
canonical: "/blog/monitor-mail-ingest-webhooks"
ogImage: "/assets/og/monitor-ingest.png"
---

TL;DR

Mail ingest and webhook delivery are critical paths that need proactive monitoring. This guide covers health metrics, sample alert configurations, runbooks for common failure modes, and dashboard templates for mail pipeline observability.

-----

Section 1 — Key health metrics

- Ingest latency: time from submission to webhook delivery.
- Webhook delivery success rate: percentage of deliveries that return 2xx.
- Retry queue depth: number of deliveries waiting for retry.
- Mailbox ingest rate: messages per minute per mailbox.

Section 2 — Alert configurations

PagerDuty/Opsgenie alerts for: webhook delivery rate < 95%, ingest latency > 60 seconds, retry queue > 100 items.

Section 3 — Runbooks for common failures

Failure: webhook consumer returns 5xx. Action: check consumer health, replay deliveries via API. Failure: mailbox ingest stops. Action: check mail routing DNS, verify MX records.

Section 4 — Dashboard template

Widgets: ingest rate, delivery success rate, retry queue depth, top failure codes.

FAQ

Q: How do I set up alerts for webhook failures?
A: Use Ollastack's webhook delivery inspection API to poll for failed deliveries and trigger external alerts.

Resources

- Observability docs: /docs/observability
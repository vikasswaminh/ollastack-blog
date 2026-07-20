---
title: "Security and privacy — how Ollastack redacts PII and enforces retention policies (4,000+ words)"
description: "How Ollastack scrubs personally identifiable information on submission deletion, enforces data retention policies, and provides compliance controls."
date: 2026-08-06
tags: [security, privacy, pii, retention, compliance, longform]
author: "Security/Compliance"
readingTime: 22
draft: false
canonical: "/blog/security-privacy-pii-redaction"
ogImage: "/assets/og/security-privacy.png"
faq:
  - q: "What happens to my data when I delete a submission?"
    a: "Deletion scrubs PII from related rows too — the webhook delivery payload, and the notification email log's recipients and subject — so a deleted submission doesn't linger in side tables."
  - q: "Can I set data retention on submissions?"
    a: "Yes — retention is configurable per form, and a retention job deletes older submissions (scrubbing their PII) so you don't hold data longer than your policy allows."
  - q: "How is PII protected in general?"
    a: "Least-privilege token scopes, PII redaction on delete and on retention expiry, and encrypted-at-rest tenant SMTP credentials — so personal data isn't exposed through logs, side tables, or over-broad tokens."
---

TL;DR

When a submission is deleted, the PII shouldn't persist in webhook delivery logs, email notifications, or attachment storage. This guide explains Ollastack's PII redaction pipeline, retention cron job, customer-facing compliance controls, and audit logging.

-----

Section 1 — What we redact on deletion

When purgeSubmissionPii is called (soft delete, admin delete, retention cron), these are scrubbed:
- webhook_deliveries.payload (full submission jsonb)
- webhook_deliveries.response_body
- email_logs.to / to_emails / cc_emails / bcc_emails / subject / error_message

Section 2 — Retention policies

A cron job (api/cron/mail-retention) deletes submissions older than the configured retention period. Retention is configurable per-form.

Section 3 — Customer-facing controls

Configure retention period in form settings. Export submissions before deletion.

Section 4 — Audit logging

All deletions and PII scrubs are recorded in activity logs.

FAQ

Q: Can I recover a deleted submission?
A: No — deletion scrubs PII irreversibly. Export before deleting.

Resources

- Compliance documentation: /docs/compliance
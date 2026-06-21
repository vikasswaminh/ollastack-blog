---
title: "A free API to send email in one call"
description: "Send email with one HTTP POST — no SMTP, no mail server. A free API to send email, the deliverability basics, and how to receive the reply too."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "send", "free", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "What's the simplest free API to send email?"
    a: "A single authenticated HTTP POST: create a mailbox once, then POST to /api/mailboxes/{id}/send with to, subject, and text or html. No SMTP server, no credentials beyond an API token, and the free tier needs no credit card."
  - q: "Do I need SMTP or a mail server?"
    a: "No. The API handles delivery — you make one HTTPS call. There's no SMTP host, port, or password to configure, and nothing to run."
  - q: "Will the email land in the inbox?"
    a: "Mail sent from the platform's verified domain is authenticated (SPF/DKIM/DMARC) out of the box. To send from your own domain, add a custom sender domain and publish the DNS records; until then it falls back to the authenticated platform sender."
  - q: "Can the same API also receive replies?"
    a: "Yes — every mailbox has a real receiving address, so you can long-poll for the reply with the same token. Most send-only APIs can't do this."
---

The fastest way to send an email from code isn't SMTP — it's one HTTP call. No mail server, no host/port/password, no library quirks. Here's a free API to send email in a single POST, plus the deliverability basics and the honest limits.

## The one call

Create a mailbox once, then send from it. That's it:

```bash
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_.../send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "user@example.com",
    "subject": "Hello",
    "text": "Sent with a single API call — no SMTP."
  }'
# → { "id": "msg_…", "status": "sent" }
```

No `smtp.host`, no port 587, no app password. An API token and one HTTPS request.

## No SMTP to set up

SMTP makes you configure a host, a port, TLS, and credentials, then handle connection errors and timeouts. An HTTP send API removes all of it — the call either returns a message id or a clear error you can act on. That's the whole appeal: send mail without operating mail infrastructure.

## Deliverability basics

One call still has to reach the inbox:

- Out of the box, mail sends from the platform's **verified domain** with SPF/DKIM/DMARC already passing.
- To send from **your** domain, add a custom sender domain and publish the DNS records — see [DKIM, SPF & DMARC](/blog/dkim-spf-dmarc-custom-sender). Until verified, delivery falls back to the authenticated platform sender, so a DNS mistake degrades branding, never delivery.

## The honest limit

The free send quota is **modest and monthly** — perfect for transactional sends, agent mail, and testing, not for bulk marketing. For high-volume blasts, use a dedicated transactional provider; for send *plus* receive on a free tier, this is the simpler path.

## Bonus: receive the reply

Because each mailbox also *receives*, the same token can long-poll for the response — something most send-only APIs can't do:

```bash
curl "https://login.ollastack.com/api/mailboxes/mbx_.../wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

See the [email API overview](/email-api) and the [free email API service](/blog/free-email-api-service) guide for the full picture.

[Send your first email free](https://login.ollastack.com/register) — one call, no SMTP, no credit card.

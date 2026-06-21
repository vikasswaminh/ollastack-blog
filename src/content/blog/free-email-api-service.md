---
title: "Free email API service (send and receive)"
description: "A free email API service that also receives — create an inbox, send, read replies and OTP codes over HTTP, no credit card. With the honest free-tier limits."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "free", "guide"]
author: "Ollastack"
readingTime: 7
draft: false
faq:
  - q: "Is there a genuinely free email API service?"
    a: "Yes. Ollastack's free tier gives you a real email API — create mailboxes, send, receive, and read messages over HTTP, plus disposable test inboxes — with no credit card. It's metered with a modest monthly send quota."
  - q: "Does the free tier let me receive email, not just send?"
    a: "Yes, and that's the point. Each mailbox has a real receiving address, so the free tier covers receiving replies, reading OTP codes and links, and replying in-thread — capabilities most free email APIs don't offer at all."
  - q: "What are the free-tier limits?"
    a: "Sending is capped at a modest monthly quota (suitable for agents, app inbound, and testing — not high-volume marketing blasts). Receiving and test inboxes are included. For high-volume one-way sending, pair a dedicated transactional provider."
  - q: "Do I need a credit card to start?"
    a: "No. You can create an account, get an API token, and start sending and receiving without a card."
---

Search "free email API service" and you'll find a dozen ways to *send* mail for free — and almost none that let you *receive* it. That's the gap: a free email API service that also gives you a real inbox, so your code can read replies, pull verification codes, and hold two-way conversations. Here's how that works, and the honest limits.

## What you get on the free tier

No credit card. An API token. And a real, full-duplex email API:

- **Send** from a mailbox's own address.
- **Receive** — every mailbox has a real receiving address.
- **Read** messages as JSON, with extracted `codes` (OTPs) and `links`.
- **Test inboxes** — disposable, unfiltered addresses for CI.

That's more than most paid send-only tiers offer, because receiving is the part they skip.

## Send and receive (code)

```bash
# create a mailbox
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"free","mode":"agent","handle":"hello"}'

# send from it
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_.../send \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Hi","text":"Hello from a free email API"}'

# receive the reply
curl "https://login.ollastack.com/api/mailboxes/mbx_.../wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

## The honest free-tier limits

Be clear-eyed: the free send quota is **modest and monthly** — sized for AI agents, app inbound, and CI testing, not for sending tens of thousands of marketing emails. If you need high-volume one-way blasts, use a dedicated transactional provider (Resend, SendGrid, Mailgun) for the sending and this for the *receiving* and *testing*. We'd rather tell you that than have the free tier bounce on you.

## vs other "free email API" tiers

Other free tiers give you more *send* volume but **no receiving** — so they can't read a reply or an OTP. This one trades raw send volume for being **full-duplex and free**. Pick on what you need: volume → a sender; send + receive + test → this.

## Where it fits

This is the free on-ramp to the [email API](/email-api). See the sibling [free API to send email](/blog/free-api-to-send-email) and [inbound email API](/blog/inbound-email-api) guides for the send and receive halves in depth.

[Start free](https://login.ollastack.com/register) — send, receive, and test, no credit card.

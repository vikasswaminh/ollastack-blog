---
title: "Free temporary email API: disposable inboxes over HTTP"
description: "A free temporary email API for disposable inboxes you create and read over HTTP — perfect for testing signups, reading OTPs, and giving agents throwaway addresses. Here's how to create one, read its mail, and when to use a persistent inbox instead."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "temporary", "disposable", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "What is a temporary email API?"
    a: "A temporary email API creates disposable inboxes on demand and lets you read their incoming mail over HTTP. Unlike a throwaway-email website, it's programmatic — your code or CI creates the inbox, reads the message, and moves on."
  - q: "Is there a free temporary email API?"
    a: "Yes. Ollastack's free tier includes disposable test inboxes you create and read over HTTP, with no credit card. They're never spam-filtered, so a test sees every message."
  - q: "What's the difference from a persistent inbox?"
    a: "A temporary (test) inbox is throwaway and unfiltered — for CI and one-off verifications. A persistent (agent) inbox is a chosen handle that lasts and is spam-filtered — for an identity your app or agent keeps using."
  - q: "Can I read OTP codes from a temporary inbox?"
    a: "Yes. Each message exposes extracted codes and links, so you read codes[0] for an OTP instead of scraping the email body."
---

A temporary email API gives your code throwaway inboxes it creates and reads over HTTP — the programmatic version of a disposable-email site. It's the right tool for testing signups, reading OTPs in CI, and handing an AI agent a one-off address.

## Create a disposable inbox

```bash
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"throwaway","mode":"test"}'
# → { "id":"mbx_x", "address":"a1b2c3@test.ollastack.com" }
```

Use that address wherever you need a throwaway email. It's a real, receiving address — not a black hole.

## Read its mail

```bash
# block until the next message arrives
curl "https://login.ollastack.com/api/mailboxes/mbx_x/wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
# → { "from":"...", "subject":"...", "codes":["920184"], "links":["..."] }
```

Codes and links come extracted, so you read `codes[0]` instead of parsing HTML.

## Never spam-filtered (on purpose)

A test inbox is **unfiltered** — it sees every message it was sent, even spam-shaped ones. That's exactly what you want for testing: a strict transactional email never disappears from under your assertion. (Persistent agent inboxes *are* filtered — different job.)

## Temporary vs persistent

- **Temporary (test)** — throwaway, unfiltered, for CI and one-offs.
- **Persistent (agent)** — a chosen handle that lasts and is spam-filtered, for an identity. See [agent email identity](/blog/agent-email-identity).

Bulk-clear an inbox and set a retention window so test mail purges itself.

## Where it fits

Disposable inboxes power [OTP testing](/blog/free-otp-email-api), [CI email testing](/blog/email-testing-api-for-ci), and agent verifications. They're part of the same [email API](/email-api) — free, no credit card.

[Create a temporary inbox](https://login.ollastack.com/register) — disposable, readable over HTTP, free.

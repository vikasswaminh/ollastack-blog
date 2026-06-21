---
title: "Email inbox API: a real inbox your code controls over HTTP"
description: "An email inbox API gives your app or agent a real inbox — create it, send from it, receive into it, and read messages as JSON. Here's how it works, how it differs from a send-only email API, and when to use a persistent vs disposable inbox."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "inbox", "tutorial"]
author: "Ollastack"
readingTime: 7
draft: false
faq:
  - q: "What is an email inbox API?"
    a: "An email inbox API gives your code a real, addressable inbox it operates over HTTP — create the inbox, send from it, receive into it, and read messages (with extracted codes and links) as JSON. Unlike a send-only email API, it holds two-way conversations."
  - q: "How is an inbox API different from a sending API?"
    a: "A sending API (SendGrid, Resend, Mailgun) only pushes mail out. An inbox API also receives: it has a real address that accepts incoming mail and exposes it to your app, so you can read replies, OTP codes, and inbound messages — not just send."
  - q: "What's the difference between a persistent and a disposable inbox?"
    a: "A persistent (agent) inbox is a chosen handle that lasts and is spam-filtered — for an identity your app or agent keeps using. A disposable (test) inbox is a throwaway address that's never spam-filtered — ideal for CI and one-off verifications."
  - q: "Is there a free email inbox API?"
    a: "Yes. Ollastack's free tier includes inboxes you can send from, receive into, and read over HTTP, with no credit card."
---

A sending API can push a message out, but it can't hold a conversation. An **email inbox API** can: it gives your code a real, addressable inbox that sends *and* receives, so your app or agent can read replies, pull verification codes, and act on inbound mail — all over HTTP, no mail server.

## What an email inbox API is

It's a real inbox behind an API. You create one, and it gives you an **address** that can receive mail and an **id** you use to send, read, and reply. Messages come back as JSON. That's the difference from a sending-only API: the inbox is a two-way object your code owns.

## Create and read an inbox

```bash
# create an inbox
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"app inbox","mode":"agent","handle":"team"}'
# → { "id":"mbx_…", "address":"team@agent.ollastack.com" }

# list what it has received
curl "https://login.ollastack.com/api/mailboxes/mbx_.../messages" \
  -H "Authorization: Bearer $TOKEN"

# or block until the next message arrives
curl "https://login.ollastack.com/api/mailboxes/mbx_.../wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

Each message returns the subject, bodies, and extracted `codes`/`links` — read fields, don't scrape HTML. To send from the same inbox, `POST /api/mailboxes/{id}/send`; to reply in-thread, `POST /api/mailboxes/{id}/messages/{id}/reply`.

## Inbox vs send-only API

A send-only API answers "did it go out?" An inbox API answers "what came back?" — replies, codes, inbound support mail. If your product only blasts notifications, a sender is enough; if it needs to *read* mail (agents, 2FA flows, support, testing), you need an inbox.

## Persistent vs disposable

- **Persistent (agent) inbox** — a chosen handle that lasts and is spam-filtered. For an identity your app or agent keeps using. See [agent email identity](/blog/agent-email-identity).
- **Disposable (test) inbox** — a throwaway address, never spam-filtered, for CI and one-off verifications. See [email testing API for CI](/blog/email-testing-api-for-ci).

Same API, two guarantees — pick per use.

## Where it fits

The inbox API is the receive-and-converse layer; sending lives on the same token. See the [email API overview](/email-api), and the sibling [inbound email API](/blog/inbound-email-api) guide for the webhook/parsing detail.

[Create an inbox](https://login.ollastack.com/register) — send, receive, and read over HTTP, free to start.

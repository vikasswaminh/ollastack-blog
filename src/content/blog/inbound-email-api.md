---
title: "Inbound email API: receive mail over HTTP (with code)"
description: "An inbound email API hands you incoming mail as structured JSON over HTTP — no IMAP, no mail server. Here's how to receive email in one call, read parsed fields plus extracted codes and links, and fire a webhook on every message."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "inbound", "tutorial"]
author: "Ollastack"
readingTime: 7
draft: false
faq:
  - q: "What is an inbound email API?"
    a: "An inbound email API gives you a real receiving address and hands incoming messages to your code as structured JSON over HTTP — the parsed from, subject, text and HTML bodies, attachments, and (with Ollastack) pre-extracted one-time codes and links. It replaces running your own mail server or scraping an IMAP mailbox."
  - q: "How is an inbound email API different from forwarding or IMAP?"
    a: "Forwarding just relays raw mail to another address; IMAP makes you connect, poll, and parse MIME yourself. An inbound email API delivers each message as clean JSON (or a signed webhook) the instant it arrives, so your app reads fields instead of parsing envelopes."
  - q: "Can I get a webhook when email arrives?"
    a: "Yes. Point a mailbox at a webhook URL and every inbound message POSTs to it (HMAC-signed, SSRF-guarded), or long-poll the wait endpoint to block until the next message lands. Both deliver the same structured payload."
  - q: "Is there a free inbound email API?"
    a: "Yes — Ollastack's free tier includes receiving and disposable test inboxes with no credit card. See the free tier on the email API page."
---

Most "email APIs" only *send*. The moment you need to *receive* — a reply, a verification code, an inbound support message — you're told to run a mail server or poll IMAP and parse MIME by hand. An inbound email API removes all of that: it gives you a real receiving address and hands each incoming message to your code as structured JSON over HTTP.

## What an inbound email API is

It's three things behind one API: a **real receiving address**, **delivery of incoming mail as JSON** (or a signed webhook), and **parsed fields** so you never touch raw MIME. Where a sending API ends at "message queued," an inbound API begins at "a message arrived — here it is, parsed."

## Receive in one call

Create a mailbox, then long-poll for the next message. `wait` blocks until mail arrives (or times out), so there's no busy-polling:

```bash
# create an inbox
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"inbound","mode":"agent","handle":"hello"}'
# → { "id":"mbx_…", "address":"hello@agent.ollastack.com" }

# receive the next message to it
curl "https://login.ollastack.com/api/mailboxes/mbx_.../wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

## Parsed fields, codes, and links

The response is structured — your code reads fields, not envelopes. Ollastack also extracts one-time codes and URLs so you don't regex the body:

```json
{
  "from": "customer@example.com",
  "to": "hello@agent.ollastack.com",
  "subject": "Re: your quote",
  "text": "Sounds good — my code is 920184",
  "codes": ["920184"],
  "links": ["https://example.com/confirm?token=…"]
}
```

## Inbound API vs forwarding / IMAP

| | Inbound email API | Forwarding | IMAP |
|---|---|---|---|
| Delivery | JSON / webhook | raw relay | you poll |
| Parsing | done for you | none | you parse MIME |
| Codes & links | extracted | — | — |
| Setup | an API token | DNS | mailbox creds |

Forwarding moves mail; IMAP makes you do the work. An inbound API gives your application the message as data.

## Webhook on inbound

Prefer push? Give the mailbox a `webhook_url` and every inbound message POSTs to it with an HMAC signature you verify, retried on failure. It's the same structured payload as `wait`, delivered to your endpoint the instant mail lands. (For agents that act on inbound, see [build an agent that sends and receives email](/blog/build-ai-agent-that-sends-and-receives-email).)

## Where it fits

Inbound is the half that send-only APIs skip — and it's the foundation for two-way conversations, agent inboxes, and CI email testing. It lives on the same API as sending: see the [email API overview](/email-api) and the sibling [email inbox API](/blog/email-inbox-api) and [free email API service](/blog/free-email-api-service) guides.

[Get an inbound address](https://login.ollastack.com/register) — receive mail as JSON, free to start, no credit card.

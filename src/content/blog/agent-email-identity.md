---
title: "Give your AI agent an email identity (send & receive)"
description: "Give an AI agent a real email identity — a chosen, spam-filtered, full-duplex address it can send from, receive into, and reply through over an API."
date: 2026-07-17
updated: 2026-06-19
tags: ["ai-agents", "email", "agent-mail", "guide"]
author: "Ollastack"
readingTime: 8
faq:
  - q: "What is an agent email identity?"
    a: "A persistent, chosen email address an AI agent owns — on agent.ollastack.com or your own verified domain — that it sends from, receives into, and replies through over an API. It's spam-filtered, unlike a disposable test inbox."
  - q: "How is it different from a test inbox?"
    a: "A test inbox is disposable and never spam-filtered, for CI. An agent identity is persistent and spam-filtered — for an agent that corresponds with real people over time."
  - q: "Can the agent reply in-thread?"
    a: "Yes — replies preserve the In-Reply-To and References headers so they thread into the same conversation."
---

As soon as you put an AI agent to work on real tasks, it runs into email. It needs to receive a confirmation link to finish a signup. It needs to reply in a thread it started. It needs a stable, professional address to act as a support or sales persona. A throwaway inbox won't do — the agent needs an *identity*. That's what agent mail is.

## Two kinds of mailbox, and why the difference matters

There are two distinct jobs, and conflating them is a security mistake:

- **Test inboxes** — disposable, never spam-filtered, for CI assertions ("did the email arrive?"). Covered in [testing OTP emails in CI](/blog/test-otp-email-in-ci).
- **Agent identities** — *persistent*, a **chosen** address (`support@…`, not a random slug), spam-filtered like a real inbox, able to send and reply. This is what an agent acts *as*.

Token scopes keep them isolated. An agent identity is driven with a `mail.agent:*`-scoped token; that token cannot read or clear your CI test inboxes, and a CI token cannot send as your agent identity. A leaked credential is contained to its function.

## Claim an identity

```bash
# Check the handle is free, then create the identity
curl "https://login.ollastack.com/api/mailboxes/check-handle?handle=support" \
  -H "Authorization: Bearer $TOKEN"

curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"mode":"agent","handle":"support"}'
# -> { "address": "support@agent.ollastack.com", ... }
```

The handle is the agent's business identity — persistent, and the address it sends and receives from.

## Receive: wait for the next message

The agent doesn't poll a busy loop; it long-polls and gets the message the instant it lands, with codes and links already extracted:

```bash
curl "https://login.ollastack.com/api/mailboxes/$ID/wait?timeout=55" \
  -H "Authorization: Bearer $TOKEN"
# -> { data: { fromAddress, subject, textBody, codes: [...], links: [...] } }
```

So an agent finishing a signup flow can: trigger the email, `/wait` for it, read `codes[0]` or `links[]`, and continue — no scraping, no regex on HTML.

## Send and reply as the identity

```bash
# Send a new message
curl -X POST https://login.ollastack.com/api/mailboxes/$ID/send \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"to":"customer@example.com","subject":"Following up","text":"..."}'

# Reply in an existing thread (keeps threading headers)
curl -X POST https://login.ollastack.com/api/mailboxes/$ID/messages/$MSG_ID/reply \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"text":"Thanks for the details — here's the next step…"}'
```

Outbound goes out *as the chosen identity* (`support@agent.ollastack.com`, or your own verified domain on a paid plan), so replies thread correctly and land in the right inbox.

## Spam filtering — on, deliberately

Unlike a test inbox, an agent identity is **spam-filtered** with the same layered pipeline used for form submissions. An agent acting on real correspondence shouldn't be fed every phishing attempt and lottery scam. Hard spam is hidden; anything the ML model alone is unsure about is delivered but flagged, so the agent (or you) can review rather than auto-act on a maybe-spammer. The autoresponder is suppressed for flagged mail — you don't want an agent auto-replying to a spammer.

## The agent reads the API itself

Every endpoint is in the OpenAPI document at `/api/openapi.json`, CORS-open, so an MCP tool or agent framework configures itself from the spec instead of you hand-writing a client. Inbound mail can also fire a signed webhook if your agent runtime is event-driven rather than polling.

## When you'd use this

- **Verification flows:** an agent completing a third-party signup that emails a code.
- **Follow-ups:** an agent that started a thread and needs to continue it from the same address.
- **Personas:** a support or sales agent that corresponds from a stable, professional address.

## Get started

Mint a `mail.agent:*` token, claim a handle, and point your agent at the spec. The [Agent Mail docs](https://login.ollastack.com/api/openapi.json) describe every endpoint — your agent can read them directly.

[Create an agent identity](https://login.ollastack.com/register) — free to start.

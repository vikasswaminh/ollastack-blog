---
title: "Email for AI agents: how to give an agent its own inbox (send, receive, reply)"
description: "AI agents increasingly need real email — to receive a verification code, reply in a thread, or act as a persona. Here's what 'email for AI agents' actually means, how an agent inbox differs from a notification API, and how to give an agent an address it can send and receive from over one API."
date: 2026-08-04
updated: 2026-06-21
tags: ["ai-agents", "email", "agent-mail", "guide"]
author: "Ollastack"
readingTime: 10
draft: false
---

The moment an AI agent does real work, it hits email. To finish a signup it needs a verification link. To follow up it needs to reply in a thread it started. To act as a support or sales persona it needs a stable, professional address. Traditional email APIs can't do this — they're built to *send* one-way notifications, not to hold a two-way conversation. "Email for AI agents" is the category that fixes that: a real inbox an agent owns and operates over an API.

## Why a notification API isn't enough

Transactional email providers (the SendGrid/Postmark/SES shape) are built for outbound: your app sends a receipt, a password reset, a digest. They assume a human reads it and the loop ends there. An agent's loop doesn't end there — it needs to **receive** the reply, **read** the verification code, and **respond** in the same thread. That requires three things a notification API doesn't give you:

1. **A real, persistent inbox** with an address that can receive mail.
2. **Programmatic read access** to messages as structured data — not an IMAP scrape.
3. **Threaded reply** that preserves `In-Reply-To`/`References` so the conversation holds together.

Email *for agents* is the inbox-shaped version of email: send, receive, and reply, all over an API an agent can drive itself.

## The two jobs an agent inbox does (and why they're different)

There are two distinct reasons an agent needs email, and conflating them is a mistake:

- **A persistent identity** — the agent acts *as* `support@yourcompany.com` or a chosen handle, over time, to real people. This inbox should be **spam-filtered**, because it's exposed to the world.
- **A disposable test inbox** — the agent (or your CI) needs to receive *one* email to assert on it: the OTP from a signup flow, the magic link. This inbox should be **unfiltered**, because a test must see every message it triggered, spam-scored or not.

Ollastack models these as two mailbox modes. An **agent** mailbox is a chosen handle on `agent.ollastack.com` (or your own verified domain), persistent and spam-filtered. A **test** mailbox is a disposable address on `test.ollastack.com`, never filtered. Same API, different guarantees. More on the identity side in [give your AI agent an email identity](/blog/agent-email-identity).

## What the agent can actually do

Once a mailbox exists, the agent has the full duplex over the API:

- **Send** from its own identity — `POST /api/mailboxes/{id}/send` with `to`, `subject`, `text`/`html`.
- **Receive** — inbound mail lands in the mailbox; list it or long-poll for the next one.
- **Wait** — `GET /api/mailboxes/{id}/wait` blocks until the next email arrives, ideal for "trigger an action, then wait for the email it causes."
- **Read structured** — each message exposes the bodies plus **extracted `codes` (OTPs) and `links`**, so the agent doesn't regex raw HTML.
- **Reply in-thread** — `POST /api/mailboxes/{id}/messages/{messageId}/reply` keeps the threading intact.

A minimal "create an inbox and send" looks like this:

```bash
# 1. Create a persistent agent mailbox on a handle you choose
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer fmd_..." -H "Content-Type: application/json" \
  -d '{"name":"Support bot","mode":"agent","handle":"support"}'
# → { "id": "mbx_…", "address": "support@agent.ollastack.com" }

# 2. Send from it
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_.../send \
  -H "Authorization: Bearer fmd_..." -H "Content-Type: application/json" \
  -d '{"to":"lead@example.com","subject":"Following up","text":"Hi — quick follow-up on your enquiry…"}'
```

The receive side and the OTP-reading side are covered in depth in [build an AI agent that sends and receives email](/blog/build-ai-agent-that-sends-and-receives-email) and [read an OTP code in an AI agent](/blog/read-otp-verification-code-in-ai-agent).

## Inbound is spam-filtered — and fails open

An agent inbox exposed to the world will get spam. Ollastack runs **the same spam pipeline as forms** on inbound agent mail: hard spam is hidden from the list, the `wait`, and the webhook; an uncertain message is delivered and badged, never silently dropped. Crucially this is **fail-open** — a classifier error delivers the mail unfiltered rather than swallowing it. A real reply from a customer can't be lost to the filter. (Test inboxes skip filtering entirely, by design.)

## The agent reads the API itself

Every one of these endpoints is in the public OpenAPI spec at `/api/openapi.json` — CORS-open, no auth to read — so an agent discovers the surface without a docs site. And because the spec is agent-native, you can wrap it as **MCP tools**: the [Ollastack MCP server](/blog/build-ai-agent-that-sends-and-receives-email) gives Claude Desktop, Cursor, or any MCP client `createMailbox`, `sendMail`, `replyMail`, `waitForMailMessage`, and `getMailMessage` directly.

## Where this fits next to forms and testing

Email is one of three things an agent needs to talk to the outside world. The other two — **forms** (capturing inbound) and **email testing** (verifying the whole flow in CI) — live on the same API, the same token system, and the same MCP. That's the difference between stitching three vendors together and using one platform: see the [developer hub](/resources/developer-hub) for the full surface.

## The takeaway

"Email for AI agents" means a real inbox the agent owns: send from a chosen identity, receive and read structured messages (with OTPs and links extracted), and reply in-thread — over an API, with spam filtering that fails open so a real message is never lost. If your agent needs to finish a signup, follow up a lead, or be a persona, that's the capability it needs.

[Give your agent an inbox](https://login.ollastack.com/register) — free to start, on the same API as your forms and CI test inboxes.

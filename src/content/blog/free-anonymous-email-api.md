---
draft: true
title: "Free email API with disposable addresses"
description: "A free email API with disposable addresses that keep a personal inbox private from the recipient — the honest take on 'anonymous', and how to use it."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "free", "disposable", "developers"]
author: "Ollastack"
readingTime: 6
faq:
  - q: "Is there a free anonymous email API for developers?"
    a: "There's a free email API with disposable addresses you create and read over HTTP without exposing a personal inbox. That gives you separation and throwaway addresses — but be clear: traffic is authenticated to your account and logged, so it's 'disposable and private from the recipient,' not untraceable."
  - q: "Does 'anonymous' mean untraceable?"
    a: "No — and any honest provider will say so. Sends and receives are tied to your API token and account for abuse prevention. What you get is disposable addresses that don't reveal a personal inbox, not anonymity from the platform or the law."
  - q: "What's it actually good for?"
    a: "Creating throwaway addresses for signups and testing, keeping a personal inbox out of an automated flow, and giving agents per-task addresses — all over an HTTP API, free, no credit card."
  - q: "Can I read replies to a disposable address?"
    a: "Yes. Each disposable inbox receives mail you read over HTTP, with extracted codes and links."
---

People search "anonymous email API" wanting two real things: **disposable addresses** and **not exposing a personal inbox**. A free email API delivers both. But it's worth being honest about what "anonymous" can and can't mean — and then using the part that's genuinely useful.

## The honest definition

A disposable inbox keeps your personal address out of a flow and is throwaway after use. That's **private from the recipient** — they see `a1b2c3@test.ollastack.com`, not you. It is **not** untraceable: like any reputable API, sends and receives are authenticated to your token and logged for abuse prevention. Anyone promising true anonymity is either lying or running an open relay you shouldn't trust. So: disposable and separated, yes; anonymous-from-the-platform, no.

## What it's good for

- **Signups and testing** without burning a real inbox.
- **Keeping a personal address out** of automated or shared flows.
- **Per-task addresses** for AI agents.

## How to use it

```bash
# a disposable, private-from-recipient address
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"signup","mode":"test"}'
# → { "id":"mbx_x", "address":"a1b2c3@test.ollastack.com" }

# read what it receives
curl "https://login.ollastack.com/api/mailboxes/mbx_x/wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

Replies come back as JSON with extracted `codes` and `links` — see [free temporary email API](/blog/free-temporary-email-api).

## A worked example

Say an agent needs to sign up for a third-party service without using a personal inbox:

```bash
# 1. a disposable, private-from-recipient address
addr=$(curl -s -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"signup","mode":"test"}' | jq -r .address)

# 2. use $addr in the signup form, then read the verification email
curl "https://login.ollastack.com/api/mailboxes/$MBX_ID/wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
# → { "subject":"Verify your email", "codes":["920184"], "links":["..."] }
```

The recipient service only ever sees the disposable address — your real inbox never enters the flow.

## What a disposable address can't do

Be realistic about the boundaries:

- **It's not untraceable** — the platform authenticates and logs your traffic for abuse prevention.
- **It's not for evading bans or spam** — abuse gets the address (and account) shut down.
- **It's not a persistent identity** — for an address people reply to over time, use a spam-filtered [agent inbox](/blog/agent-email-identity) instead.

Used as intended — keeping a personal inbox out of automated and one-off flows — disposable addresses are genuinely useful and honest.

## Free, no card

The free tier covers disposable inboxes with no credit card. See the [email API overview](/email-api) and [free email API service](/blog/free-email-api-service).

[Create a disposable address](https://login.ollastack.com/register) — free, readable over HTTP.

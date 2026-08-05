---
title: "Basin alternative: migrating to Ollastack step-by-step"
description: "Move from Basin to Ollastack: swap the endpoint, keep your fields, and gain an agent-first API, inspectable webhooks with replay, and reversible spam."
date: 2026-07-01
updated: 2026-06-19
tags: ["migration", "basin", "guide", "comparison"]
author: "Ollastack"
readingTime: 7
faq:
  - q: "How do I migrate from Basin?"
    a: "Swap your form's action URL to the Ollastack endpoint and keep the field names — a one-line change for most forms. Then wire notifications and webhooks in settings."
  - q: "Will my fields still work?"
    a: "Yes — field names carry over unchanged."
  - q: "What do I gain over Basin?"
    a: "An agent-first API, inspectable webhooks with replay, and spam handling you can see and reverse."
---

Basin is a polished, developer-friendly form backend — if you're leaving it, it's usually for one of a few specific reasons, not because anything's broken. This guide covers the why briefly and the how in full. For the wider landscape, see [Basin vs Web3Forms](/blog/basin-vs-web3forms).

## Why teams move from Basin

- **They need agent/API submissions as a first-class path** (an AI agent or a script submitting on a user's behalf), which a human-shaped form backend flags as spam.
- **They want webhooks they can inspect and replay**, not just delivered.
- **They want spam decisions to be visible and reversible** — to see and recover a filtered lead.
- Volume/pricing fit at scale.

If none of those apply, Basin is a fine place to stay. If one does, the move is straightforward.

## The migration is one line

A Basin form posts to a Basin endpoint:

```html
<form action="https://usebasin.com/f/abcd1234" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
</form>
```

Point it at Ollastack and add the optional honeypot:

```html
<form action="https://login.ollastack.com/api/submit/your-slug" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button>Send</button>
</form>
```

Field names carry over. The endpoint accepts JSON, urlencoded, and multipart, so `fetch()` and plain HTML both work unchanged.

## Map the magic fields

Basin and Ollastack share most conventions:

| You want… | Field |
|---|---|
| Reply-To + autoresponder target | `_replyto` or `email` |
| Override subject | `_subject` |
| Success redirect | `_next` (allowed origin) |
| Honeypot | `_gotcha` |

CC/BCC are set in form settings, not read from public payloads (anti-relay).

## What you gain

- **Agent submissions:** mint a scoped Bearer token and an agent can submit cleanly — skipping honeypot/captcha/per-IP limits — tagged `agent:<tokenId>` in your inbox. Agents self-discover the API from `/api/openapi.json`.
- **Webhooks with replay:** signed deliveries, retries on a backoff ladder, full per-webhook history, and one-click replay of the exact stored payload.
- **Reversible spam:** ML-uncertain submissions are quarantined (delivered + labeled), not dropped; a readable failures log captures anything rejected before storage.
- **Built-in mail testing:** disposable inboxes + `/wait` if you also test transactional email in CI.

## Verify the cutover

1. Submit a test from the live page → it lands in the inbox.
2. Notification arrived.
3. Webhook fired → delivery recorded.
4. Remove the Basin form.

[Start free](https://login.ollastack.com/register) — 50 submissions/month, no card. The endpoint is the only thing to remember.

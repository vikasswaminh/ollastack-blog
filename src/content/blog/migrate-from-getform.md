---
title: "Getform (Forminit) alternative: migrating to Ollastack"
description: "Getform became Forminit in 2026. Old or new endpoint, moving to Ollastack is a one-line change — plus an agent API, inspectable webhooks, and reversible spam."
date: 2026-07-11
updated: 2026-06-19
tags: ["migration", "getform", "forminit", "guide"]
author: "Ollastack"
readingTime: 7
faq:
  - q: "Is Getform the same as Forminit?"
    a: "Getform rebranded to Forminit in 2026. Whether you're on the old or new endpoint, migrating is the same one-line change."
  - q: "How hard is the migration?"
    a: "For most forms, swap the action URL and keep your field names. Notifications, webhooks and sender domains are configured in settings."
  - q: "What's different about Ollastack?"
    a: "An agent-first API, inspectable webhooks with replay, and reversible spam handling — plus built-in email testing."
---

Getform rebranded to Forminit in early 2026, but the product — and the reasons a team might move off it — didn't change. If you're evaluating the switch, the [Forminit alternatives comparison](/blog/forminit-alternatives) covers the landscape. This is the migration itself, which works the same whether you're on a `getform.io` or `forminit` endpoint.

## The one-line migration

A Getform/Forminit form posts to their endpoint:

```html
<form action="https://getform.io/f/your-form-id" method="POST">
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

Field names are preserved. The endpoint accepts JSON, urlencoded, and multipart, so a `fetch()` call or an AJAX submission migrates with the same single change.

## Magic fields map directly

| You want… | Field |
|---|---|
| Reply-To + autoresponder | `_replyto` or `email` |
| Override subject | `_subject` |
| Success redirect | `_next` (allowed origin) |
| Honeypot | `_gotcha` |

CC/BCC live in form settings, not in public payloads (so your form can't be used as an email relay).

## What changes for the better

- **Agents are first-class.** Mint a scoped Bearer token and an AI agent (or a script) submits cleanly — skipping honeypot/captcha/per-IP limits — tagged `agent:<tokenId>` in your inbox. The API is self-describing at `/api/openapi.json`.
- **Webhooks you can operate.** Signed (`X-Ollastack-Signature`), retried on a backoff ladder, with full per-webhook delivery history and one-click **replay** of the exact payload.
- **Spam you can see and undo.** A layered pipeline runs automatically, and a real lead is never silently dropped — ML-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in a click; rejected-before-storage attempts are written to a readable failures log.
- **Built-in email testing.** Disposable inboxes + `/wait` if you also assert on transactional email in CI.

## Cut over safely

1. Submit a real test from the live page → confirm it lands in the inbox.
2. Confirm the notification arrived.
3. Trigger the webhook → confirm a recorded delivery.
4. Remove the old Getform/Forminit form.

[Create your form](https://login.ollastack.com/register) — 50 submissions/month free, no card.

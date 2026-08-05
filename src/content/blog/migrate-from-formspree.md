---
title: "Migrate from Formspree to Ollastack: a step-by-step guide"
description: "Move your forms off Formspree without rewriting your site — swap one endpoint, keep your fields, notifications and webhooks. With the exact diff and gotchas."
date: 2026-06-22
updated: 2026-06-19
tags: ["migration", "formspree", "guide"]
author: "Ollastack"
readingTime: 9
faq:
  - q: "How hard is it to migrate from Formspree?"
    a: "For most forms it's a one-line change — swap the form's action URL to your Ollastack endpoint and keep the existing field names. The remaining work is wiring notifications, webhooks, and optionally a custom sender domain, all in the form settings."
  - q: "Do I need to change my form field names?"
    a: "No. Field names carry over unchanged, and Formspree's magic fields like _replyto and _subject are supported by the same names. The one difference: _cc/_bcc aren't read from public payloads (set recipients in settings instead) to prevent your form becoming an email relay."
  - q: "Can I import my historical Formspree submissions?"
    a: "The cutover itself doesn't move history. Export your past submissions from Formspree for your records; a one-click bulk import isn't a feature today, so most teams keep the export as an archive and start the new endpoint fresh."
  - q: "Will my webhooks keep working?"
    a: "Yes — add the URL in the form settings. Deliveries are HMAC-signed, retried up to 5 times on a backoff, and you get a full delivery history with a Replay button — more than a fire-and-forget POST."
  - q: "Is there downtime during migration?"
    a: "No. Run both endpoints in parallel for a few days, confirm submissions, notifications and webhooks all land, then remove the Formspree form. The change is reversible until you delete the old one."
---

Migrating a form backend sounds scary and usually isn't. A form endpoint is one URL your HTML posts to — change the URL, keep the field names, and you're 90% done. The other 10% is notifications, webhooks, spam handling, and making sure nothing silently breaks. This guide walks the whole thing, end to end.

If you're still deciding whether to switch, the broader [Formspree alternatives comparison](/resources/migration-hub/) covers the landscape. This piece assumes you've decided and want the mechanics.

## Why teams move off Formspree

The usual triggers, in rough order of how often we hear them:

- **Submission caps.** The free tier is small, and overage on paid plans adds up once a form gets real traffic.
- **Spam handling is a black box.** When a real lead gets filtered, you can't see it or get it back.
- **No first-class API for agents or CI.** Increasingly, the thing submitting a form is an AI agent or a test suite — and a classic form backend treats both as spam.
- **Wanting webhooks with retries you can inspect** rather than a fire-and-forget POST.

None of these mean Formspree is bad — it's a clean product. They just mean a team has outgrown it. (We'll be honest below about where Formspree still wins.)

## Step 1 — Create the form in Ollastack

[Sign up](https://login.ollastack.com/register), create a form, and copy its endpoint. It looks like:

```
https://login.ollastack.com/api/submit/<your-slug>
```

That's the only URL you need. It accepts JSON, `application/x-www-form-urlencoded`, and `multipart/form-data`, so a plain HTML form and a `fetch()` both work without translation.

## Step 2 — Swap the endpoint

A Formspree form usually looks like this:

```html
<form action="https://formspree.io/f/abcdwxyz" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
</form>
```

The migration is a one-line diff:

```html
<form action="https://login.ollastack.com/api/submit/your-slug" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button>Send</button>
</form>
```

Field names carry over unchanged — `email`, `message`, whatever you had. The hidden `_gotcha` input is an optional honeypot: leave it empty and real users never see it; bots fill it and get filtered. (Ollastack runs a layered spam pipeline regardless, but the honeypot is free.)

For a `fetch()` submission:

```js
await fetch("https://login.ollastack.com/api/submit/your-slug", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, message }),
});
// 201 -> { "success": true, "id": "sub_...", "next": <url|null> }
```

## Step 3 — Map the "magic" fields

Formspree uses special field names like `_replyto` and `_subject`. Ollastack supports the same conventions, so most of these need no change:

| You want… | Field |
|---|---|
| Reply-To on the notification + autoresponder target | `_replyto` or `email` |
| Override the notification subject | `_subject` |
| Custom success-redirect | `_next` (must be an allowed origin) |
| Honeypot | `_gotcha` |

One deliberate difference: `_cc` / `_bcc` are **not** read from public payloads — that would let an anonymous visitor turn your form into an email relay. Configure default CC/BCC in the form's settings instead.

## Step 4 — Notifications and recipients

Set your notification recipients in the form settings (a primary address plus optional CC/BCC). Two rules to know up front:

- **Verified-recipient requirement.** A form can only notify an address verified on the account that owns it. This is the anti-mail-bomb control — verify your address first.
- **Plan limits.** Free plans allow 2 recipients across To+CC+BCC; paid plans allow 4.

If you send from your own domain, configure a **custom sender domain** or **per-tenant SMTP** so notifications arrive as `you@yourdomain.com` rather than the platform sender. Credentials are encrypted at rest, and if your SMTP fails, delivery transparently falls back to the platform so nothing silently drops.

## Step 5 — Webhooks (with retries you can see)

If you forwarded Formspree submissions to a webhook, add the URL in the form settings. Every successful, non-spam submission POSTs the payload with an `X-Ollastack-Signature` header (HMAC-SHA256 of the raw body). Verify it like this:

```js
import { createHmac, timingSafeEqual } from "node:crypto";

function verify(headers, rawBody) {
  const sig = headers["x-ollastack-signature"]; // "sha256=<hex>" / "v1=<hex>"
  const expected = createHmac("sha256", process.env.OLLASTACK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return sig.endsWith(expected); // constant-time compare in real code
}
```

Failed deliveries retry on a backoff ladder (up to 5 attempts), and the dashboard shows full delivery history per webhook — including a **Replay** button to re-send the exact stored payload after you fix a downstream bug. That's the part fire-and-forget webhooks can't do.

## Step 6 — Spam, and getting real leads back

Ollastack runs submissions through a layered pipeline: honeypot → IP blocklist → keyword/regex → excessive-links → Akismet → an in-process ML classifier. The important design choice for a migrating team:

> **A real lead can never be silently dropped.** When only the ML model flags a submission, it's *quarantined* — still delivered, just prefixed `[Possible spam]` — not deleted. You review it and one click recovers it as a clean lead.

That's the opposite of the "where did my lead go?" black box. Anything actually rejected before storage (rate-limit, captcha, origin) is recorded in a failures log you can read, so you're never guessing.

## Step 7 — If an agent or CI submits the form

This is the part that has no Formspree equivalent. Mint a scoped API token and an AI agent (or a test suite) can submit with `Authorization: Bearer <token>`. A submission from the form owner's token is treated as **trusted** — it skips the honeypot, captcha, and per-IP rate limit, and is tagged `agent:<tokenId>` in your inbox so you can tell human from machine. Agents discover the whole API from the OpenAPI doc at `/api/openapi.json`.

## Verify the cutover

Before you delete the Formspree form:

1. Submit a real test from the live page → confirm it lands in the Ollastack inbox.
2. Confirm the notification email arrived (check the deliverability panel if not).
3. Trigger your webhook and confirm a delivery row with a recorded attempt.
4. Run for a few days with both endpoints if you're cautious, then remove the old one.

## When Formspree is still the right call

To be fair: if you have a single static contact form, never need an API, never script submissions, and the free tier covers your volume, Formspree is a perfectly good place to stay. The case for moving is real traffic, programmatic/agent submissions, deliverability control, or wanting your spam decisions to be visible and reversible.

Ready to try it? [Create a form](https://login.ollastack.com/register) — the free tier is 50 submissions/month, no credit card.

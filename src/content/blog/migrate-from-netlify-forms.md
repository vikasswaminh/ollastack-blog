---
title: "Migrate from Netlify Forms to Ollastack (without rewriting your site)"
description: "Netlify Forms moved to credit-based billing. Here's how to move your forms off Netlify in one diff — drop the data-netlify attributes, point at one endpoint — and keep notifications, webhooks, and spam handling."
date: 2026-06-29
updated: 2026-06-19
tags: ["migration", "netlify", "guide"]
author: "Ollastack"
readingTime: 8
draft: false
---

Netlify Forms is convenient right up until billing. The move to credit-based pricing pushed a lot of teams to look elsewhere — and because Netlify Forms is tied to where your site is hosted, "elsewhere" means decoupling the form from the host. Good news: that decoupling is a one-line change, and it makes your forms portable forever.

If you're still comparing options, the [Netlify Forms alternatives guide](/blog/netlify-forms-alternatives) covers the field. This is the hands-on migration.

## What's actually Netlify-specific in your form

A Netlify form looks like this:

```html
<form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="contact" />
  <p class="hidden"><label>Don't fill: <input name="bot-field" /></label></p>
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
</form>
```

Everything Netlify-specific is the scaffolding: `data-netlify`, `netlify-honeypot`, the hidden `form-name` field, and the build-time form detection. Your actual fields — `email`, `message` — are standard.

## The migration

Strip the Netlify scaffolding and point the `action` at your Ollastack endpoint:

```html
<form action="https://login.ollastack.com/api/submit/your-slug" method="POST">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button>Send</button>
</form>
```

That's it. No `data-netlify`, no `form-name`, no build-time magic — the endpoint is a plain URL that works from any host (or no host). The `_gotcha` input replaces `netlify-honeypot` as your free bot trap.

Because the form no longer depends on Netlify's build step, you can host the site **anywhere** — Vercel, Cloudflare Pages, S3, a USB stick — and the form keeps working.

## Notifications

In Netlify you configured notification emails in the dashboard; same idea here. Set your recipient in the form settings (verify the address first — a form can only notify a verified address, which stops anyone pointing your form at a stranger's inbox). The submission's `email` field automatically becomes the notification's Reply-To, so replying answers the sender.

## Webhooks and integrations

If you used Netlify's outgoing webhook or a function triggered on submission, add the webhook URL in Ollastack's form settings. Deliveries are signed (`X-Ollastack-Signature`), retried on a backoff ladder, and — unlike a fire-and-forget POST — you get a full delivery history and a **Replay** button to re-send the exact payload after fixing a downstream bug. Slack, Discord, Telegram, and Mailchimp have built-in integrations; anything else, wire the signed webhook into Zapier/Make/n8n.

## Spam: visible, not silent

Netlify's spam filtering is invisible — a filtered submission is just gone. Ollastack runs a layered pipeline (honeypot → IP blocklist → keyword/regex → links → Akismet → ML), but with one rule that matters when you're migrating real traffic: **a real lead is never silently dropped.** ML-flagged-but-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in one click; anything rejected earlier is written to a readable failures log.

## File uploads

If your Netlify form accepted file uploads, the Ollastack endpoint handles `multipart/form-data` too — no separate storage wiring.

## Verify, then cut over

1. Submit a real test from the live page → confirm it lands in the Ollastack inbox.
2. Confirm the notification arrived (deliverability panel if not).
3. Trigger the webhook → confirm a recorded delivery.
4. Once confident, remove `data-netlify` from any remaining forms and you're fully decoupled.

The upside beyond pricing: your forms are now host-independent. Migrate hosts whenever you want — the form endpoint never changes.

[Create your first form](https://login.ollastack.com/register) — 100 submissions/month free, no credit card.

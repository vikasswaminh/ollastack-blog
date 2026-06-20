---
title: "How to secure a form endpoint: honeypots, origin allowlists, CAPTCHA, rate limits"
description: "A public form endpoint is an open door — spam, abuse, and email-relay attempts all show up. Here's a layered defense that stops bots without punishing real users: honeypot, origin allowlist, CAPTCHA, rate limits, and recipient guards."
date: 2026-07-25
updated: 2026-06-19
tags: ["security", "spam", "forms", "guide"]
author: "Ollastack"
readingTime: 8
draft: false
---

The moment a form endpoint is public, it's a target: spam bots, abuse, and attempts to turn your form into an email relay. No single control stops all of it, and the heavy-handed ones (CAPTCHA on everything) hurt real users. The right approach is layered — cheap, invisible defenses first, friction only where needed. Here's the stack.

## Layer 1 — the honeypot (free, invisible)

Add a hidden field real users never see and bots fill reflexively:

```html
<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" />
```

Leave it empty in your real markup; a submission that arrives with it filled is almost certainly a bot. It costs nothing, adds zero friction, and catches a surprising amount of low-effort spam. Make it the first thing you add.

## Layer 2 — origin allowlist

Lock the endpoint to the sites that are allowed to use it. With an allowlist set, a browser submitting from any other origin is rejected — so someone who scrapes your endpoint URL can't POST to it from their own page. Set the allowed origins to your real domains:

```
https://example.com, https://www.example.com
```

(Server-to-server and authorized agent clients follow a different model — they authenticate with a token, not an origin.)

## Layer 3 — CAPTCHA, but only where it earns its place

CAPTCHA is friction, so use it deliberately. The pattern that works: configure the provider (Cloudflare Turnstile is a good low-friction choice) once, then turn the per-form switch **on only for the forms that actually attract abuse** — a public signup, a high-value lead form — and leave it off for low-risk internal forms. With it on, every browser submission must carry a valid token or it's rejected. Don't tax every form to protect one.

## Layer 4 — rate limits

Even with the above, a determined bot can hammer one endpoint. Layered rate limits contain it:

- **Per-IP-per-form** — the real abuse limit; tripping it only affects that one IP on that one form.
- **Per-IP global** — across all your forms.
- **Per-form global** — a high DDoS-only backstop that must sit far above legitimate traffic.

The per-IP-per-form bucket is the workhorse: it stops an abuser without affecting anyone else.

## Layer 5 — guard the recipients (anti-relay)

A subtle one people miss: if a form lets the *submitter* choose who gets emailed (via a `_cc`/`_bcc` payload field, say), your form becomes a free email relay for spammers. The fix is a rule, not a filter: **never read CC/BCC from public payloads.** Configure notification recipients in the form's settings instead, and require that recipients be verified on the owning account — so a form can't be pointed at a stranger's inbox.

## Layer 6 — content filtering, with a safety rule

Finally, a content pipeline (keyword/regex, link limits, Akismet, an ML classifier) catches what the structural defenses miss. The one rule that matters for a *leads* form: it must never silently drop a real submission. Content-flagged-but-uncertain messages should be delivered and labeled, not deleted — otherwise your spam filter quietly costs you business. (More on that in [why a form backend should fail open](/blog/ml-quarantine-explained).)

## The order to add them

1. **Honeypot** — free, do it now.
2. **Origin allowlist** — lock it to your domains.
3. **Recipient guards** — settings-only recipients, verified addresses.
4. **Rate limits** — per-IP-per-form is the key one.
5. **CAPTCHA** — on for the forms that need it, off elsewhere.
6. **Content pipeline** — last, and never fail-closed on leads.

Done in that order, you stop the overwhelming majority of abuse before a real user ever sees a challenge.

[Get a hardened endpoint by default](https://login.ollastack.com/register) — the honeypot, rate limits, recipient guards, and content pipeline are built in; you choose the origins and whether CAPTCHA is on.

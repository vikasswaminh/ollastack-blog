---
title: "DKIM, SPF & DMARC for form notifications"
description: "Form notifications from your domain reach the inbox only if SPF, DKIM and DMARC align. What each does, the DNS you need, and the mistakes that cause spam."
date: 2026-07-23
updated: 2026-06-19
tags: ["deliverability", "dkim", "spf", "dmarc", "guide"]
author: "Ollastack"
readingTime: 9
draft: false
---

You set up a custom sender domain so form notifications arrive from `you@yourcompany.com` instead of a shared platform address — more trustworthy, better branding. Then they start landing in spam. The fix is almost always the email authentication trio: SPF, DKIM, and DMARC. Here's what each does and how to get them right.

## The 30-second version

When a receiving server (Gmail, Outlook) gets a message claiming to be from your domain, it asks three questions:

- **SPF** — "Is the server that sent this allowed to send for this domain?"
- **DKIM** — "Is this message cryptographically signed by the domain, and untampered?"
- **DMARC** — "If SPF or DKIM fails, what should I do — and where do I report it?"

Pass SPF and DKIM with alignment, and DMARC is satisfied. Fail them, and a strict DMARC policy tells the receiver to reject or quarantine. Getting all three right is the difference between the inbox and the spam folder.

## SPF — authorize the sender

SPF is a TXT record listing who may send for your domain. If you send notifications through a provider, you `include` theirs:

```
yourdomain.com.  TXT  "v=spf1 include:_spf.theprovider.com ~all"
```

Two common mistakes:

- **More than one SPF record.** You may have exactly one `v=spf1` TXT record. Multiple records = SPF permerror = fail. Merge the `include`s into one.
- **The 10-lookup limit.** SPF allows at most 10 DNS lookups; too many nested `include`s breaks it. Flatten if you're near the limit.

## DKIM — sign the message

DKIM publishes a public key as a DNS record; the sender signs each message with the matching private key, and the receiver verifies the signature. Your provider gives you the record(s) to publish — usually a `CNAME` or `TXT` at a selector subdomain:

```
selector._domainkey.yourdomain.com.  CNAME  selector.dkim.theprovider.com.
```

DKIM is the strongest of the three because it survives forwarding (SPF doesn't) and proves the body wasn't altered. Publish exactly what the provider gives you — a single wrong character means no signature.

## DMARC — set the policy

DMARC ties it together and tells receivers what to do on failure:

```
_dmarc.yourdomain.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@yourdomain.com"
```

Start at `p=none` (monitor only — collect reports, change nothing), confirm your legitimate mail is passing, then move to `p=quarantine` and eventually `p=reject`. Jumping straight to `p=reject` before you've verified alignment is how teams accidentally block their own email.

**Alignment** is the subtle part: DMARC requires that the domain in the visible `From:` matches the domain that passed SPF/DKIM. A message can pass SPF for the provider's domain but still fail DMARC because it isn't *aligned* with your `From:` domain. Custom-sender setups are designed to align; a misconfigured one won't.

## Verify before you trust it

After publishing, send yourself a test and check the headers (Gmail: "Show original") for `spf=pass`, `dkim=pass`, `dmarc=pass`. With Ollastack, the sender-domain status panel reports `verified` / `pending` / `not added` so you don't have to read raw headers — it polls the provider for you. Don't move DMARC to `reject` until you see all three passing on real notifications.

## The common failures, in order of how often they bite

1. **Two SPF records** → permerror. Merge to one.
2. **DKIM record copied with a typo or wrapped/truncated** → no signature. Paste exactly.
3. **DMARC `p=reject` set before verifying alignment** → your own mail blocked. Start at `none`.
4. **Apex vs subdomain confusion** → publishing records on the wrong host. Match exactly what the provider specifies.
5. **Sending from an unverified domain** → falls back to the platform sender (which *is* authenticated), so it still delivers — but not from your brand.

## Where Ollastack fits

Notifications send from the platform's verified domain by default (so they reach the inbox out of the box). To send from *your* domain, configure a custom sender domain (or per-tenant SMTP) and publish the SPF/DKIM records above; the status panel flips to `verified` once DNS propagates. If your own domain ever fails, delivery transparently falls back to the platform sender — so a DNS mistake degrades branding, never delivery.

[Set up your sender domain](https://login.ollastack.com/register) and check its status from the dashboard.

---
title: "Per-tenant SMTP: send from each customer's own server"
description: "Building forms for clients? Send notifications from each customer's domain. What per-tenant SMTP is, when to use it, and the fallback that prevents lost mail."
date: 2026-07-31
updated: 2026-06-19
tags: ["smtp", "deliverability", "agencies", "guide"]
author: "Ollastack"
readingTime: 7
draft: false
faq:
  - q: "What is per-tenant SMTP?"
    a: "It lets each tenant send notification email through their own SMTP server, so mail sends from their domain and reputation instead of yours — ideal for agencies and white-label products."
  - q: "What if a tenant's SMTP fails?"
    a: "Delivery transparently falls back to the platform sender, so a tenant outage degrades branding for those messages but never loses the mail."
  - q: "When should I use it vs a custom sender domain?"
    a: "Custom sender domain is the single-brand answer; per-tenant SMTP is for multiple customers who each need to send from their own domain."
---

If you build forms on behalf of clients — an agency, a white-label SaaS, a platform with its own customers — there's a deliverability and branding problem hiding in the notification email: whose domain does it send from? If every client's lead notification comes from *your* platform's address, you own their deliverability reputation and their branding looks off. Per-tenant SMTP fixes that.

## What it is

Per-tenant SMTP lets each tenant (org/customer) route their notification emails through **their own SMTP server**, so mail sends from `notifications@theirdomain.com` using their credentials and their sending reputation — not yours. The platform stores the tenant's SMTP config (encrypted) and uses it when dispatching that tenant's notifications, autoresponders, and digests.

## When to use it (and when not to)

Use per-tenant SMTP when:

- **You're an agency or white-label** and each client should send from their own domain.
- **A customer has an existing transactional provider** (their own SendGrid/Mailgun/SES) and wants form mail to go through it for consistent reputation and logging.
- **Compliance or branding** requires mail to originate from the customer's infrastructure.

You *don't* need it for a single-brand product — a custom sender domain on the platform's sending infrastructure is simpler and gets you branded mail without managing per-tenant credentials. Per-tenant SMTP is specifically the multi-customer answer.

## How it's configured

Per organization, the tenant provides their SMTP details — host, port, username, password — which are **encrypted at rest** (you're holding a credential, so this matters). From then on, that org's outbound notifications route through their server. The submitter sees mail from the tenant's domain; you never touch their reputation.

A typical tenant config:

```
host: smtp.theirprovider.com
port: 587
username: notifications@theirdomain.com
password: ••••••••   (encrypted at rest)
```

Pair it with the tenant's own SPF/DKIM/DMARC on their domain (see [DKIM, SPF & DMARC](/blog/dkim-spf-dmarc-custom-sender)) so their mail authenticates and lands in the inbox.

## The fallback that prevents lost mail

The operational risk with per-tenant SMTP is obvious: a tenant's server goes down or their credentials rotate, and now *their* form notifications fail. The design that makes this safe is **transparent fallback**: when a tenant's SMTP send fails — no config, marked unhealthy, or an error at send time — delivery automatically falls back to the platform's default sender, so the notification still goes out (just from the platform address that send, not the tenant's). A misconfigured or down tenant server degrades *branding* for those messages, never *delivery*.

That fallback is what makes per-tenant SMTP operable at all. Without it, every tenant's SMTP outage becomes your support ticket and their lost lead.

## Tiers of "send from my domain", in increasing control

It helps to see the options as a ladder:

1. **Platform sender (default).** Mail from the platform's verified domain. Zero setup, lands in the inbox. Fine for many.
2. **Custom sender domain.** Mail from *your* domain via the platform's sending infrastructure — branded, with your SPF/DKIM. The single-brand answer.
3. **Per-tenant SMTP.** Each tenant sends through *their own* server. The multi-customer/white-label answer, with the fallback above.

Most products start at 1, paid single-brand products move to 2, and platforms-with-customers reach for 3.

## The takeaway

If you're sending form notifications on behalf of other people's brands, per-tenant SMTP is how each one sends from their own domain and owns their own reputation — with a fallback so a tenant's outage never silently loses their leads. If you're a single brand, a custom sender domain is the simpler path to the same branded result.

[Explore sender options](https://login.ollastack.com/register) — platform sender, custom domain, or per-tenant SMTP, all on the same forms.

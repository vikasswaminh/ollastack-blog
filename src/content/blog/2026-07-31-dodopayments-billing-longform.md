---
draft: true
title: "Self-serve billing and subscriptions — how Ollastack uses DodoPayments (4,000+ words)"
description: "Overview of how self-serve billing works with DodoPayments and the upgrade flow from marketing to the Ollastack dashboard."
date: 2026-07-31
tags: [billing, subscriptions, dodopayments, self-serve, longform]
author: "Ops"
readingTime: 20
canonical: "/blog/dodopayments-billing-integration"
ogImage: "/assets/og/dodopayments.png"
faq:
  - q: "How does upgrading to a paid plan work?"
    a: "From the dashboard billing page you pick a plan and are sent to a DODO Payments checkout; on payment, a signed webhook upgrades your organization's plan immediately. Cancel any time from the same page."
  - q: "What payment methods are supported?"
    a: "Subscriptions are billed through DODO Payments (cards). Your new quota applies immediately on upgrade, with no overage charges — if you hit the cap, submissions pause until the next cycle or an upgrade."
  - q: "Can I cancel or change my plan?"
    a: "Yes — self-serve from the billing page. Canceling skips the next cycle and drops you back to the free tier's quota; your existing data stays accessible."
---

TL;DR

Ollastack uses DodoPayments for self-serve subscription billing. This guide covers the checkout flow, webhook integration for plan upgrades, plan quotas, and the upgrade path from marketing to the dashboard.

-----

Section 1 — Checkout flow

Users click Upgrade on the pricing page, are redirected to DodoPayments checkout, complete payment, and are redirected back to the dashboard with their plan upgraded.

Section 2 — Webhook integration

DodoPayments sends Standard-Webhooks-signed webhooks to /api/webhooks/dodo on payment success. Ollastack upgrades the org plan on receipt.

Section 3 — Plan quotas

Free: 100 submissions. Solo: 2,000 submissions. Team: 20,000 submissions. Agent submissions count against normal quotas.

Section 4 — Upgrade path from marketing

The pricing CTA leads to /upgrade?plan=X, which redirects authenticated users to /dashboard/billing and anonymous users to /register.

FAQ

Q: What payment methods does DodoPayments accept?
A: Cards, PayPal, and other methods supported by DodoPayments.

Resources

- Pricing page: /pricing
---
title: "Migrate Formspree webhooks to Ollastack (Node.js)"
description: "Move a Formspree webhook consumer to Ollastack in Node — verify the new HMAC signature, map the payload, and gain retries and replay you couldn't have before."
date: 2026-08-18
updated: 2026-06-22
tags: ["migration", "formspree", "webhooks", "nodejs"]
author: "Ollastack"
readingTime: 7
draft: false
faq:
  - q: "How do I migrate a Formspree webhook to Ollastack?"
    a: "Point the webhook at your existing consumer, switch signature verification to the X-Ollastack-Signature HMAC-SHA256 header, and map the payload (the submission fields live under a data object). Retries and replay are handled for you."
  - q: "Is the webhook payload the same as Formspree's?"
    a: "Close but not identical — the submission fields arrive as JSON, typically under a data object, plus metadata. Update the few field paths your handler reads; the values themselves carry over."
  - q: "What happens if my consumer is down?"
    a: "Deliveries retry on a backoff ladder (up to 5 attempts), and you can replay the exact stored payload from the dashboard after fixing the consumer — neither of which Formspree's fire-and-forget webhook offered."
---

If you forwarded Formspree submissions to a webhook, migrating the consumer to Ollastack is mostly a signature-and-mapping change — and you gain retries and replay you didn't have before. Here's the Node.js version.

## What changes (and what doesn't)

Your consumer still receives a POST with the submission as JSON. Three things change:

- **The signature header.** Verify `X-Ollastack-Signature` (HMAC-SHA256 of the raw body) instead of Formspree's scheme.
- **The payload shape.** Fields arrive as JSON, typically under a `data` object, alongside metadata — so update the paths your handler reads.
- **Reliability.** Failed deliveries retry automatically, and you can replay a stored payload from the dashboard.

## Verify the new signature

Compute the HMAC of the **raw** body (not the parsed object) with your webhook secret and compare in constant time:

```js
import express from "express";
import { createHmac, timingSafeEqual } from "node:crypto";

const app = express();
// keep the raw body so the signature matches byte-for-byte
app.use(express.json({ verify: (req, _res, buf) => (req.rawBody = buf) }));

function verify(req) {
  const sig = req.get("x-ollastack-signature") || "";       // "sha256=<hex>" or "v1=<hex>"
  const expected = createHmac("sha256", process.env.OLLASTACK_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest("hex");
  const a = Buffer.from(sig.replace(/^(sha256=|v1=)/, ""));
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
```

## Map the payload

```js
app.post("/webhooks/ollastack", (req, res) => {
  if (!verify(req)) return res.status(401).send("bad signature");

  const submission = req.body.data ?? req.body;   // fields live under data
  const { email, message } = submission;          // your original field names

  // ... your existing processing (CRM, Slack, queue) ...
  res.sendStatus(200);                            // 2xx = delivered; non-2xx triggers retry
});

app.listen(8080);
```

The field names you used on Formspree carry over — you mostly change *where* you read them from (`req.body.data`), not the keys.

## Retries and replay (the upgrade)

Return any non-2xx and the delivery **retries** on a backoff ladder (up to 5 attempts). After you fix a bug, open the delivery history and **replay** the exact stored payload as a fresh delivery — so a deploy that broke your consumer for an hour doesn't mean lost events. Formspree's fire-and-forget POST couldn't do either. The full model is in [form webhooks done right](/blog/form-webhooks-guide).

## Cut over safely

1. Add the webhook URL in the form settings and send a test submission.
2. Confirm a delivery row with a recorded 2xx attempt.
3. Run both old and new webhooks briefly if you're cautious, then remove the Formspree one.

The form-side migration (endpoint swap, fields, notifications) is in the [step-by-step Formspree migration guide](/blog/migrate-from-formspree), and the gotchas in [Formspree migration pitfalls](/blog/formspree-migration-pitfalls).

## The takeaway

Migrating a Formspree webhook to Node is a signature swap plus a small payload remap — and you come out with automatic retries and one-click replay that Formspree never had.

[Create a form with webhooks](https://login.ollastack.com/register) — signed, retried, replayable, free to start.

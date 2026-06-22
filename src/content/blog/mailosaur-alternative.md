---
title: "Mailosaur alternative: inbox + OTP testing in CI"
description: "Disposable test inboxes that prove your OTP or magic link arrived — create, long-poll, assert on the extracted code. vs Mailosaur, MailSlurp & Mailsac."
date: 2026-06-26
updated: 2026-06-19
tags: ["testing", "ci", "email", "comparison"]
author: "Ollastack"
readingTime: 9
draft: false
faq:
  - q: "What's a good Mailosaur alternative for CI email testing?"
    a: "Ollastack provides disposable test inboxes with the same core flow — create an inbox, long-poll /wait for the message, assert on the auto-extracted code or link — and it's also a form backend and can host persistent agent identities. For pure email testing, Mailosaur, MailSlurp and Mailsac are also strong; evaluate on fit."
  - q: "How do I assert a verification email arrived in a test?"
    a: "Create a test inbox, use its address in your signup flow, then call the /wait endpoint to long-poll for the message and assert on codes[0] (the OTP) or links[0] (the verification URL) — no HTML scraping and no sleep-and-retry."
  - q: "Are test inboxes spam-filtered?"
    a: "No — test inboxes are deliberately never spam-filtered, so a test sees every message it triggered, even a strict-looking transactional email. Persistent agent inboxes are filtered; that's a separate mode."
  - q: "Can I isolate parallel test runs?"
    a: "Yes — spin a fresh disposable inbox per test, or use a subaddress tag (+run123@…) on a shared inbox and filter by it. Bulk-clear between runs and set a retention window."
---

If your signup flow sends a verification code, your password reset sends a link, or your billing sends a receipt, you eventually want a test that proves the email *actually arrived* — not just that your code called `sendEmail()`. That's what email-testing services are for, and Mailosaur is the best known. Ollastack does the same job as part of a broader platform, with an API designed for agents and CI.

## What "email testing in CI" actually needs

A useful inbox-testing API is three operations:

1. **Get a throwaway address** you can send to.
2. **Wait for a message** to arrive (without polling in a busy loop).
3. **Pull the important bits out** — the OTP code, the verification link — so your test can assert on them.

Everything else is detail. Here's all three with Ollastack.

## A complete CI example

```bash
# 1. Create a disposable test inbox -> a real receiving address
ID=$(curl -s -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"mode":"test","name":"signup-ci"}' | jq -r .data.id)

ADDR=$(curl -s https://login.ollastack.com/api/mailboxes/$ID \
  -H "Authorization: Bearer $TOKEN" | jq -r .data.address)

# 2. Trigger your app's signup using $ADDR (your app sends the OTP email)...

# 3. Long-poll for the message — returns as soon as it lands, up to 55s
MSG=$(curl -s "https://login.ollastack.com/api/mailboxes/$ID/wait?timeout=55" \
  -H "Authorization: Bearer $TOKEN")

# 4. Assert on the auto-extracted code / link
echo "$MSG" | jq '.data.codes, .data.links'
```

The `/wait` endpoint is the key ergonomic: it long-polls and returns the instant a message arrives, so your test doesn't sleep-and-retry. And `codes[]` / `links[]` are extracted for you — you assert on the OTP directly instead of regex-ing an HTML body.

In a Node test it reads about as cleanly:

```js
import { MailClient } from "@ollastack/client"; // (SDK; HTTP works everywhere)
const mail = new MailClient({ baseUrl: "https://login.ollastack.com", token: process.env.TOKEN });

const box = await mail.createInbox({ mode: "test", name: "signup-ci" });
await signUp(box.address);                       // your app
const msg = await mail.waitForEmail({ mailboxId: box.id, timeoutMs: 60000 });
expect(msg.codes[0]).toMatch(/^\d{6}$/);         // the OTP your app emailed
```

## Test inboxes vs agent identities

Ollastack has two mailbox modes, and the distinction matters for testing:

- **Test inboxes** (`mode: "test"`) — disposable, **never spam-filtered** (a test must see every message it triggered), and you can bulk-clear them between runs. This is the Mailosaur-equivalent.
- **Agent identities** (`mode: "agent"`) — persistent, chosen address, spam-filtered, can send and reply. This is for an AI agent that owns an email identity, not for CI assertions.

Token scopes keep them isolated: a CI token scoped `mail.test:*` can drive throwaway inboxes but **cannot** read or send from your persistent agent identities, and vice-versa. A leaked CI token can't reach production correspondence.

## How it compares

| | Mailosaur | MailSlurp | Mailsac | Ollastack |
|---|---|---|---|---|
| Disposable inbox API | ✅ | ✅ | ✅ | ✅ |
| Long-poll / wait for message | ✅ | ✅ | ✅ | ✅ `/wait` |
| Auto-extract codes & links | ✅ | partial | — | ✅ `codes[]`/`links[]` |
| Inbound webhooks on arrival | ✅ | ✅ | ✅ | ✅ signed |
| Also a form backend | — | — | — | ✅ |
| Agent identities (send/reply) | — | partial | — | ✅ |

The honest framing: if you only need email testing and nothing else, the dedicated services are excellent and you should evaluate them on their own merits. Ollastack makes sense when the same platform also handles your form submissions and you'd rather not run two vendors — or when you specifically want the agent-identity side (an LLM agent that sends and receives mail under a real, spam-filtered address).

## Things people get wrong

- **Polling in a tight loop.** Use `/wait` (or the inbound webhook) instead of hammering the list endpoint.
- **Reusing one inbox across parallel tests.** Either spin a fresh inbox per run, or use the subaddress tag filter (`+run123@…`) to isolate a run's mail.
- **Asserting on raw HTML.** Assert on `codes[]` / `links[]` — they survive template changes that would break a brittle regex.

Want to wire it into your suite? [Grab a token](https://login.ollastack.com/register) and the [Agent Mail docs](https://login.ollastack.com/api/openapi.json) describe every endpoint — your test runner can read the OpenAPI spec directly.

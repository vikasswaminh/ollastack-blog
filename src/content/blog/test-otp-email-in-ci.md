---
title: "How to test OTP and verification emails in CI (the reliable way)"
description: "Testing that your app actually delivers the OTP, magic link, or reset email is where suites get flaky. Here's a reliable pattern with disposable inboxes: long-poll for the message, assert on the extracted code, isolate parallel runs, and clean up."
date: 2026-07-09
updated: 2026-06-19
tags: ["testing", "ci", "otp", "email", "guide"]
author: "Ollastack"
readingTime: 9
draft: false
---

"Did the email actually arrive?" is one of the most valuable things to test and one of the most commonly skipped — because doing it badly produces a flaky suite everyone learns to ignore. This is the pattern that doesn't flake. (For a tool-by-tool comparison, see [the Mailosaur alternative post](/blog/mailosaur-alternative); this one is the how-to.)

## Why naive email tests flake

The three classic mistakes:

1. **Mocking `sendEmail()`.** This tests that your code *called* the function, not that an email was delivered, templated correctly, and contained the right code. The interesting bugs live in the gap.
2. **Sleeping then polling.** `sleep(5000)` then checking an inbox is slow and racy — too short and you miss the email, too long and your suite crawls.
3. **Regex-ing raw HTML.** A template tweak breaks a test that has nothing to do with the change.

The fix for all three: a real disposable inbox, a long-poll that returns the instant the message lands, and structured extraction of the code/link.

## The pattern, end to end

```js
import { MailClient } from "@ollastack/client"; // HTTP works in any language
const mail = new MailClient({ baseUrl: "https://login.ollastack.com", token: process.env.TOKEN });

test("signup sends a 6-digit OTP", async () => {
  // 1. A fresh, real receiving address
  const box = await mail.createInbox({ mode: "test", name: "signup" });

  // 2. Drive your app — it emails the OTP to box.address
  await signUp(box.address);

  // 3. Long-poll: returns the moment the email arrives (no sleeps)
  const msg = await mail.waitForEmail({ mailboxId: box.id, timeoutMs: 60000 });

  // 4. Assert on the EXTRACTED code, not the HTML
  expect(msg.codes[0]).toMatch(/^\d{6}$/);
});
```

`codes[]` and `links[]` are pulled out of the message for you, so a template change that keeps the code intact doesn't break the test. The same shape works for a magic link:

```js
test("password reset sends a working link", async () => {
  const box = await mail.createInbox({ mode: "test", name: "reset" });
  await requestReset(box.address);
  const msg = await mail.waitForEmail({ mailboxId: box.id, timeoutMs: 60000 });

  const resetUrl = msg.links.find((l) => l.includes("/reset"));
  expect(resetUrl).toBeTruthy();
  // ...then drive a browser to resetUrl and assert the flow completes.
});
```

## Isolating parallel test runs

The mistake that bites once you parallelize: two runs share an inbox and read each other's emails. Two clean fixes:

- **A fresh inbox per test** (cheap — they're disposable).
- **One inbox, isolated by subaddress tag.** Send to `slug+run123@…` and filter `?tag=run123`. A unique tag per run keeps each run's mail separate without provisioning new inboxes.

```js
// fetch only THIS run's messages
const msgs = await mail.listMessages({ mailboxId: box.id, tag: process.env.RUN_ID });
```

## Cleaning up between runs

Disposable inboxes accumulate. Clear an inbox in one call so a run starts clean:

```bash
curl -X DELETE "https://login.ollastack.com/api/mailboxes/$ID/messages" \
  -H "Authorization: Bearer $TOKEN"   # -> { cleared: N }
```

Test inboxes also have a retention policy, so stale messages purge on their own — but an explicit clear at the start of a suite removes ambiguity.

## Prefer push? Use the inbound webhook

If your test harness is event-driven, register a webhook on the inbox and get a signed POST the moment mail arrives, instead of polling. `/wait` is simpler for a linear test; the webhook is better for a queue-based runner.

## A note on scope hygiene

Use a token scoped **`mail.test:*`** for CI. It can drive throwaway inboxes but cannot read or send from your persistent agent identities — so a leaked CI token can't reach real correspondence. (Agent identities use a separate `mail.agent:*` scope.) This separation is enforced server-side.

## The checklist

- ✅ Send to a **real** disposable address, not a mock.
- ✅ Use **`/wait`** (or the webhook), never sleep-and-poll.
- ✅ Assert on **`codes[]` / `links[]`**, not raw HTML.
- ✅ **Isolate** parallel runs (fresh inbox or `+tag`).
- ✅ **Clear** the inbox at suite start.
- ✅ Scope the CI token to **`mail.test:*`**.

Do those six and "did the email arrive?" becomes one of the most reliable tests in your suite instead of the flakiest.

[Grab a token](https://login.ollastack.com/register) and point your runner at the OpenAPI spec (`/api/openapi.json`) — it documents every mailbox endpoint.

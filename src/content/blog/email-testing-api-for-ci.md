---
title: "Email testing API: assert on real emails in CI"
description: "An email testing API gives your tests a real inbox over HTTP, so CI can prove the welcome, receipt, or reset email arrived. What it is and how to wire it in."
date: 2026-08-13
updated: 2026-06-21
tags: ["testing", "ci", "email", "email-testing-api", "guide"]
author: "Ollastack"
readingTime: 8
faq:
  - q: "What is an email testing API?"
    a: "An API that gives your tests a real inbox they read over HTTP, so CI can prove an email actually arrived and contained the right code, link or copy — without running a mail server."
  - q: "How is it different from mocking the mailer?"
    a: "Mocking proves your code called send(). An email testing API does a real round-trip, catching broken templates, bad links, and emails that silently fail to send."
  - q: "Does it work in any CI?"
    a: "Yes — it's plain HTTP, so it drops into GitHub Actions, GitLab or CircleCI with just an API token, no service container."
---

Most test suites stop at "we called `sendEmail()`." But the thing that actually breaks in production is everything *after* that call — a bad template variable, a broken link, a deliverability misconfig, an email that never sends at all. An **email testing API** closes that gap: it gives your tests a real inbox they can read over HTTP, so a CI run can assert that the email arrived and contained the right code, link, or copy. No mail server to run, no manual checking.

## What an email testing API actually is

It's three capabilities behind an HTTP API:

1. **Create a real inbox** with a real, receiving address — on demand, per test.
2. **Receive** whatever your app sends to that address.
3. **Read it programmatically** — the subject, bodies, and (ideally) pre-extracted one-time codes and links — so a test can assert on them.

That's the difference from a transactional *sending* API (SendGrid/Postmark) — those send mail out; an email *testing* API receives it and hands it back to your test as data.

## Why not just mock the mailer?

Mocking `sendEmail()` proves your code *tried* to send. It cannot catch:

- A template that renders `Hello {{name}}` literally.
- A verification link pointing at `localhost` or a stale domain.
- An email that silently fails to send (auth, SPF/DKIM, a provider outage).
- The OTP landing in a different format than your regex expects.

A real round-trip — app → inbox → assertion — catches all of those. Mocks test your intent; an email testing API tests reality.

## The pattern

```js
// 1. Create a disposable inbox for this test
const inbox = await fetch("https://login.ollastack.com/api/mailboxes", {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ name: "signup-test", mode: "test" }),
}).then((r) => r.json());
// → { id, address: "a1b2c3@test.ollastack.com" }

// 2. Drive your app with that address (sign up, request a reset, etc.)
await signupWith(inbox.address);

// 3. Long-poll for the email — blocks until it arrives, no busy-waiting
const msg = await fetch(
  `https://login.ollastack.com/api/mailboxes/${inbox.id}/wait?timeout=60`,
  { headers: { Authorization: `Bearer ${TOKEN}` } },
).then((r) => r.json());

// 4. Assert on real, extracted data — not scraped HTML
expect(msg.subject).toContain("Verify your email");
expect(msg.codes[0]).toMatch(/^\d{6}$/);
expect(msg.links[0]).toContain("/verify?token=");
```

The two things that make this reliable: **`wait` long-polls** (it returns the instant the mail lands, so the test isn't a flaky `sleep`), and the inbox **extracts `codes` and `links`** for you (so you assert on `codes[0]`, never a brittle body regex).

## What makes it CI-safe

- **Disposable + isolated** — one inbox per test (or use sub-addressing) so parallel runs don't read each other's mail.
- **Unfiltered** — a test inbox is *never* spam-filtered, so a test sees every message it triggered, even a spam-shaped one.
- **Cleanup** — bulk-clear an inbox between runs and set a retention window so old test mail purges itself.
- **One token** — the same API key your app and agents use; no separate mail-server credentials in CI.

## Wire it into a pipeline

The whole thing is HTTP, so it drops into any CI (GitHub Actions, GitLab, CircleCI) with just an `OLLASTACK_API_TOKEN` secret — no service container, no SMTP sink to stand up. For the OTP-specific flow see [testing OTP & verification emails in CI](/blog/test-otp-email-in-ci); for end-to-end browser tests see [asserting on email in Playwright & Cypress](/blog/assert-on-email-in-playwright-cypress); for a tool-by-tool comparison see [the Mailosaur alternative](/blog/mailosaur-alternative).

## The takeaway

An email testing API turns "did the email actually send, and was it right?" from an untested gap into a normal assertion — a real inbox your CI reads over HTTP, with codes and links extracted, no mail server to operate. If your product sends email that matters, this is the test you're probably missing.

[Get a test inbox](https://login.ollastack.com/register) — disposable, unfiltered, HTTP-readable, free to start.

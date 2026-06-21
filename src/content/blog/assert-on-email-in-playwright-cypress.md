---
title: "Assert on email in Playwright and Cypress (verification codes, magic links)"
description: "Your end-to-end test fills the signup form — then needs the verification email to continue. Here's how to read and assert on that email inside Playwright or Cypress: a disposable inbox, a long-poll, and the extracted code or link, no flaky sleeps."
date: 2026-08-15
updated: 2026-06-21
tags: ["testing", "playwright", "cypress", "email", "tutorial"]
author: "Ollastack"
readingTime: 7
draft: false
---

End-to-end tests hit a wall at email. The test fills the signup form, clicks submit — and now the flow depends on a verification code or magic link that arrives by email, outside the browser. Skipping it leaves your most important flow untested; faking it with a fixed `sleep` and a guessed code makes the suite flaky. Here's how to read the real email inside Playwright or Cypress and assert on it.

## The shape of the solution

You need an inbox your test controls, addressable per run, that you can read over HTTP from inside the test. A **disposable test inbox** does exactly that: create one, use its address in the form, then long-poll for the message and read the extracted code or link. Three calls, no mail server.

## Playwright

```ts
import { test, expect, request } from "@playwright/test";

const API = "https://login.ollastack.com";
const TOKEN = process.env.OLLASTACK_API_TOKEN!;

test("user can sign up and verify by email", async ({ page }) => {
  const api = await request.newContext({
    baseURL: API,
    extraHTTPHeaders: { Authorization: `Bearer ${TOKEN}` },
  });

  // 1. Disposable inbox for this test
  const inbox = await (
    await api.post("/api/mailboxes", { data: { name: "e2e-signup", mode: "test" } })
  ).json();

  // 2. Drive the UI with its address
  await page.goto("/signup");
  await page.fill('[name="email"]', inbox.address);
  await page.fill('[name="password"]', "S3curePass!");
  await page.click('button[type="submit"]');

  // 3. Long-poll for the verification email (no sleep)
  const msg = await (
    await api.get(`/api/mailboxes/${inbox.id}/wait?timeout=60`)
  ).json();

  // 4. Assert + continue the flow with the real code/link
  expect(msg.subject).toContain("Verify");
  await page.goto(new URL(msg.links[0]).pathname); // or type msg.codes[0] into a 2FA field
  await expect(page.getByText("Email verified")).toBeVisible();
});
```

## Cypress

Cypress runs commands in the browser, so make the HTTP calls with `cy.request` and a tiny poll via recursion (or `cypress-recurse`):

```js
const API = "https://login.ollastack.com";
const auth = { Authorization: `Bearer ${Cypress.env("OLLASTACK_API_TOKEN")}` };

const waitForMail = (id) =>
  cy.request({ url: `${API}/api/mailboxes/${id}/wait?timeout=60`, headers: auth })
    .its("body");

it("signs up and verifies by email", () => {
  cy.request({ method: "POST", url: `${API}/api/mailboxes`, headers: auth,
    body: { name: "e2e-signup", mode: "test" } }).its("body").then((inbox) => {

    cy.visit("/signup");
    cy.get('[name="email"]').type(inbox.address);
    cy.get('[name="password"]').type("S3curePass!");
    cy.get('button[type="submit"]').click();

    waitForMail(inbox.id).then((msg) => {
      expect(msg.subject).to.contain("Verify");
      cy.visit(new URL(msg.links[0]).pathname);   // or use msg.codes[0]
      cy.contains("Email verified");
    });
  });
});
```

## The two things that kill flakiness

1. **`wait` instead of `sleep`.** The long-poll returns the moment the email arrives. A fixed `cy.wait(5000)` either slows every run or races on a slow send — `wait` does neither.
2. **`codes[0]` / `links[0]` instead of body regex.** The inbox extracts the one-time code and the URLs, so you assert on structured data, not a brittle `/\d{6}/` against HTML that changes.

## Keeping CI clean

- **One inbox per test** (or sub-address a shared one) so parallel specs don't cross-read.
- **Unfiltered by design** — test inboxes are never spam-filtered, so a strict-looking transactional email is never dropped from under your assertion.
- **Bulk-clear + retention** so test mail doesn't accumulate.

Same `OLLASTACK_API_TOKEN` secret your app uses; nothing extra to run in CI. The broader pattern is in [email testing API for CI](/blog/email-testing-api-for-ci) and [testing OTP emails](/blog/test-otp-email-in-ci).

## The takeaway

Email assertions belong in your E2E suite, not in a manual checklist. With a disposable inbox, a long-poll, and extracted codes/links, Playwright or Cypress can verify the real signup-and-verify flow end to end — without a mail server and without flake.

[Add email assertions to your suite](https://login.ollastack.com/register) — a test inbox is free and HTTP-readable.

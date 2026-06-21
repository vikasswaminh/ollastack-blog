---
title: "Free OTP email API: send and verify codes"
description: "A free OTP email API to send one-time codes and verify them by reading the email back — with the code extracted for you, so you never scrape HTML."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "otp", "free", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "Is there a free OTP email API?"
    a: "Yes. Ollastack's free tier lets you send one-time-code emails and — because every mailbox also receives — read the code back to verify delivery, with no credit card."
  - q: "How do I verify an OTP email actually arrived?"
    a: "Send to a test inbox, long-poll the wait endpoint, and read the extracted codes[0] from the response. That proves the OTP sent, rendered, and arrived — not just that your code called send()."
  - q: "Does it extract the code, or do I parse the email?"
    a: "It extracts. Each received message includes a codes array (one-time codes pulled out) and a links array, so you assert on codes[0] instead of regexing HTML that changes."
  - q: "Can I use it to test 2FA flows in CI?"
    a: "Yes. Disposable test inboxes are never spam-filtered, so a CI test can trigger a signup or login and reliably read the OTP it produced."
---

If your app sends one-time codes, you need two things: a way to **send** the OTP email, and a way to **verify** it actually arrived and rendered. A free OTP email API does both — send the code, then read it back from a real inbox, with the code already extracted for you.

## Send a one-time code

```bash
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_.../send \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Your code","text":"Your code is 920184"}'
```

That's the send half. The half most tools skip is proving it landed.

## Verify by reading the code back

Send to a disposable **test inbox**, then long-poll and read the extracted code — no HTML scraping:

```bash
# 1. a test inbox
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"otp-test","mode":"test"}'
# → { "id":"mbx_x", "address":"a1b2c3@test.ollastack.com" }

# 2. trigger your real OTP flow to that address, then:
curl "https://login.ollastack.com/api/mailboxes/mbx_x/wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
# → { "subject":"Your code", "codes":["920184"], "links":[] }
```

`codes[0]` is the OTP, extracted. You assert on it directly.

## Why extraction matters

OTP emails render the code a dozen ways — `123 456`, inside a button, split across tags. Regexing the body is how OTP tests go flaky. The inbox pulls the code into `codes[]` for you, so the test is reliable. Same for magic links via `links[]`.

## Test 2FA in CI

Because test inboxes are **never spam-filtered**, a CI run sees every code it triggers. This is the reliable pattern for testing signup, login, and reset flows — see [test OTP & verification emails in CI](/blog/test-otp-email-in-ci) and [the email testing API](/blog/email-testing-api-for-ci).

The free tier covers this with no credit card. See the [email API overview](/email-api).

[Send and verify OTPs free](https://login.ollastack.com/register).

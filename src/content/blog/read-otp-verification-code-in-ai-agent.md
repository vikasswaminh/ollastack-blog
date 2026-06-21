---
title: "How to read an OTP / verification code in an AI agent"
description: "When an AI agent signs up for a service or verifies an account, it has to read the one-time code from an email. Here's how to do it reliably: give the agent an inbox, long-poll for the message, and read the pre-extracted code — no HTML scraping."
date: 2026-08-11
updated: 2026-06-21
tags: ["ai-agents", "email", "otp", "tutorial"]
author: "Ollastack"
readingTime: 7
draft: false
---

A huge fraction of agent tasks stall at the same place: a service emails a one-time code or a verification link, and the agent has no inbox to read it from. Giving the agent an email address solves the *receiving* part; reading the **code** out of the message reliably is the part people get wrong by scraping HTML. Here's the clean way.

## The problem with scraping the body

The naive approach — fetch the email, regex `\d{6}` out of the body — breaks constantly. Codes show up as `123 456`, inside a button's `href`, split across HTML tags, or next to an unrelated number ("Order #4821, your code is 920184"). An agent that guesses wrong silently fails the whole flow. The fix is to not scrape at all: have the inbox **extract** the codes and links for you.

## The pattern: inbox → wait → read the code

**1. Give the agent an inbox.** For a one-off verification during a live task, a disposable mailbox is perfect; for a persistent account, use an agent mailbox.

```bash
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"signup","mode":"test"}'
# → { "id":"mbx_x", "address":"a1b2c3@test.ollastack.com" }
```

Use that address as the email when the agent signs up for the target service.

**2. Trigger the action, then wait for the email.** `wait` long-polls — it blocks until the verification email lands (or times out), so you don't busy-poll:

```bash
curl "https://login.ollastack.com/api/mailboxes/mbx_x/wait?timeout=120" \
  -H "Authorization: Bearer $TOKEN"
```

**3. Read the extracted code — don't parse the body.** The response carries `codes` (one-time codes already pulled out) and `links` (verification URLs):

```json
{
  "id": "msg_…",
  "from": "noreply@theservice.com",
  "subject": "Your verification code",
  "codes": ["920184"],
  "links": ["https://theservice.com/verify?token=…"]
}
```

The agent uses `codes[0]` for an OTP, or follows `links[0]` for a click-to-verify flow. No regex, no tag-stripping, no guessing.

## In an agent's tool loop

With the [Ollastack MCP server](/blog/build-ai-agent-that-sends-and-receives-email) connected, this is three tool calls the model makes itself — `createMailbox` → `waitForMailMessage` → read `codes[0]`. In a framework, it's the same three HTTP calls. Either way the agent can complete a signup or 2FA step end to end:

```python
mbx = api.post("/api/mailboxes", json={"name": "signup", "mode": "test"}).json()
# ... agent submits mbx["address"] to the target signup form ...
msg = api.get(f"/api/mailboxes/{mbx['id']}/wait", params={"timeout": 120}).json()
code = msg["codes"][0]          # ready to type into the 2FA field
```

## Test inbox vs agent inbox for OTPs

- **Test mailbox** (`mode:"test"`, `@test.ollastack.com`) — disposable and **never spam-filtered**, so it sees every message including the ones a filter might flag. Right for one-off verifications and CI. See [testing OTP email in CI](/blog/test-otp-email-in-ci).
- **Agent mailbox** (`mode:"agent"`) — persistent identity, spam-filtered, for an account the agent keeps using over time. The OTP read works identically; the inbox just persists.

## Reliability notes

- **`wait` over polling** — one long-poll call beats a retry loop; it returns the instant the mail arrives.
- **Extraction over scraping** — `codes`/`links` are computed for you; treat the raw body as a last resort.
- **Filtering** — for OTP flows prefer a test inbox so a strict sender's mail is never filtered out from under you.

## The takeaway

To read an OTP in an agent: give it an inbox, `wait` for the message, and read the pre-extracted `codes[0]` (or follow `links[0]`) — never scrape the HTML. It turns the step that stalls most agent flows into three reliable calls.

[Spin up a test inbox](https://login.ollastack.com/register) — free, disposable, and unfiltered so your agent always sees the code.

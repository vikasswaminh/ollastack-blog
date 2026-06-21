---
title: "Python email API: send and receive email (no smtplib)"
description: "A Python email API that sends AND receives over HTTP — no smtplib, no SMTP server. Here's the send and receive code with httpx or requests, OTP extraction, and why an API beats SMTP from Python."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "python", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "What's the simplest Python email API?"
    a: "An HTTP API you call with httpx or requests: POST to send, GET the wait endpoint to receive. One Bearer token, no smtplib, no SMTP server — and it can both send and receive."
  - q: "Can a Python email API receive mail, not just send?"
    a: "Yes. With an inbox API, GET the wait endpoint to long-poll for the next inbound message and read msg['codes'] or msg['text']. smtplib can only send; this also receives."
  - q: "httpx or requests — which?"
    a: "Either works. httpx supports sync and async with the same API; requests is the classic sync choice. The calls are identical apart from the client object."
  - q: "Is there a free tier?"
    a: "Yes — send and receive on the free tier with no credit card."
---

A Python email API done over HTTP beats `smtplib` on every axis that matters: no SMTP host or app password to manage, structured errors instead of connection exceptions, and — the big one — it can **receive** mail, which `smtplib` never could.

## Send and receive (httpx)

```python
import httpx

api = httpx.Client(
    base_url="https://login.ollastack.com",
    headers={"Authorization": "Bearer fmd_…"},
)

# create a mailbox once
mbx = api.post("/api/mailboxes",
               json={"name": "py", "mode": "agent", "handle": "py"}).json()

# send
api.post(f"/api/mailboxes/{mbx['id']}/send",
         json={"to": "user@example.com", "subject": "Hi", "text": "From Python."})

# receive the reply
msg = api.get(f"/api/mailboxes/{mbx['id']}/wait", params={"timeout": 60}).json()
print(msg["subject"], msg["codes"])   # OTP extracted for you
```

`requests` is the same with a `requests.Session()` carrying the auth header; `httpx` also gives you `AsyncClient` for async code.

## Why not smtplib

`smtplib` makes you own the SMTP transport — host, port 587, `starttls()`, credentials, timeouts — and only sends. The API is one call that returns a `msg_…` id or a clear error, and it receives too. For OTP flows you read `codes[0]` instead of scraping HTML — see [read an OTP code in an agent](/blog/read-otp-verification-code-in-ai-agent).

## Where it fits

This is the Python view of the [email API](/email-api). See also [send email in Python (free)](/blog/python-send-email-api-free) and the [Node.js version](/blog/nodejs-email-api).

[Get a free token](https://login.ollastack.com/register) — send and receive from Python, no card.

---
title: "Send email in Python via API, free (send and receive)"
description: "Send email from Python with a free HTTP API — no smtplib, no Gmail app password. Here's the send call with httpx/requests, how to receive the reply, and why an API beats SMTP from Python."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "python", "send", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email in Python via a free API?"
    a: "POST to the send endpoint with httpx or requests: a JSON body with to, subject, and text/html plus a Bearer token. No smtplib, no SMTP server, and the free tier needs no credit card."
  - q: "Why use an API instead of smtplib?"
    a: "smtplib makes you manage an SMTP host, port, TLS, and app passwords, and handle connection errors. An HTTP API is one call that returns a message id or a clear error — and it can also receive mail, which smtplib cannot."
  - q: "Can Python read the reply too?"
    a: "Yes. GET the wait endpoint with the same token to long-poll for the next inbound message, then read msg['codes'] or msg['text'] — send and receive in a few lines."
  - q: "Is it really free with no auth headaches?"
    a: "The free tier needs no credit card. You authenticate with a single Bearer token (created in the dashboard) — far less setup than a Gmail app password or an SMTP relay."
---

Sending email from Python usually means `smtplib`, an SMTP host, TLS, and a Gmail app password that breaks the moment 2FA changes. A free HTTP email API replaces all of it with one call — and it can read the reply, which `smtplib` never could.

## Send (httpx or requests)

```python
import httpx

TOKEN = "fmd_…"
api = httpx.Client(
    base_url="https://login.ollastack.com",
    headers={"Authorization": f"Bearer {TOKEN}"},
)

# create a mailbox once
mbx = api.post("/api/mailboxes",
               json={"name": "py", "mode": "agent", "handle": "py"}).json()

# send
api.post(f"/api/mailboxes/{mbx['id']}/send",
         json={"to": "user@example.com",
               "subject": "Hello from Python",
               "text": "Sent via API — no smtplib."})
```

`requests` works identically — swap `httpx.Client` for a `requests.Session` with the same header.

## Why an API beats smtplib

`smtplib` makes you own the transport: host, port 587, `starttls()`, credentials, and every connection error in between. The API is one HTTPS call that returns a `msg_…` id or a structured error you can branch on. No app password to rotate, no SMTP timeouts — and crucially, it can also *receive*.

## Receive the reply

```python
msg = api.get(f"/api/mailboxes/{mbx['id']}/wait", params={"timeout": 60}).json()
print(msg["subject"], msg["codes"])   # OTP already extracted
```

That's the part SMTP can't do from Python — read inbound mail and pull the code without scraping. For OTP-specific flows see [read an OTP code in an agent](/blog/read-otp-verification-code-in-ai-agent).

## Free, minimal auth

The free tier needs no credit card; you authenticate with one Bearer token from the dashboard. See the [email API overview](/email-api) and [free API to send email](/blog/free-api-to-send-email).

[Get a free token](https://login.ollastack.com/register) — send and receive from Python, no card.

---
title: "Node.js email API: send and receive email (free, no SMTP)"
description: "Send and receive email in Node.js with a free HTTP API — no Nodemailer, no SMTP. Here's the send call with fetch, how to receive and read replies, and why an API beats SMTP from Node."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "nodejs", "javascript", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email in Node.js without SMTP?"
    a: "Use fetch to POST to the send endpoint with a Bearer token and a JSON body (to, subject, text/html). No Nodemailer, no SMTP host or credentials — one HTTPS call that returns a message id."
  - q: "Can Node.js receive email too?"
    a: "Yes. fetch the wait endpoint with the same token to long-poll for the next inbound message, then read msg.codes or msg.text. SMTP-based libraries can only send; an inbox API receives as well."
  - q: "Why use an API instead of Nodemailer?"
    a: "Nodemailer needs an SMTP transport — host, port, auth — and only sends. An HTTP API is one fetch call, returns structured errors, and can also receive mail."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Node usually means Nodemailer plus an SMTP transport you have to configure and babysit — and it can only send. A free HTTP email API is one `fetch` call, and it can read the reply too.

## Send with fetch

```js
const API = "https://login.ollastack.com";
const TOKEN = process.env.OLLASTACK_API_TOKEN;
const h = { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" };

// create a mailbox once
const mbx = await fetch(`${API}/api/mailboxes`, {
  method: "POST", headers: h,
  body: JSON.stringify({ name: "node", mode: "agent", handle: "node" }),
}).then((r) => r.json());

// send
await fetch(`${API}/api/mailboxes/${mbx.id}/send`, {
  method: "POST", headers: h,
  body: JSON.stringify({ to: "user@example.com", subject: "Hi", text: "Sent from Node." }),
});
```

No transport config, no port 587 — native `fetch` (Node 18+).

## Receive a reply

```js
const msg = await fetch(
  `${API}/api/mailboxes/${mbx.id}/wait?timeout=60`,
  { headers: { Authorization: `Bearer ${TOKEN}` } },
).then((r) => r.json());

console.log(msg.subject, msg.codes); // OTP already extracted
```

That's the part Nodemailer can't do — read inbound mail and pull the code without scraping.

## Why an API beats SMTP from Node

Nodemailer owns the transport: host, port, auth, pooling, and every connection error. The API is one `fetch` that returns a `msg_…` id or a structured error — and it also receives. Less to configure, more it can do.

See the [email API overview](/email-api), [free API to send email](/blog/free-api-to-send-email), and the [Python version](/blog/python-email-api).

[Get a free token](https://login.ollastack.com/register) — send and receive from Node, no card.

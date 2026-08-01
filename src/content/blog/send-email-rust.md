---
draft: true
title: "Send email in Rust via HTTP API (send and receive)"
description: "Send email from Rust with one HTTP call — no SMTP crate. The send code with reqwest, how to receive the reply, and error handling."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "rust", "tutorial"]
author: "Ollastack"
readingTime: 6
faq:
  - q: "How do I send email in Rust without SMTP?"
    a: "POST to the send endpoint with reqwest: a JSON body and a Bearer token. No lettre/SMTP crate, no mail server — one async HTTPS request that returns a message id."
  - q: "Can Rust receive email too?"
    a: "Yes. GET the wait endpoint with reqwest to long-poll for the next inbound message, then deserialize the subject, body, and extracted codes/links with serde. SMTP crates only send; this also receives."
  - q: "Which crates do I need?"
    a: "reqwest (with the json feature), serde_json, and an async runtime like tokio. No SMTP crate required."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Rust means an SMTP crate like lettre and a mail server to point at. A free HTTP email API replaces that with one `reqwest` call — no SMTP crate — and it can read the reply, which an SMTP sender can't.

## Send email in Rust

With `reqwest` (json feature) and `tokio`, send is a couple of awaits:

```rust
use serde_json::{json, Value};

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let base = "https://login.ollastack.com";
    let token = "fmd_…";
    let http = reqwest::Client::new();

    // create a mailbox once
    let mbx: Value = http
        .post(format!("{base}/api/mailboxes"))
        .bearer_auth(token)
        .json(&json!({ "name": "rust", "mode": "agent", "handle": "rs" }))
        .send().await?
        .error_for_status()?      // turn 4xx/5xx into an Err
        .json().await?;
    let id = mbx["id"].as_str().unwrap();

    // send
    http.post(format!("{base}/api/mailboxes/{id}/send"))
        .bearer_auth(token)
        .json(&json!({ "to": "user@example.com", "subject": "Hi", "text": "Sent from Rust." }))
        .send().await?
        .error_for_status()?;
    Ok(())
}
```

No SMTP crate, no mail server — one async HTTPS request that returns a `msg_…` id. `bearer_auth` handles the header; `error_for_status()` turns failures into a normal `Result` error.

## Receive the reply

The same client long-polls for the next inbound message:

```rust
let msg: Value = http
    .get(format!("{base}/api/mailboxes/{id}/wait?timeout=60"))
    .bearer_auth(token)
    .send().await?
    .json().await?;
println!("{} {:?}", msg["subject"], msg["codes"]); // OTP extracted
```

That's the half an SMTP crate can't do — read inbound mail and pull the code without parsing MIME.

## Send HTML, not just text

Swap `text` for `html` (or send both — `text` is the fallback for clients that don't render HTML):

```rust
http.post(format!("{base}/api/mailboxes/{id}/send"))
    .bearer_auth(token)
    .json(&json!({
        "to": "user@example.com",
        "subject": "Welcome",
        "html": "<h1>Welcome</h1><p>Thanks for signing up.</p>",
        "text": "Welcome — thanks for signing up."
    }))
    .send().await?.error_for_status()?;
```

The same endpoint takes both; add a `reply_to` to route replies to a specific address.

## Why an API beats an SMTP crate

lettre and friends make you run or configure SMTP and only send. `reqwest` is one call that sends from an authenticated domain, returns a typed error via `error_for_status()`, and also receives — handy for OTP testing or agent inboxes.

## Error handling

`error_for_status()?` propagates any `>= 400` as an `Err`; on `429` you can match the status and retry after a short delay. Deserialize the JSON error body with serde for the `code` and `message`.

See the [email API overview](/email-api), the [Go version](/blog/send-email-go), and the [Node.js version](/blog/nodejs-email-api).

[Get a free token](https://login.ollastack.com/register) — send and receive from Rust, no card.

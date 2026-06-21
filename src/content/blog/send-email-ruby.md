---
title: "Send email in Ruby via HTTP API (send and receive)"
description: "Send email from Ruby with one HTTP call — no ActionMailer, no SMTP. The send code with Net::HTTP, how to receive the reply, and error handling."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "ruby", "rails", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email in Ruby without SMTP?"
    a: "POST to the send endpoint with Net::HTTP: a JSON body (to, subject, text) and a Bearer token. No SMTP host or ActionMailer config — one HTTPS request that returns a message id."
  - q: "Can Ruby receive email too?"
    a: "Yes. GET the wait endpoint with the same token to long-poll for the next inbound message, then parse the subject, body, and extracted codes/links. SMTP libraries only send; this also receives."
  - q: "Does it work with Rails?"
    a: "Yes — it's a plain HTTP call, so use it from a service object or job instead of ActionMailer when you need receiving, OTP testing, or agent mail."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Ruby usually means ActionMailer plus SMTP settings to maintain. A free HTTP email API replaces that with one `Net::HTTP` call — no SMTP config — and it can read the reply, which ActionMailer can't.

## Send email in Ruby

A small helper around `Net::HTTP` keeps it tidy and raises on errors:

```ruby
require "net/http"
require "json"

BASE  = "https://login.ollastack.com"
TOKEN = "fmd_…"

def call(method, path, body = nil)
  uri = URI("#{BASE}#{path}")
  req = (method == :post ? Net::HTTP::Post : Net::HTTP::Get).new(uri)
  req["Authorization"] = "Bearer #{TOKEN}"
  req["Content-Type"]  = "application/json"
  req.body = body.to_json if body
  res = Net::HTTP.start(uri.host, uri.port, use_ssl: true) { |h| h.request(req) }
  raise "Request failed (#{res.code}): #{res.body}" if res.code.to_i >= 400
  JSON.parse(res.body)
end

# create a mailbox once
mbx = call(:post, "/api/mailboxes",
           { name: "ruby", mode: "agent", handle: "ruby" })

# send
call(:post, "/api/mailboxes/#{mbx['id']}/send",
     { to: "user@example.com", subject: "Hi", text: "Sent from Ruby." })
```

No SMTP host, no port, no ActionMailer setup — one HTTPS request that returns a `msg_…` id.

## Receive the reply

The same helper long-polls for the next inbound message:

```ruby
msg = call(:get, "/api/mailboxes/#{mbx['id']}/wait?timeout=60")
puts msg["subject"], msg["codes"].inspect # OTP already extracted
```

That's the half ActionMailer can't do — read inbound mail and pull the code without parsing it yourself.

## Send HTML, not just text

Swap `text` for `html` (or send both — `text` is the fallback for clients that don't render HTML):

```ruby
call(:post, "/api/mailboxes/#{mbx['id']}/send", {
  to:      "user@example.com",
  subject: "Welcome",
  html:    "<h1>Welcome</h1><p>Thanks for signing up.</p>",
  text:    "Welcome — thanks for signing up.",
})
```

The same endpoint takes both; add a `reply_to` to route replies to a specific address.

## Why an API beats ActionMailer / SMTP

ActionMailer ties you to SMTP settings and only sends. The API sends from an authenticated domain, returns a structured error, and also receives — ideal for OTP testing in CI or giving an agent an inbox from a Rails job.

## Error handling

The helper raises on any `>= 400`; on `429` sleep briefly and retry. Read the JSON error body for the `code` and `message` instead of assuming success.

See the [email API overview](/email-api), the [PHP version](/blog/send-email-php), and [test OTP email in CI](/blog/test-otp-email-in-ci).

[Get a free token](https://login.ollastack.com/register) — send and receive from Ruby, no card.

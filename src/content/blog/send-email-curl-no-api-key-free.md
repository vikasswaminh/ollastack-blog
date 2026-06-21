---
title: "Send email with curl, free (and read the reply)"
description: "How to send email with a single curl command, free — no SMTP, no mail server. Plus the honest truth about 'no API key' email senders, and how to receive the reply with the same one-liner."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "curl", "send", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email with curl for free?"
    a: "POST to the send endpoint with an Authorization header and a JSON body: curl -X POST https://login.ollastack.com/api/mailboxes/{id}/send -H 'Authorization: Bearer TOKEN' -H 'Content-Type: application/json' -d '{\"to\":\"...\",\"subject\":\"...\",\"text\":\"...\"}'. The free tier needs no credit card."
  - q: "Can I send email with curl with no API key at all?"
    a: "Truly keyless public senders exist but are unauthenticated relays — rate-limited, spam-prone, and unreliable for anything real. A free API token is the honest minimum: it's free, it authenticates you, and it stops your endpoint becoming an open relay."
  - q: "Do I need SMTP for curl email?"
    a: "No. You make one HTTPS POST. There's no SMTP host, port, or password — curl talks to the API directly."
  - q: "Can curl also receive the reply?"
    a: "Yes. curl the wait endpoint with the same token to long-poll for the next inbound message — send and receive, both from the command line."
---

You want to send an email from a script or the terminal without standing up SMTP. `curl` can do it in one line — and, unlike most "send email" snippets, you can read the reply with the same tool. Here's the honest, working way.

## The one-liner

```bash
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_.../send \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"to":"user@example.com","subject":"Hi","text":"Sent from curl."}'
# → { "id": "msg_…", "status": "sent" }
```

One HTTPS POST. No SMTP host, no port 587, no app password. Create the mailbox once (`POST /api/mailboxes`) and reuse its id.

## About "no API key"

Searches for "send email with curl no api key" want zero friction — but be honest about the tradeoff. **Truly keyless public senders are unauthenticated relays:** heavily rate-limited, spam-filtered to oblivion, and a magnet for abuse, so they're useless for anything you actually rely on. A **free API token** is the honest minimum — it costs nothing, it authenticates you, and it keeps the endpoint from becoming an open relay that spammers ride. Free, yes; keyless, no — and you don't want keyless.

## No SMTP, no server

There's nothing to run. `curl` talks straight to the API over HTTPS; the platform handles delivery from an authenticated domain (SPF/DKIM/DMARC already passing). To send from your own domain, add a custom sender — see [DKIM, SPF & DMARC](/blog/dkim-spf-dmarc-custom-sender).

## Receive the reply with curl too

The same token long-polls for the response — send and receive, both from the shell:

```bash
curl "https://login.ollastack.com/api/mailboxes/mbx_.../wait?timeout=60" \
  -H "Authorization: Bearer $TOKEN"
```

See the [email API overview](/email-api) and [free API to send email](/blog/free-api-to-send-email).

[Get a free token](https://login.ollastack.com/register) — send and receive from curl, no card.

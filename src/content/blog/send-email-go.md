---
draft: true
title: "Send email in Go via HTTP API (send and receive)"
description: "Send email from Go with one HTTP call — no SMTP, no net/smtp wiring. The send code with net/http, how to receive the reply, and error handling. Free to start."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "go", "golang", "tutorial"]
author: "Ollastack"
readingTime: 6
faq:
  - q: "How do I send email in Go without SMTP?"
    a: "POST to the send endpoint with net/http: a JSON body (to, subject, text) plus a Bearer token. No net/smtp, no SMTP host or auth — one HTTPS request that returns a message id."
  - q: "Can Go receive email too?"
    a: "Yes. GET the wait endpoint with the same token to long-poll for the next inbound message, then decode the JSON for the subject, body, and extracted codes/links. net/smtp can only send; this also receives."
  - q: "Why use an HTTP API instead of net/smtp?"
    a: "net/smtp makes you manage a server, port, and auth, and only sends. An HTTP API is one request that returns a structured error you can branch on — and it can receive mail."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Go usually means `net/smtp` and a mail server to point it at. A free HTTP email API replaces that with a single `net/http` call — and it can read the reply, which `net/smtp` cannot.

## Send email in Go

Create a mailbox once, then POST to its send endpoint. A small helper keeps it tidy and surfaces errors:

```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const base = "https://login.ollastack.com"
const token = "fmd_…"

func post(path string, body any) ([]byte, error) {
	b, _ := json.Marshal(body)
	req, _ := http.NewRequest("POST", base+path, bytes.NewReader(b))
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()
	data, _ := io.ReadAll(res.Body)
	if res.StatusCode >= 400 {
		return nil, fmt.Errorf("request failed: %s — %s", res.Status, data)
	}
	return data, nil
}

func main() {
	// create a mailbox once
	raw, _ := post("/api/mailboxes", map[string]string{
		"name": "go", "mode": "agent", "handle": "go",
	})
	var mbx struct{ ID string `json:"id"` }
	json.Unmarshal(raw, &mbx)

	// send
	post("/api/mailboxes/"+mbx.ID+"/send", map[string]string{
		"to": "user@example.com", "subject": "Hi", "text": "Sent from Go.",
	})
}
```

No SMTP host, no port 587, no `net/smtp` dance — one HTTPS request that returns a `msg_…` id.

## Receive the reply

The same token long-polls for the next inbound message. `wait` blocks until mail arrives or times out:

```go
res, _ := http.NewRequest("GET",
	base+"/api/mailboxes/"+mbx.ID+"/wait?timeout=60", nil)
res.Header.Set("Authorization", "Bearer "+token)
out, _ := http.DefaultClient.Do(res)
defer out.Body.Close()

var msg struct {
	Subject string   `json:"subject"`
	Codes   []string `json:"codes"`
}
json.NewDecoder(out.Body).Decode(&msg)
fmt.Println(msg.Subject, msg.Codes) // OTP already extracted
```

That's the half `net/smtp` can't do — read inbound mail and pull the code without parsing MIME.

## Why an HTTP API beats net/smtp

`net/smtp` owns the transport: a server, a port, auth, and connection errors. The API is one request that returns a structured body — a `msg_…` id on success, a `code`/`message` on failure — so you log a real reason. And it receives, which SMTP never did.

## Error handling

Always check the status (the helper above does): on `429` back off and retry; on `4xx`/`5xx` read the JSON error body rather than assuming success.

See the [email API overview](/email-api), the [Rust version](/blog/send-email-rust), and the [Node.js version](/blog/nodejs-email-api).

[Get a free token](https://login.ollastack.com/register) — send and receive from Go, no card.

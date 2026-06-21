---
title: "Send email in PHP via HTTP API (no SMTP)"
description: "Send email from PHP with one HTTP call — no PHPMailer, no SMTP config. The send code with cURL, how to receive the reply, and error handling. Free to start."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "php", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email in PHP without SMTP or PHPMailer?"
    a: "POST to the send endpoint with cURL: a JSON body (to, subject, text) and a Bearer token. No PHPMailer, no SMTP host or credentials — one HTTPS request that returns a message id."
  - q: "Can PHP receive email too?"
    a: "Yes. GET the wait endpoint with cURL to long-poll for the next inbound message, then json_decode the subject, body, and extracted codes/links. PHPMailer only sends; this also receives."
  - q: "Why use an API instead of PHP's mail() or SMTP?"
    a: "mail() depends on a local MTA and lands in spam; SMTP needs a host and credentials. An HTTP API is one cURL call from an authenticated domain, returns a clear error, and can receive mail too."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from PHP usually means `mail()` (which lands in spam) or PHPMailer plus SMTP credentials. A free HTTP email API replaces both with one cURL call — and it can read the reply, which neither can.

## Send email in PHP

A small helper around cURL keeps it clean and raises on errors:

```php
<?php
$base = "https://login.ollastack.com";
$token = "fmd_…";

function call(string $method, string $path, ?array $body = null) {
    global $base, $token;
    $ch = curl_init("$base$path");
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            "Authorization: Bearer $token",
            "Content-Type: application/json",
        ],
        CURLOPT_POSTFIELDS => $body ? json_encode($body) : null,
    ]);
    $res  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($code >= 400) throw new Exception("Request failed ($code): $res");
    return json_decode($res, true);
}

// create a mailbox once
$mbx = call("POST", "/api/mailboxes", [
    "name" => "php", "mode" => "agent", "handle" => "php",
]);

// send
call("POST", "/api/mailboxes/{$mbx['id']}/send", [
    "to" => "user@example.com", "subject" => "Hi", "text" => "Sent from PHP.",
]);
```

No SMTP host, no port, no local MTA — one HTTPS request that returns a `msg_…` id.

## Receive the reply

The same helper long-polls for the next inbound message:

```php
$msg = call("GET", "/api/mailboxes/{$mbx['id']}/wait?timeout=60");
echo $msg["subject"], " ", implode(",", $msg["codes"]); // OTP extracted
```

That's the half PHPMailer can't do — read inbound mail and pull the code without parsing the body.

## Send HTML, not just text

Swap `text` for `html` (or send both — `text` is the fallback for clients that don't render HTML):

```php
call("POST", "/api/mailboxes/{$mbx['id']}/send", [
    "to"      => "user@example.com",
    "subject" => "Welcome",
    "html"    => "<h1>Welcome</h1><p>Thanks for signing up.</p>",
    "text"    => "Welcome — thanks for signing up.",
]);
```

The same endpoint handles both; pass a `reply_to` if you want replies routed somewhere specific.

## Why an API beats mail() / SMTP

`mail()` relies on a local mail server and is a deliverability minefield; SMTP makes you manage a host and credentials. The API sends from an authenticated domain (SPF/DKIM/DMARC already passing), returns a structured error, and can also receive — see [deliverability basics](/blog/dkim-spf-dmarc-custom-sender).

## Error handling

The helper raises on any `>= 400`; on `429` add a short sleep and retry. Read the JSON error body for the `code` and `message` rather than assuming the send went through.

See the [email API overview](/email-api), the [Ruby version](/blog/send-email-ruby), and [free API to send email](/blog/free-api-to-send-email).

[Get a free token](https://login.ollastack.com/register) — send and receive from PHP, no card.

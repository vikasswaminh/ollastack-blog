---
draft: true
title: "Send email in Java via HTTP API (no SMTP)"
description: "Send email from Java with one HTTP call — no JavaMail, no SMTP. The send code with HttpClient, how to receive the reply, and error handling."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "java", "tutorial"]
author: "Ollastack"
readingTime: 6
faq:
  - q: "How do I send email in Java without SMTP or JavaMail?"
    a: "POST to the send endpoint with the built-in java.net.http.HttpClient (Java 11+): a JSON body and a Bearer token. No JavaMail, no SMTP session — one HTTPS request that returns a message id."
  - q: "Can Java receive email too?"
    a: "Yes. Send a GET to the wait endpoint to long-poll for the next inbound message, then parse the subject, body, and extracted codes/links. JavaMail's SMTP transport only sends; this also receives."
  - q: "Do I need a dependency?"
    a: "No transport dependency — java.net.http.HttpClient is built into the JDK (11+). You may want a small JSON library (Jackson/Gson) to parse responses, but the HTTP call needs nothing extra."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Java usually means JavaMail and an SMTP `Session` to configure. A free HTTP email API replaces that with the built-in `HttpClient` — no transport dependency — and it can read the reply, which JavaMail's sender can't.

## Send email in Java

`java.net.http.HttpClient` (JDK 11+) needs no extra library to make the call:

```java
import java.net.URI;
import java.net.http.*;

var client = HttpClient.newHttpClient();
String base = "https://login.ollastack.com", token = "fmd_…";

// create a mailbox once
var create = HttpRequest.newBuilder(URI.create(base + "/api/mailboxes"))
    .header("Authorization", "Bearer " + token)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"name\":\"java\",\"mode\":\"agent\",\"handle\":\"java\"}"))
    .build();
String mbx = client.send(create, HttpResponse.BodyHandlers.ofString()).body();
String id = /* parse "id" from mbx with Jackson/Gson */ extractId(mbx);

// send
var send = HttpRequest.newBuilder(URI.create(base + "/api/mailboxes/" + id + "/send"))
    .header("Authorization", "Bearer " + token)
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString(
        "{\"to\":\"user@example.com\",\"subject\":\"Hi\",\"text\":\"Sent from Java.\"}"))
    .build();
var res = client.send(send, HttpResponse.BodyHandlers.ofString());
if (res.statusCode() >= 400) throw new RuntimeException("Send failed: " + res.body());
```

No SMTP `Session`, no `Transport.send()` — one HTTPS request that returns a `msg_…` id.

## Receive the reply

A GET to the wait endpoint long-polls for the next inbound message:

```java
var wait = HttpRequest.newBuilder(
        URI.create(base + "/api/mailboxes/" + id + "/wait?timeout=60"))
    .header("Authorization", "Bearer " + token).GET().build();
String msg = client.send(wait, HttpResponse.BodyHandlers.ofString()).body();
// parse msg.codes[0] for an OTP — extracted for you
```

That's the half JavaMail's sender can't do — read inbound mail and pull the code without parsing MIME.

## Why an API beats JavaMail / SMTP

JavaMail makes you configure an SMTP session and only sends. The built-in `HttpClient` call sends from an authenticated domain, returns a structured error, and also receives — useful for OTP testing or agent inboxes.

## Error handling

Check `res.statusCode()`: on `429` back off and retry; on `4xx`/`5xx` read the JSON error body for the `code` and `message`.

See the [email API overview](/email-api), the [Kotlin version](/blog/send-email-kotlin), and the [C# / .NET version](/blog/send-email-dotnet).

[Get a free token](https://login.ollastack.com/register) — send and receive from Java, no card.

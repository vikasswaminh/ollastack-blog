---
title: "Send email in Kotlin via HTTP API (no SMTP)"
description: "Send email from Kotlin with one HTTP call — no JavaMail, no SMTP. The send code with java.net.http, how to receive the reply, and error handling. Free to start."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "kotlin", "android", "tutorial"]
author: "Ollastack"
readingTime: 6
draft: false
faq:
  - q: "How do I send email in Kotlin without SMTP?"
    a: "POST to the send endpoint using the JDK's java.net.http.HttpClient (or Ktor): a JSON body and a Bearer token. No SMTP host or JavaMail — one HTTPS request that returns a message id."
  - q: "Can Kotlin receive email too?"
    a: "Yes. GET the wait endpoint to long-poll for the next inbound message, then parse the subject, body, and extracted codes/links. SMTP libraries only send; this also receives."
  - q: "Does this work on Android?"
    a: "The HTTP calls work anywhere Kotlin runs. On Android, make them off the main thread (a coroutine on Dispatchers.IO) and keep the API token server-side rather than shipping it in the app."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from Kotlin usually pulls in JavaMail and SMTP configuration. A free HTTP email API replaces that with the JDK's built-in `HttpClient` — and it can read the reply, which an SMTP sender can't.

## Send email in Kotlin

`java.net.http.HttpClient` works directly from Kotlin, no transport dependency:

```kotlin
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse

val client = HttpClient.newHttpClient()
val base = "https://login.ollastack.com"
val token = "fmd_…"

fun post(path: String, json: String): String {
    val req = HttpRequest.newBuilder(URI.create(base + path))
        .header("Authorization", "Bearer $token")
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(json))
        .build()
    val res = client.send(req, HttpResponse.BodyHandlers.ofString())
    check(res.statusCode() < 400) { "Request failed: ${res.body()}" }
    return res.body()
}

// create a mailbox once
val mbx = post("/api/mailboxes",
    """{"name":"kotlin","mode":"agent","handle":"kt"}""")
val id = Regex("\"id\":\"(.*?)\"").find(mbx)!!.groupValues[1]

// send
post("/api/mailboxes/$id/send",
    """{"to":"user@example.com","subject":"Hi","text":"Sent from Kotlin."}""")
```

No SMTP host, no JavaMail session — one HTTPS request returning a `msg_…` id. (Kotlin's raw triple-quoted strings make the JSON bodies readable.)

## Receive the reply

A GET to the wait endpoint long-polls for the next inbound message:

```kotlin
val req = HttpRequest.newBuilder(
        URI.create("$base/api/mailboxes/$id/wait?timeout=60"))
    .header("Authorization", "Bearer $token").GET().build()
val msg = client.send(req, HttpResponse.BodyHandlers.ofString()).body()
// parse codes[0] for an OTP — extracted for you
```

That's the half an SMTP sender can't do — read inbound mail and pull the code.

## Send HTML, not just text

Swap `text` for `html` (or send both — `text` is the fallback for clients that don't render HTML):

```kotlin
post("/api/mailboxes/$id/send", """
  {"to":"user@example.com","subject":"Welcome",
   "html":"<h1>Welcome</h1><p>Thanks for signing up.</p>",
   "text":"Welcome — thanks for signing up."}
""".trimIndent())
```

The same endpoint takes both; add a `reply_to` field to route replies to a specific address.

## Why an API beats JavaMail / SMTP

JavaMail makes you configure SMTP and only sends. The built-in `HttpClient` call sends from an authenticated domain, returns a structured error, and also receives. On Android, run it on `Dispatchers.IO` and keep the token off-device.

## Error handling

The `check(...)` raises on any `>= 400`; on `429` back off and retry, reading the JSON error body for the `code` and `message`.

See the [email API overview](/email-api), the [Java version](/blog/send-email-java), and the [C# / .NET version](/blog/send-email-dotnet).

[Get a free token](https://login.ollastack.com/register) — send and receive from Kotlin, no card.

---
draft: true
title: "Send email in C# / .NET via HTTP API (no SMTP)"
description: "Send email from C# with one HTTP call — no SmtpClient, no MailKit. The send code with HttpClient, how to receive the reply, and error handling."
date: 2026-06-21
updated: 2026-06-21
tags: ["email-api", "csharp", "dotnet", "tutorial"]
author: "Ollastack"
readingTime: 6
faq:
  - q: "How do I send email in C# without SMTP?"
    a: "POST to the send endpoint with HttpClient and PostAsJsonAsync: a JSON body and a Bearer token. No SmtpClient, no MailKit, no SMTP host — one HTTPS request that returns a message id."
  - q: "Can .NET receive email too?"
    a: "Yes. GET the wait endpoint with the same HttpClient to long-poll for the next inbound message, then read the subject, body, and extracted codes/links. SmtpClient only sends; this also receives."
  - q: "Isn't SmtpClient deprecated?"
    a: "Microsoft discourages System.Net.Mail.SmtpClient for new code. An HTTP email API is the modern alternative — one HttpClient call, no SMTP, and it can also receive mail."
  - q: "Is it free?"
    a: "The free tier sends and receives with no credit card."
---

Sending email from C# used to mean `SmtpClient` — which Microsoft now discourages — or MailKit plus SMTP config. A free HTTP email API replaces both with one `HttpClient` call, and it can read the reply, which an SMTP sender can't.

## Send email in C#

`HttpClient` with `System.Net.Http.Json` makes it a couple of lines:

```csharp
using System.Net.Http.Json;

var http = new HttpClient { BaseAddress = new Uri("https://login.ollastack.com") };
http.DefaultRequestHeaders.Authorization = new("Bearer", "fmd_…");

// create a mailbox once
var created = await http.PostAsJsonAsync("/api/mailboxes",
    new { name = "dotnet", mode = "agent", handle = "net" });
created.EnsureSuccessStatusCode();
var mbx = await created.Content.ReadFromJsonAsync<Dictionary<string, object>>();
var id = mbx!["id"];

// send
var res = await http.PostAsJsonAsync($"/api/mailboxes/{id}/send",
    new { to = "user@example.com", subject = "Hi", text = "Sent from .NET." });
res.EnsureSuccessStatusCode();
```

No `SmtpClient`, no SMTP host or port — one HTTPS request that returns a `msg_…` id.

## Receive the reply

The same `HttpClient` long-polls for the next inbound message:

```csharp
var msg = await http.GetFromJsonAsync<Dictionary<string, object>>(
    $"/api/mailboxes/{id}/wait?timeout=60");
Console.WriteLine(msg!["subject"]); // codes[] holds the extracted OTP
```

That's the half `SmtpClient` can't do — read inbound mail and pull the code without parsing it yourself.

## Send HTML, not just text

Swap `text` for `html` (or send both — `text` is the fallback for clients that don't render HTML):

```csharp
await http.PostAsJsonAsync($"/api/mailboxes/{id}/send", new {
    to      = "user@example.com",
    subject = "Welcome",
    html    = "<h1>Welcome</h1><p>Thanks for signing up.</p>",
    text    = "Welcome — thanks for signing up.",
});
```

The same endpoint takes both; add a `reply_to` to route replies to a specific address.

## Why an API beats SmtpClient / MailKit

`SmtpClient` is discouraged for new code and only sends; MailKit still needs SMTP config. The `HttpClient` call sends from an authenticated domain, returns a structured error, and also receives — handy for OTP testing or agent inboxes.

## Error handling

`EnsureSuccessStatusCode()` throws on failure; for finer control, check `res.StatusCode` and read the JSON error body for the `code` and `message`, backing off on `429`. Register the `HttpClient` with `IHttpClientFactory` in DI rather than newing one per call, so connections are pooled and the base address and auth header are configured once.

See the [email API overview](/email-api), the [Java version](/blog/send-email-java), and the [Kotlin version](/blog/send-email-kotlin).

[Get a free token](https://login.ollastack.com/register) — send and receive from .NET, no card.

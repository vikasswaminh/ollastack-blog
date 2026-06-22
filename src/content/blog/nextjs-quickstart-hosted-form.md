---
title: "Add a working form to a Next.js 14 app in 10 minutes"
description: "A real Next.js 14 App Router form: a client component, a Server Action to a hosted backend, success/error states, and spam protection — no API route."
date: 2026-06-28
updated: 2026-06-19
tags: ["nextjs", "react", "quickstart", "guide"]
author: "Ollastack"
readingTime: 7
draft: false
---

Next.js makes the UI easy and the *backend of a form* annoying: you either stand up an API route, wire an email provider, and handle spam yourself, or you reach for a hosted form backend and skip all of it. This is the second path, done properly with the App Router — Server Action included.

You'll have a working contact form, emailing you on every submission, with no server code of your own to maintain.

## Step 1 — Create the form endpoint

[Sign up](https://login.ollastack.com/register), create a form, set your fields (`name`, `email`, `message`), and copy the endpoint:

```
https://login.ollastack.com/api/submit/<your-slug>
```

That URL accepts JSON and form-encoded bodies and returns `201` with `{ success: true, id }`. That's your entire backend.

## Step 2 — The client component

```tsx
"use client";
import { useState } from "react";
import { submitContact } from "./actions";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const data = new FormData(e.currentTarget);
        const ok = await submitContact(data);
        setState(ok ? "sent" : "error");
      }}
    >
      {state === "sent" ? (
        <p>Thanks — we'll be in touch.</p>
      ) : (
        <>
          <input name="name" placeholder="Name" required />
          <input name="email" type="email" placeholder="you@example.com" required />
          <textarea name="message" placeholder="Message" required />
          {/* Honeypot: real users never see it; bots fill it. */}
          <input name="_gotcha" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
          <button disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send"}
          </button>
          {state === "error" && <p>Something went wrong — try again.</p>}
        </>
      )}
    </form>
  );
}
```

## Step 3 — The Server Action

Keeping the POST on the server means the endpoint isn't called straight from the browser, and you can add server-only logic later (logging, redirects) without touching the component.

```ts
// app/contact/actions.ts
"use server";

export async function submitContact(form: FormData): Promise<boolean> {
  const res = await fetch(
    "https://login.ollastack.com/api/submit/your-slug",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
        _gotcha: form.get("_gotcha"), // honeypot passes through
      }),
    }
  );
  return res.ok;
}
```

That's the whole integration. No API route, no Nodemailer, no spam library.

## Step 4 — Notifications

In the form's settings, set the email that should receive submissions (verify it first — a form can only notify a verified address, which prevents your form from being pointed at a stranger's inbox). Want replies to go straight to the person who wrote in? The submission's `email` field is automatically used as the notification's Reply-To, so hitting "Reply" answers the lead.

## Step 5 — Spam, without writing any

You already added the honeypot. Beyond that, submissions run through a layered pipeline (IP blocklist, keyword/regex, link limits, Akismet, and an ML classifier) automatically. The important guarantee: a real lead is never silently dropped — anything the ML model alone is unsure about is delivered and labeled `[Possible spam]`, not deleted, and you can recover it in one click.

## Optional — render it server-side or skip the UI entirely

Two shortcuts worth knowing:

- **No UI at all:** every form gets a hosted page at `login.ollastack.com/f/<slug>` — link to it and you're done.
- **Progressive enhancement:** because the endpoint also accepts a plain `multipart/form-data` POST, the same form works with `action="https://login.ollastack.com/api/submit/your-slug" method="POST"` even before JavaScript loads. The Server Action above just gives you inline success/error states.

## Where to go next

- Forward submissions to Slack/Discord or your own webhook (signed, with retries + replay).
- Let an AI agent submit the same form with a scoped Bearer token (it discovers the API from `/api/openapi.json`).
- Add file uploads (the endpoint handles `multipart/form-data`).

[Create your form](https://login.ollastack.com/register) — free tier is 100 submissions/month, no credit card. The endpoint is the only thing you have to remember.

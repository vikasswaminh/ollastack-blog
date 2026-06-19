---
title: "Add a contact form to an Astro site (no server, no API route)"
description: "Astro is static-first, so a form 'backend' feels like a detour. It isn't: point an HTML form at one endpoint and you're done. Here's the plain-HTML version and a progressively-enhanced fetch version, with spam handling included."
date: 2026-07-03
updated: 2026-06-19
tags: ["astro", "quickstart", "guide"]
author: "Ollastack"
readingTime: 6
draft: false
---

Astro's whole pitch is shipping mostly-static HTML with minimal JavaScript. A form fits that perfectly — *if* you don't drag a server along just to receive a POST. With a hosted form endpoint you keep Astro static (output `static`, deploy anywhere) and still get submissions in your inbox.

## The zero-JavaScript version

This is the one to reach for first. It works with `output: "static"`, ships no client JS, and survives a user with JavaScript disabled.

```astro
---
// src/pages/contact.astro
const endpoint = "https://login.ollastack.com/api/submit/your-slug";
---
<form action={endpoint} method="POST">
  <input name="name" placeholder="Name" required />
  <input name="email" type="email" placeholder="you@example.com" required />
  <textarea name="message" placeholder="Message" required></textarea>
  <!-- Honeypot: hidden from users, filled by bots -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />
  <button>Send</button>
</form>
```

[Create the form](https://login.ollastack.com/register), copy its endpoint into `endpoint`, and you have a working contact form. On submit, the browser posts directly to the endpoint and follows the success redirect (set `_next`, or configure the redirect in form settings — it can land on a `/thanks` page).

## Progressive enhancement (inline success, no page reload)

If you want a "Thanks!" message without a navigation, add a small island. The form still works without it.

```astro
---
// src/components/ContactForm.astro
const endpoint = "https://login.ollastack.com/api/submit/your-slug";
---
<form id="contact" action={endpoint} method="POST">
  <input name="name" required />
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button>Send</button>
  <p id="ok" hidden>Thanks — we'll be in touch.</p>
</form>

<script>
  const form = document.getElementById("contact");
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const res = await fetch(form.action, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    });
    if (res.ok) { form.querySelector("#ok").hidden = false; }
  });
</script>
```

`new FormData(form)` sends `multipart/form-data`, which the endpoint accepts as-is — no JSON serialization needed.

## Notifications and spam — handled for you

Set your notification email in the form settings (verify it first; a form can only notify a verified address). The submission's `email` field becomes the Reply-To automatically. Spam runs through a layered pipeline you don't configure, with the guarantee that a real lead is never silently dropped — anything the ML model alone is unsure about is delivered and labeled `[Possible spam]`, recoverable in one click.

## Don't want to build the UI at all?

Every form gets a hosted page at `login.ollastack.com/f/your-slug` — link to it from your Astro nav and skip the markup entirely.

## Next steps

- Forward submissions to Slack/Discord or your own signed webhook (with retries + replay).
- Add file uploads — the endpoint handles `multipart/form-data`.
- Let an agent submit with a scoped token (it reads the API from `/api/openapi.json`).

[Get your endpoint](https://login.ollastack.com/register) — 100 submissions/month free.

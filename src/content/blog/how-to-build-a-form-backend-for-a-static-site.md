---
title: "How to Build a Form Backend for a Static Site Without Writing a Server"
description: "You don't need Express, a database, or a $5/month droplet just to catch a contact form. Here's exactly how to give a static site a real form backend — spam filtering, notifications, webhooks and all — without writing a line of server code."
date: 2026-08-24
updated: 2026-08-24
tags: ["forms", "static-site", "hugo", "astro", "webhooks"]
author: "Ollastack"
readingTime: 21
faq:
  - q: "Do I need to know backend development to set this up?"
    a: "No — that's the entire point of this approach. Creating the form, copying the endpoint URL, and pasting it into your form's action attribute (or a fetch() call) requires only HTML and, optionally, a little JavaScript for a custom success state. Everything downstream — spam filtering, notification emails, storage — is handled by the service."
  - q: "Will this work with static site generators like Hugo, Astro, or Eleventy?"
    a: "Yes, without exception. These generators output plain HTML, CSS, and JavaScript at build time, and a form backend has no idea — and no reason to care — which generator produced the page it's receiving a submission from."
  - q: "What actually stops my form from filling up with spam?"
    a: "A layered pipeline: a honeypot field invisible to humans but visible to bots, IP and origin checks, keyword and link-density filters, a reputation service like Akismet, and a machine-learning classifier trained on real submission history. Crucially, a well-built system never silently deletes a submission — it quarantines and flags it so no inquiry is lost."
  - q: "What happens if I need the data somewhere other than my inbox — like a CRM or Slack?"
    a: "That's what webhooks are for. Register a URL in the form's settings, and every successful submission gets POSTed to it with an HMAC signature you can verify."
---

You don't need Express, a database, or a $5/month droplet just to catch a contact form. Here's exactly how to give a static site a real form backend — spam filtering, notifications, webhooks and all — without writing a line of server code.

Here's a scene that plays out a hundred times a day, on every corner of the web. Someone builds a beautiful, fast, static site — Hugo, Astro, Eleventy, plain HTML, doesn't matter which — and it's *great*. Pages load in a blink. There's no database to patch, no server to reboot at 2 a.m., no dependency-update Tuesday.

Then they get to the contact page, or the newsletter signup, or the "request a demo" form, and they hit a wall: `<form>` tags need somewhere to send their data, and a static site, by definition, has nowhere for that data to go.

The instinctive fix is to spin up a tiny backend. A Node script. A Python function. Maybe a whole Express app with a database table just for messages. And that's where a lot of otherwise-sensible developers lose an afternoon building infrastructure to solve what is, fundamentally, a five-minute problem.

This guide is about the other way: treating "form backend" as a solved problem you can plug into, the same way you'd plug into a CDN instead of writing your own edge network.

---

## Why a static site can't handle a form by itself

A static site is, at its core, a folder of files served exactly as they are. There's no runtime attached to it. When a browser loads `index.html`, nothing on the hosting side is "listening" for anything; it just hands over bytes.

A `<form>` element, on the other hand, is designed around the assumption that *something* is listening at the URL in its `action` attribute.

You have three options:

1. **Write and run your own backend** — serverless functions, Express, or Docker. (High maintenance).
2. **Use built-in static host forms** — platform lock-in, limited feature set.
3. **Point the form at a dedicated hosted form backend** — plug and play in 5 minutes.

---

## The 5-Minute Setup

Say you have a standard contact form:

```html
<form action="https://login.ollastack.com/api/submit/your-form-slug" method="POST">
  <label>Name <input name="name" required /></label>
  <label>Email <input name="email" type="email" required /></label>
  <label>Message <textarea name="message" required></textarea></label>
  <button type="submit">Send</button>
</form>
```

Or via JavaScript `fetch()`:

```javascript
async function handleSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const payload = Object.fromEntries(new FormData(form));
  
  const response = await fetch("https://login.ollastack.com/api/submit/your-form-slug", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    alert("Thanks for your submission!");
    form.reset();
  }
}
```

---

## Field Conventions

Most form backends share magic field names:

* `_replyto`: Sets the `Reply-To` header on the notification email.
* `_subject`: Overrides the notification email subject line.
* `_next`: Custom redirect URL after submit.
* `_gotcha`: Invisible honeypot field to trap spam bots.

---

## Webhooks: Connecting forms to Slack, CRMs & APIs

Send submissions anywhere using HMAC-signed webhooks:

```javascript
import { createHmac, timingSafeEqual } from "node:crypto";

function verifyWebhook(headers, rawBody, secret) {
  const signatureHeader = headers["x-ollastack-signature"];
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const provided = Buffer.from(signatureHeader.split("=")[1], "hex");
  const computed = Buffer.from(expected, "hex");
  
  return provided.length === computed.length && timingSafeEqual(provided, computed);
}
```

---

## Frequently Asked Questions

### Do I need to know backend development to set this up?
No. Creating the form, copying the endpoint URL, and pasting it into your HTML action attribute requires zero server-side code.

### Will this work with Hugo, Astro, or Eleventy?
Yes, without exception. These generators output static HTML/JS at build time.

### How does anti-spam work without CAPTCHA?
Using invisible honeypots, rate-limiting by IP, and machine-learning filters that quarantine suspicious submissions instead of dropping them.

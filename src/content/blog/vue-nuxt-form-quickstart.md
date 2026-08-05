---
title: "Vue & Nuxt form handling with a hosted backend"
description: "Build a contact form in Vue 3 or Nuxt without an API or email server: a reactive form, one POST to a single endpoint, success/error states, and spam protection."
date: 2026-07-13
updated: 2026-06-19
tags: ["vue", "nuxt", "quickstart", "guide"]
author: "Ollastack"
readingTime: 7
faq:
  - q: "How do I build a contact form in Vue or Nuxt?"
    a: "A reactive form whose submit handler POSTs to a hosted form endpoint gives you a complete contact form — success/error states, email and spam handling — with no API or mail server."
  - q: "Does it work in Nuxt too?"
    a: "Yes — the post includes a Nuxt server-route variant in addition to the client-side Vue 3 version."
  - q: "Is spam protection included?"
    a: "Yes — the hosted endpoint runs the spam pipeline; add a honeypot field for extra protection."
---

Vue makes the reactive form trivial; the backend is the part that drags. With a hosted form endpoint you keep the Vue side reactive and skip the API route, the email provider, and the spam library entirely.

## Vue 3 (Composition API)

```vue
<script setup>
import { reactive, ref } from "vue";

const ENDPOINT = "https://login.ollastack.com/api/submit/your-slug";
const form = reactive({ name: "", email: "", message: "", _gotcha: "" });
const state = ref("idle"); // idle | sending | sent | error

async function submit() {
  state.value = "sending";
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  state.value = res.ok ? "sent" : "error";
}
</script>

<template>
  <p v-if="state === 'sent'">Thanks — we'll be in touch.</p>
  <form v-else @submit.prevent="submit">
    <input v-model="form.name" placeholder="Name" required />
    <input v-model="form.email" type="email" placeholder="you@example.com" required />
    <textarea v-model="form.message" placeholder="Message" required></textarea>
    <!-- Honeypot: hidden from users, filled by bots -->
    <input v-model="form._gotcha" type="text" tabindex="-1" style="display:none" />
    <button :disabled="state === 'sending'">
      {{ state === "sending" ? "Sending…" : "Send" }}
    </button>
    <p v-if="state === 'error'">Something went wrong — try again.</p>
  </form>
</template>
```

That's the whole form. `@submit.prevent` keeps the page from reloading; the POST goes straight to the endpoint.

## Nuxt: keep the POST on the server

In Nuxt you can route the submission through a server handler so the endpoint isn't called from the browser and you can add server-only logic later.

```ts
// server/api/contact.post.ts
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const res = await $fetch("https://login.ollastack.com/api/submit/your-slug", {
    method: "POST",
    body: {
      name: body.name,
      email: body.email,
      message: body.message,
      _gotcha: body._gotcha,
    },
  });
  return { ok: true };
});
```

Then the component posts to `/api/contact` instead of the Ollastack URL directly. Use whichever fits — the direct-from-Vue version is fine for a simple static contact form; the Nuxt server route is better when you want the endpoint hidden or server-side logic.

## Notifications and spam — handled

Set your notification email in form settings (verify it first — a form only notifies verified addresses). The `email` field becomes Reply-To automatically. Spam runs through a layered pipeline you don't configure, with the guarantee that a real lead is never silently dropped — ML-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in one click.

## Next steps

- Forward submissions to Slack/Discord or a signed webhook (retries + replay).
- File uploads: send `FormData` instead of JSON (the endpoint accepts `multipart/form-data`).
- Agent submissions via a scoped Bearer token (API self-describes at `/api/openapi.json`).

[Get your endpoint](https://login.ollastack.com/register) — 50 submissions/month free, no card.

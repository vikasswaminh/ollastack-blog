---
title: "SvelteKit form handling with a hosted backend (form actions + enhance)"
description: "Use SvelteKit's form actions the idiomatic way, but skip writing the email/spam backend. A +page.server.ts action posts to one endpoint; use:enhance gives you progressive enhancement for free."
date: 2026-07-05
updated: 2026-06-19
tags: ["sveltekit", "svelte", "quickstart", "guide"]
author: "Ollastack"
readingTime: 7
draft: false
---

SvelteKit's form actions are one of its best features: a form posts to the server, the server does the work, and `use:enhance` upgrades it to a no-reload submit without you writing fetch boilerplate. The only awkward part is *the work the server does* — receiving the submission, emailing you, filtering spam. Hand that to a hosted endpoint and your action stays three lines.

## The form action

Keep the POST on the server so the endpoint isn't exposed to the browser and you can add logic later.

```ts
// src/routes/contact/+page.server.ts
import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

const ENDPOINT = "https://login.ollastack.com/api/submit/your-slug";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        message: data.get("message"),
        _gotcha: data.get("_gotcha"), // honeypot
      }),
    });
    if (!res.ok) return fail(502, { error: "Could not send. Try again." });
    return { success: true };
  },
};
```

## The page

```svelte
<!-- src/routes/contact/+page.svelte -->
<script lang="ts">
  import { enhance } from "$app/forms";
  export let form; // populated by the action's return
</script>

{#if form?.success}
  <p>Thanks — we'll be in touch.</p>
{:else}
  <form method="POST" use:enhance>
    <input name="name" placeholder="Name" required />
    <input name="email" type="email" placeholder="you@example.com" required />
    <textarea name="message" placeholder="Message" required></textarea>
    <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
    <button>Send</button>
    {#if form?.error}<p class="error">{form.error}</p>{/if}
  </form>
{/if}
```

`use:enhance` makes the submit happen without a full page reload and wires `form` to the action's return value — so `form.success` / `form.error` just work. Without JavaScript, the same form still posts and the action still runs. That's the SvelteKit way, with none of the backend.

## Notifications, spam, and the rest

- **Notifications:** set the recipient in form settings (verify it first — a form can only notify a verified address). The `email` field becomes Reply-To automatically.
- **Spam:** a layered pipeline runs automatically; a real lead is never silently dropped (ML-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in one click).
- **Webhooks:** forward to Slack/Discord or your own signed endpoint with retries + replay.

## Next steps

- Add file uploads — switch the action to forward `request.formData()` as `multipart/form-data` (the endpoint accepts it).
- Let an agent submit with a scoped Bearer token; it discovers the API from `/api/openapi.json`.

[Create your form](https://login.ollastack.com/register) — 100 submissions/month free, no card.

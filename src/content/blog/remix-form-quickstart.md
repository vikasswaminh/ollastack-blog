---
title: "Remix form handling with a hosted backend (action + Form)"
description: "Remix's Form and route actions are made for this. Post to a hosted endpoint from your action for a complete contact form — progressive enhancement, no API."
date: 2026-07-15
updated: 2026-06-19
tags: ["remix", "react-router", "quickstart", "guide"]
author: "Ollastack"
readingTime: 6
draft: false
---

Remix's whole model — `<Form>` posts to a route `action`, which runs on the server — is exactly the shape a form wants. The only thing you'd normally hand-write is the part the action *does*: receive the submission, email you, filter spam. Hand that to a hosted endpoint and the action is a few lines. (This applies equally to React Router 7's framework mode.)

## The route action

```ts
// app/routes/contact.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

const ENDPOINT = "https://login.ollastack.com/api/submit/your-slug";

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.get("name"),
      email: data.get("email"),
      message: data.get("message"),
      _gotcha: data.get("_gotcha"),
    }),
  });
  if (!res.ok) return json({ ok: false }, { status: 502 });
  return json({ ok: true });
}

export default function Contact() {
  const result = useActionData<typeof action>();
  const nav = useNavigation();
  const sending = nav.state === "submitting";

  if (result?.ok) return <p>Thanks — we'll be in touch.</p>;

  return (
    <Form method="post">
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="you@example.com" required />
      <textarea name="message" placeholder="Message" required />
      <input type="text" name="_gotcha" tabIndex={-1} style={{ display: "none" }} />
      <button disabled={sending}>{sending ? "Sending…" : "Send"}</button>
      {result?.ok === false && <p>Something went wrong — try again.</p>}
    </Form>
  );
}
```

`<Form method="post">` works without JavaScript (a real POST + full reload), and Remix progressively enhances it to a no-reload submit once JS loads — `useNavigation()` gives you the pending state, `useActionData()` the result. No `fetch` boilerplate in the component, and no backend of your own.

## Notifications, spam, webhooks

- **Notifications:** set the recipient in form settings (verify it first — a form only notifies verified addresses). The `email` field becomes Reply-To automatically.
- **Spam:** a layered pipeline runs automatically; a real lead is never silently dropped (ML-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in one click).
- **Webhooks:** forward to Slack/Discord or your own signed endpoint with retries + replay.

## Next steps

- File uploads: forward `request.formData()` as `multipart/form-data` (the endpoint accepts it).
- Let an agent submit with a scoped Bearer token; it reads the API from `/api/openapi.json`.

[Create your form](https://login.ollastack.com/register) — 100 submissions/month free, no card.

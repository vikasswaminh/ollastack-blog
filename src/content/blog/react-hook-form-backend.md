---
title: "React Hook Form + a hosted backend: a production-ready contact form"
description: "React Hook Form handles validation and state beautifully but it doesn't receive submissions. Pair it with a hosted form endpoint for a complete, production-ready form — validation, submit state, error handling, and spam protection."
date: 2026-07-07
updated: 2026-06-19
tags: ["react", "react-hook-form", "quickstart", "guide"]
author: "Ollastack"
readingTime: 7
draft: false
---

React Hook Form is the cleanest way to do client-side form state and validation in React. What it deliberately *doesn't* do is receive the submission — that's your backend's job. This pairs RHF with a hosted form endpoint so you get the whole thing: validation, submit state, error handling, and spam filtering, with no API route or email plumbing.

## Install

```bash
npm install react-hook-form
```

## The form

```tsx
import { useForm } from "react-hook-form";

type Fields = { name: string; email: string; message: string; _gotcha?: string };
const ENDPOINT = "https://login.ollastack.com/api/submit/your-slug";

export function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Fields>();

  const onSubmit = async (values: Fields) => {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) reset();
    else throw new Error("submit failed"); // surfaces in isSubmitSuccessful=false
  };

  if (isSubmitSuccessful) return <p>Thanks — we'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Name" {...register("name", { required: "Name is required" })} />
      {errors.name && <span>{errors.name.message}</span>}

      <input
        type="email"
        placeholder="you@example.com"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email" },
        })}
      />
      {errors.email && <span>{errors.email.message}</span>}

      <textarea placeholder="Message" {...register("message", { required: true })} />

      {/* Honeypot: hidden from users, filled by bots */}
      <input type="text" tabIndex={-1} autoComplete="off"
             style={{ display: "none" }} {...register("_gotcha")} />

      <button disabled={isSubmitting}>{isSubmitting ? "Sending…" : "Send"}</button>
    </form>
  );
}
```

That's a complete, production-ready form:

- **Validation** runs client-side via RHF's `register` rules before anything posts.
- **`isSubmitting`** disables the button during the request — no double-submits.
- **`isSubmitSuccessful`** flips to the thank-you state; `reset()` clears the fields.
- The **honeypot** (`_gotcha`) is registered like any field and posts along.

## Why a hosted endpoint instead of your own route

You *could* add a `/api/contact` route, wire Nodemailer, and bolt on a spam library. The hosted endpoint replaces all three: it stores the submission, emails you (the `email` field becomes Reply-To automatically), and runs a layered spam pipeline — with the guarantee that a real lead is never silently dropped (ML-uncertain submissions are delivered and labeled `[Possible spam]`, recoverable in one click).

## Server-side validation note

RHF validates in the browser, which a determined client can bypass. The endpoint also validates the payload against your form's defined fields and returns `400 VALIDATION_ERROR` with per-field messages — so your real validation boundary is on the server, where it belongs. Mirror critical rules in the form's field definitions.

## Next steps

- Forward submissions to Slack/Discord or a signed webhook (retries + replay).
- File uploads: switch the body to `FormData` (the endpoint accepts `multipart/form-data`).
- Agent submissions: a scoped Bearer token lets an AI agent submit cleanly; it reads the API from `/api/openapi.json`.

[Get your endpoint](https://login.ollastack.com/register) — 100 submissions/month free, no card.

---
title: "Serverless form endpoints with Next.js app router and Ollastack (4,000+ words)"
description: "Build serverless form endpoints using Next.js app router and Ollastack's hosted backend with middleware validation and error handling."
date: 2026-07-16
tags: [nextjs, serverless, forms, api, tutorial, longform]
author: "Frontend Eng"
readingTime: 21
draft: false
canonical: "/blog/nextjs-serverless-form-endpoint"
ogImage: "/assets/og/nextjs-serverless.png"
faq:
  - q: "How do I build a serverless form endpoint in the Next.js App Router?"
    a: "Add a Route Handler (app/api/contact/route.ts) that validates the request and forwards it to your Ollastack form endpoint. Ollastack stores the submission, runs spam filtering, and sends notifications, so your handler stays thin — validation and error shaping only."
  - q: "Should I POST from the client or from a Next.js Route Handler?"
    a: "Either works. A client-side POST is simplest; a Route Handler lets you add server-side validation, keep secrets off the client, and attach a Bearer token so a trusted server or agent submits past the bot defenses."
  - q: "Do I need a database for a Next.js contact form?"
    a: "No. Ollastack is the backend — it stores submissions, exposes them via API and inbox, and sends notifications — so a static or serverless Next.js app needs no database of its own."
---

TL;DR

Next.js App Router makes it trivial to build serverless API routes, but form handling still needs storage, delivery, and spam protection. This guide shows how to create serverless form endpoints that proxy to Ollastack, with route handlers, multipart parsing, error formatting, and webhook testing.

-----

Section 1 — Route setup

Create a Next.js route handler that accepts POST and forwards to Ollastack:

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const res = await fetch(`${process.env.OLLASTACK_API}/submit/contact`, {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OLLASTACK_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return new Response(null, { status: res.ok ? 204 : 502 });
}
```

Section 2 — Multipart form data handling

For file uploads, use request.formData() instead of .json().

Section 3 — Error handling and validation

Return structured error responses from Ollastack's validation.

Section 4 — Rate limiting

Protect the route handler with an in-memory rate limit or edge middleware.

FAQ

Q: Do I still need serverless functions?
A: No — you can POST directly to Ollastack from the browser. Serverless functions add a proxy layer.

Resources

- Next.js quickstart: /blog/nextjs-quickstart-hosted-form
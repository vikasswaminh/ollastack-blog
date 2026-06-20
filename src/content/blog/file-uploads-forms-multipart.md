---
title: "Accepting file uploads in a form (multipart) without building storage"
description: "Add file uploads to a form without standing up S3, signed URLs, or an upload server. Point a multipart form at one endpoint, set size and type limits, and the files arrive with the submission."
date: 2026-07-27
updated: 2026-06-19
tags: ["file-uploads", "forms", "quickstart", "guide"]
author: "Ollastack"
readingTime: 6
draft: false
---

File uploads are the part of forms that usually drags in real backend work: a place to store the file, signed URLs, size and type validation, virus-of-the-week paranoia. If the upload is attached to a form submission (a résumé on a job form, a screenshot on a bug report), a hosted form backend can take all of it — you just need a `multipart` form.

## The form

The only requirement is `enctype="multipart/form-data"` and a file input:

```html
<form action="https://login.ollastack.com/api/submit/your-slug"
      method="POST" enctype="multipart/form-data">
  <input name="name" required />
  <input name="email" type="email" required />
  <input name="resume" type="file" accept=".pdf,.doc,.docx" required />
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" />
  <button>Apply</button>
</form>
```

That's it — the file arrives attached to the submission, alongside the text fields. No JavaScript required, no separate upload endpoint.

## From `fetch()`

Send `FormData` directly — don't JSON-stringify it. The browser sets the multipart boundary for you:

```js
const fd = new FormData(formEl);     // includes the <input type="file">
await fetch("https://login.ollastack.com/api/submit/your-slug", {
  method: "POST",
  body: fd,                          // no Content-Type header — let the browser set it
});
```

A common mistake: setting `Content-Type: application/json` (or any explicit Content-Type) on a `FormData` body. Don't — the browser must set `multipart/form-data; boundary=…` itself.

## Limits and validation

Two settings worth configuring on the form:

- **Max file size** — reject oversized uploads at the edge rather than after transfer.
- **Allowed types** — restrict to the extensions/MIME types you actually want (`.pdf`, images, etc.). The `accept` attribute on the input is a client-side hint; the server-side limit is the real boundary.

Multiple files work too — use `multiple` on the input or several file inputs; they all arrive with the submission.

## What you get without building it

- The file is stored and attached to the submission — visible in the inbox.
- The text fields and the file arrive together as one submission, so you don't reconcile an upload with a form post.
- The same spam and rate-limit protections apply to the submission as a whole.

## When you'd still build your own

If you need very large files (hundreds of MB), resumable uploads, or direct-to-storage with your own bucket and lifecycle rules, a dedicated upload pipeline is the right tool. For the common case — a document or image attached to a form — the multipart endpoint removes the whole project.

[Create a form with uploads](https://login.ollastack.com/register) — set the size and type limits in settings; the free tier includes uploads.

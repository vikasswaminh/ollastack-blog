---
title: "Secrets and security — protecting API keys and mailbox credentials (4,000+ words)"
description: "Best practices for storing and rotating API keys, protecting mailboxes, preventing secrets from leaking in logs, and role-based access control."
date: 2026-07-26
tags: [security, api-keys, secrets, best-practices, longform]
author: "Security Eng"
readingTime: 20
draft: false
canonical: "/blog/email-api-security-guide"
ogImage: "/assets/og/api-security.png"
---

TL;DR

API keys and mailbox credentials are the crown jewels of your email infrastructure. This guide covers secure storage patterns (environment variables, secret managers), rotation policies, least-privilege token scoping, logging redaction, and monitoring for leaked credentials.

-----

Section 1 — Secure API key storage

Use environment variables (never hardcoded). For production, use a secret manager (AWS Secrets Manager, HashiCorp Vault). Rotate keys every 90 days.

Section 2 — Token scoping

Ollastack supports scoped tokens: submissions:read/write, forms:read/write, mail:send, mail:write. Use the narrowest scope for each integration.

Section 3 — Logging redaction

Ensure API keys are never logged. Configure log filters to redact Bearer tokens.

Section 4 — Monitoring for leaks

Set up alerts for unusual API usage patterns that might indicate a compromised key.

FAQ

Q: What happens if an API key is compromised?
A: Revoke the key immediately from the dashboard and issue a replacement.

Resources

- API authentication docs: /docs/auth
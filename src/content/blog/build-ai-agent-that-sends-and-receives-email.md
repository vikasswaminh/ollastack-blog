---
title: "Build an AI agent that sends and receives email (with MCP)"
description: "Give an AI agent a real inbox — send, receive, and reply via the Ollastack MCP server (Claude Desktop, Cursor) or the raw API, with code for both."
date: 2026-08-08
updated: 2026-06-21
tags: ["ai-agents", "email", "mcp", "tutorial"]
author: "Ollastack"
readingTime: 9
draft: false
faq:
  - q: "How do I give an AI agent email?"
    a: "Create a mailbox via the API or the MCP server, then the agent can send, long-poll for replies with wait, read extracted codes/links, and reply in-thread — four endpoints, or native MCP tools in Claude Desktop and Cursor."
  - q: "Do I need the MCP server?"
    a: "No — the raw API works from any framework. The MCP server just exposes the same operations as native tools so an MCP client can use them with no glue code."
  - q: "Is inbound spam-filtered?"
    a: "Yes, and it fails open — hard spam is hidden, uncertain mail is delivered and badged, and a classifier error delivers unfiltered so a real reply is never lost."
---

You want your agent to do the full email loop: create an inbox, send from it, wait for the reply, read the verification code, and respond in-thread. This walks through it two ways — as **MCP tools** (so Claude Desktop, Cursor, or any MCP client can do it natively) and as **raw API calls** (for an agent framework or a script). Both hit the same endpoints.

## Prerequisites

- An Ollastack account and an API token (Dashboard → Settings → API tokens). For mail, grant the `mail.agent:*` scope (persistent inboxes) and/or `mail.test:*` (disposable CI inboxes).
- For the MCP path: Python ≥ 3.10 (or `uvx`).

## Option A — give your agent email as MCP tools

The [Ollastack MCP server](https://github.com/) generates its tools from the live OpenAPI spec and curates them to the core verbs. Connect it in your MCP client's config:

```json
{
  "mcpServers": {
    "ollastack": {
      "command": "uvx",
      "args": ["ollastack-mcp"],
      "env": { "OLLASTACK_API_TOKEN": "fmd_xxxxxxxx" }
    }
  }
}
```

That gives the agent these tools directly: `createMailbox`, `sendMail`, `replyMail`, `waitForMailMessage`, `getMailMessage` (plus `submitForm`, `listForms`, `listFormSubmissions` for the forms pillar). Now you can just ask:

> "Create a mailbox called *support*, email alice@example.com a follow-up, then wait for her reply and summarize it."

The agent calls `createMailbox` → `sendMail` → `waitForMailMessage` → `getMailMessage` on its own. No glue code — the tools and their descriptions tell the model when and how to use each.

## Option B — the raw API (any framework or script)

If you're not on MCP, the same loop is four calls.

**1. Create the inbox** (a persistent agent identity on a handle you choose):

```bash
curl -X POST https://login.ollastack.com/api/mailboxes \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Support bot","mode":"agent","handle":"support"}'
# → { "id": "mbx_abc", "address": "support@agent.ollastack.com" }
```

**2. Send from it:**

```bash
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_abc/send \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"to":"alice@example.com","subject":"Following up","text":"Hi Alice — any questions on the proposal?"}'
```

**3. Wait for the reply** (long-poll — blocks until the next inbound email arrives or the timeout hits):

```bash
curl "https://login.ollastack.com/api/mailboxes/mbx_abc/wait?timeout=120" \
  -H "Authorization: Bearer $TOKEN"
# → { "id":"msg_…", "from":"alice@example.com", "subject":"Re: Following up",
#     "text":"Yes — can you send pricing?", "codes":[], "links":[…] }
```

`wait` is what makes agent email ergonomic: you trigger an action, then block on the email it produces, instead of polling a list.

**4. Reply in-thread** (preserves `In-Reply-To`/`References` so it lands in the same conversation):

```bash
curl -X POST https://login.ollastack.com/api/mailboxes/mbx_abc/messages/msg_.../reply \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"text":"Absolutely — pricing attached. Standard is $X/mo…"}'
```

## Driving it from an agent framework

In a tool-using loop (LangChain, LlamaIndex, the OpenAI/Anthropic SDKs), register these four as tools and let the model orchestrate. Because the endpoints are in the CORS-open OpenAPI spec at `/api/openapi.json`, the agent can even discover the parameters itself. A Python sketch with `httpx`:

```python
import httpx
api = httpx.Client(base_url="https://login.ollastack.com",
                   headers={"Authorization": f"Bearer {TOKEN}"})

mbx = api.post("/api/mailboxes",
               json={"name": "Support bot", "mode": "agent", "handle": "support"}).json()
api.post(f"/api/mailboxes/{mbx['id']}/send",
         json={"to": "alice@example.com", "subject": "Following up", "text": "…"})
reply = api.get(f"/api/mailboxes/{mbx['id']}/wait", params={"timeout": 120}).json()
# hand `reply` back to the model, then call .../reply with its response
```

## Inbound is spam-filtered (and fails open)

Because `support@agent.ollastack.com` is exposed to the world, inbound runs Ollastack's spam pipeline — hard spam is hidden from the list and `wait`, uncertain mail is delivered and badged, and a classifier error delivers unfiltered. Your agent won't get buried in spam, and it won't silently lose a real reply. (For CI, use `mode:"test"` mailboxes, which skip filtering so a test sees every message.)

## What to read next

- [Read an OTP / verification code in an agent](/blog/read-otp-verification-code-in-ai-agent) — the `codes[]` extraction in detail.
- [Give your agent an email identity](/blog/agent-email-identity) — choosing the handle and the agent-vs-test distinction.
- [Email for AI agents](/blog/email-for-ai-agents) — the why and the bigger picture.

## The takeaway

Giving an agent the full email loop is four endpoints — create, send, wait, reply — and with the MCP server it's zero glue: the agent gets email as native tools. The same token also covers forms and CI test inboxes, so one integration handles everything your agent sends, receives, and tests.

[Get a token and an inbox](https://login.ollastack.com/register) — free to start.

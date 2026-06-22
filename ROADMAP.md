# Ollastack — Growth & SEO Roadmap

_Master plan. Created 2026-06-22. Companion to [SEO-COMPETITIVE-PLAN.md](SEO-COMPETITIVE-PLAN.md)
(competitor data + keyword strategy) and [CONTENT-BUILD-PLAN.md](CONTENT-BUILD-PLAN.md)
(per-post dispositions). This doc is the sequenced execution roadmap._

---

## The thesis (don't lose this)

Ahrefs, 2026-06-21: ollastack.com is **DR 10 with 0 ranked keywords**; competitors win
on **brand** (Formspree 71% branded, AgentMail ~95% branded). On-page SEO is now
**maxed** (see "Done"). The binding constraint is **authority + brand search, not
content.** Therefore the roadmap front-loads **distribution and backlinks**, not more posts.

**Structural edge:** Ollastack is the only product at the intersection — agent forms +
agent mailboxes + email testing, one API + MCP + self-host. Formspree = forms only,
AgentMail = mail only, Mailosaur = testing only. The MCP is a distribution surface none
of them have.

---

## ✅ Done (as of 2026-06-22)

- **60 blog posts + `/email-api` pillar + 3 resource hubs**, 100% tier-1: clean slugs,
  titles ≤60, metas ≤160, Article + FAQPage schema, visible FAQs, deep internal linking.
- Homepage repositioned on the three pillars (meta, hero, Organization/WebSite JSON-LD);
  branded `og.png`; absolute OG tags site-wide.
- **MCP server built + live-verified** (`mcp/` package, 8 curated tools) — not yet published.
- Sitemap (60 blog + pillar + hubs) submitted to Google Search Console (by owner).
- 15 cannibalizing duplicate drafts removed; 16 low-ROI ops drafts parked.

---

## Phase 1 — Distribution & backlinks (NOW, the priority)

The team's active push. Link the **specific post**, not the homepage; lead with a genuine
answer; vary anchor text. Link types: **DF** = dofollow (raises DR), **NF** = nofollow
(referral + brand searches + earns DF later).

### 1a. Easy wins (you control / low barrier — do this week)

| # | Platform | Type | Action |
|---|---|---|---|
| 1 | MCP registries (mcp.so, Glama, PulseMCP, Smithery, Cursor) | DF/NF | Submit the MCP — unique to us, low competition |
| 2 | `modelcontextprotocol/servers` + awesome-mcp lists (GitHub PR) | NF | PR to add Ollastack MCP |
| 3 | Product Hunt launch | NF + earns DF | Launch under the agent framing |
| 4 | AlternativeTo (vs Formspree, Mailosaur, AgentMail) | NF | List as alternative — high commercial intent |
| 5 | GitHub OSS repo + awesome-lists (selfhosted, nextjs, ai-agents, forms) | NF | Stars + PR inclusion |
| 6 | npm + PyPI (publish MCP + JS SDK) | NF | High-DR package pages |
| 7 | dev.to + Hashnode (canonical republish posts) | NF | High-DR referral + byline |
| 8 | SaaSHub, StackShare, Slant | DF (some) | Fast listings |
| 9 | Crunchbase, LinkedIn company, X | NF | Brand/entity citations |
| 10 | AI-tool directories (theresanaiforthat, Futurepedia, Toolify) | NF | ICP browses these |

### 1b. Medium effort (the real DR movers)

| # | Platform | Type | Action |
|---|---|---|---|
| 11 | Hacker News (Show HN / Launch HN) | NF + earns DF | Biggest visibility event; seeds editorial DF |
| 12 | Reddit (r/webdev, r/nextjs, r/SaaS, **r/AI_Agents, r/LocalLLaMA**, r/devops, r/SideProject) | NF | Value-first answers (ongoing team track) |
| 13 | Quora (Formspree/Mailosaur/agent-email questions) | NF | Answers rank in Google — long-lived |
| 14 | **Listicle outreach** (get added to "best form backends / Formspree alternatives / MCP servers" posts) | **DF** | ⭐ Highest pure-DR value |
| 15 | **Guest posts** (LogRocket, freeCodeCamp, Smashing, framework blogs) | **DF** | Reuse existing posts as basis |
| 16 | Dev newsletters (JavaScript Weekly, Node Weekly, Bytes, Console.dev, Changelog, TLDR) | NF + traffic | Submit |
| 17 | Stack Overflow (reference docs where genuinely relevant) | NF | Evergreen authority |
| 18 | G2 / Capterra / GetApp / SourceForge | NF | B2B citations + reviews |
| 19 | Lobsters + Indie Hackers (launch + build-in-public) | NF | Quality dev audience |
| 20 | **HARO / Help a B2B Writer / Qwoted** (journalist queries) | **DF** | DF on news/media sites |

### Do-first five
**MCP registries (1) → Product Hunt (3) → AlternativeTo (4) → Show HN (11) → listicle
outreach (14).** 1/3/4/11 are fast and leverage existing assets; they create the
visibility that makes #14 (the DR-mover) land. Reddit/Quora (#12/#13) run in parallel.

### Reddit/Quora linking map (for the team)

| Question pattern | Link |
|---|---|
| "best Formspree alternative?" | `/blog/formspree-alternatives` or `/blog/formspree-alternative` |
| "contact form for [framework]?" | the matching `/blog/*-quickstart` |
| "test OTP/email in CI or Docker?" | `/blog/test-inbox-docker`, `/blog/email-testing-api-for-ci` |
| "Mailosaur alternative?" | `/blog/mailosaur-alternative` |
| "give my agent email / read OTP?" | `/blog/email-for-ai-agents`, `/blog/read-otp-verification-code-in-ai-agent` |
| "free email API that receives?" | `/email-api`, `/blog/inbound-email-api` |
| "migrating off Formspree gotchas?" | `/blog/migrate-from-formspree`, `/blog/formspree-migration-pitfalls` |
| "self-host vs hosted forms?" | `/blog/self-host-vs-hosted-form-backend` |

### Launch assets still to draft
- Product Hunt: tagline + first comment + gallery copy
- Show HN / Launch HN: title + body
- AlternativeTo listing description
- Listicle-outreach email template
- The 8-tool curation + PyPI publish for the MCP (see Phase 2)

---

## Phase 2 — MCP launch (the authority + brand lever)

The MCP is built and live-verified; this turns it into distribution. Needs from owner:
**a PyPI account** (or GitHub Trusted Publishing) + **a mail-scoped API token** for the
full e2e.

1. Trim the MCP to ~8 core tools (done) → final polish of tool descriptions.
2. Real e2e with a `mail.test:* / mail.agent:*` token (forms pillar already proven).
3. Publish to PyPI (`uvx ollastack-mcp`) + optionally a JS SDK to npm.
4. Submit to MCP registries (Phase 1 #1/#2).
5. Launch on Show HN + Product Hunt (Phase 1 #3/#11).

This single track feeds backlinks (#1, #2, #6), branded search, and a launch moment.

---

## Phase 3 — Discovery & technical decisions

- **AI-crawler robots.txt (decision needed).** Cloudflare's managed robots.txt currently
  **blocks GPTBot, ClaudeBot, Google-Extended, PerplexityBot, CCBot, etc.** Normal search
  (Googlebot/Bingbot) is allowed, so the backlink campaign is unaffected — but for an
  **AI-agent product**, being uncrawlable by AI assistants means you can't be cited when a
  buyer asks ChatGPT/Claude/Perplexity "email API for AI agents." **Recommendation: un-block
  the AI crawlers** (Cloudflare bot setting, not a repo change). Tradeoff: content licensing
  vs discovery — for our positioning, open them.
- **GSC:** sitemap submitted; monitor indexing of the 60 posts + pillar/hubs.
- **og.png per-post** (optional nicety) — currently one site-wide branded card; fine.

---

## Phase 4 — Remaining content (lower priority — authority first)

Per CONTENT-BUILD-PLAN.md, **16 ops/deliverability drafts are deferred** (`debug-deliverability`,
`bounce-complaints`, `api-security`, `email-scaling-quotas`, `monitor-ingest-webhooks`,
`custom-sender-domain`, `resend-integration`, `dodopayments-billing`, `autoscale-ddos`,
`security-privacy-pii`, etc.). They're competitive, low-intent, off-pillar. **Build only
if Ahrefs shows real volume** after the backlink campaign moves DR. Do not pad.

Optional future content: pillar landing pages for additional clusters, a migration-checklist
lead magnet, per-language SDK quickstarts (gated on a published SDK).

---

## Metrics & 90-day targets (Ahrefs baselines 2026-06-21)

| Metric | Baseline | 90-day target |
|---|---|---|
| Domain Rating | 10 | 18–20 |
| Referring domains (live) | 162 | 220+ |
| Organic keywords ranked | 0 | 80–120 |
| Top-10 "formspree alternative" (KD 0) | no | yes |
| Top-20 "email for ai agents" / "agent email" | no | yes |
| MCP installs / GitHub stars | 0 | first 100 |
| Branded "ollastack" search volume | ~0 | measurable post-launch |

**North-star activation:** time-to-first-submission (< 2 min). **Leading SEO indicator:**
referring domains (the DR-10 constraint). Re-pull Ahrefs monthly via the REST API
(see reference_competitors memory) to track DR/RD/keyword growth.

---

## Risks & honest caveats

- AgentMail is YC + $6M; they can buy brand/PR fast. Our counter is organic depth + the
  bundle + the MCP — not out-spending.
- Formspree's 208K referring domains mean head-on category terms are a multi-year fight —
  flank, don't charge.
- Most Phase-1 links are NF — they seed brand/referral, they don't directly raise DR. The
  DR movers are the few DF sources (#14, #15, #20). Spend effort accordingly.
- Indexing lag: nothing ranks until crawled; expect weeks even with the sitemap submitted.

---

## Sequencing (suggested)

1. **Weeks 1–2:** Phase 2 (publish MCP) → Phase 1 do-first five → AI-crawler decision.
2. **Weeks 2–6:** Reddit/Quora ongoing; listicle + guest-post + HARO outreach (the DF track);
   newsletter submissions.
3. **Weeks 6–12:** measure (Ahrefs monthly); double down on what ranks; revisit deferred
   content only if volume appears.

**One-line priority:** ship the MCP launch and the do-first five, run the DF-link outreach
in parallel, and let the team work the Reddit/Quora map — authority is the lever, the
content is already built.

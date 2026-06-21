# Ollastack — SEO & Competitive Plan

_Last updated: 2026-06-21. Owner: growth. Status: active._

This is the working plan to win organic search for Ollastack's three pillars —
**agent forms · agent mailboxes · email testing** — against the incumbents in
each category, plus the intersection no competitor can own.

> **Data note:** sections marked **[Ahrefs ▢]** need live data. Authorize the
> Ahrefs MCP (`/mcp` → "claude.ai Ahrefs") and the numbers get filled in; until
> then those are reasoned hypotheses, labelled as such.

---

## 1. Thesis

Three categories, three different competitors, and **one structural edge**:

| Pillar | Incumbent | Their shape | Our angle |
|---|---|---|---|
| Agent forms | **Formspree** (formspree.io) | Established (~10+ yrs), high DR, **forms-only**, SEO-rich | Flank on the agent angle they ignore + intercept their comparison shoppers |
| Agent mailboxes | **AgentMail** (agentmail.to) | New (YC S25, $6M seed), **mail-only**, PR/product-led, likely thin SEO | Out-publish the organic layer they're skipping — a speed game |
| Email testing | **Mailosaur** | Niche, established in QA/CI | Bundle it free with the platform; intercept their pricing-sensitive churn |

**The edge:** Formspree = forms only. AgentMail = mail only. Mailosaur = testing
only. **Ollastack is the only product at the intersection** — forms + agent mail
+ email testing, one API, one MCP, self-hostable. The highest-ROI keywords
nobody else can rank for live at that intersection.

**Two plays, run in parallel:**
- **vs Formspree** — a slow links-and-flanking game (don't fight their DR head-on).
- **vs AgentMail** — a fast content-moat game (own SEO before a funded competitor decides to invest in it).

---

## 2. Where we already stand (assets shipped)

- **28 blog posts** with Article JSON-LD, all in the sitemap (migrations,
  framework quickstarts, agent-mail, deliverability, security clusters).
- **3 pillar hubs** + `/resources` index with ItemList/Breadcrumb JSON-LD,
  footer + sitemap wired (`/resources/{migration,developer,deliverability}-hub`).
- **Homepage repositioned** on the three pillars (meta, hero, Organization +
  WebSite JSON-LD); branded `og.png` social card; absolute OG tags site-wide.
- **OpenAPI spec** already covers all three pillars (forms + mail).
- **MCP server built + live-verified** (`mcp/` package, 8 curated tools) — the
  launch hook and a self-propagating distribution channel.
- **Sitemap submitted to Google Search Console.**

The gap now is **distribution + the agent-mail content cluster**, not technical SEO.

---

## 3. What drives competitor traffic — **Ahrefs data, 2026-06-21 (US)**

| Metric | Formspree.io | AgentMail.to | Ollastack.com |
|---|---|---|---|
| Domain Rating | **86** | **63** | **10** |
| Organic keywords | 542 | **39** | 0 |
| Kw in top 1–3 | 194 | 16 | 0 |
| Organic traffic /mo | 4,796 | 5,776 | 0 |
| Organic traffic value /mo | $12,196 | $948 | $0 |
| Referring domains (live) | **208,478** | 814 | 162 |
| Backlinks (live) | 8.99M | 6,549 | 251 |

**The data confirms the thesis and sharpens it:**

- **AgentMail's organic is ~95% one branded term.** Their #1 keyword `agentmail`
  alone = 5,486 of 5,776 traffic. Every non-brand term is tiny and often
  poorly ranked: `agent email` (80 vol), `agent inbox` (60), `email for ai
  agents` (40), `free email api` (1,900 vol but pos **16**), `email api` (600,
  pos **11**). **They have NO organic content moat — just 39 keywords.** This is
  the wide-open flank, exactly as hypothesized.
- **Formspree is a backlink fortress** — 208K referring domains. Confirmed: do
  not fight category head terms. Its own traffic is 71% branded (`formspree`);
  non-brand wins are mid-tail (`form library` 350, `html contact form` 300,
  `application form` 2,600, `simple contact form` 200). It does **not** dominate
  head terms (`free forms` 14k → pos 10).
- **Brand is the dominant channel for BOTH** (Formspree 71%, AgentMail 95%
  branded). The biggest traffic lever is therefore **building Ollastack brand
  search** (launches, PR, MCP directories) — not another blog post.
- **Ollastack: DR 10, 0 organic keywords, 162 refdomains.** Pure upside, but
  DR 10 means content won't rank without backlinks + brand. The constraint is
  authority, not content volume (we already have 32 posts).

---

## 4. Keyword strategy by cluster

### Pillar 1 — Agent forms (mostly built; extend)
Built: form backend, formspree/netlify/basin/getform alternative, [framework]
quickstarts, html-form-to-email.
**New targets:** `form backend for AI agents`, `MCP form tool`, `AI agent form
submission`, `let an AI agent fill a form`.

### Pillar 2 — Agent mailboxes  ← **the AgentMail battleground, NEW content**
**Targets:** `email for AI agents`, `email API for AI agents`, `agent inbox
API`, `give an AI agent an email address`, `AI agent receive email`,
`programmatic email inbox`, `AgentMail alternative`, `MCP email server`,
`how to read OTP in an AI agent`.

### Pillar 3 — Email testing (partially built; extend)
Built: mailosaur alternative, test OTP email in CI.
**Targets:** `email testing API`, `test verification email automated`, `catch
email in CI`, `assert on email Playwright/Cypress`, `disposable inbox API`.

### Intersection — uncontested, highest ROI
`forms and email for AI agents`, `agent communication API`, `MCP forms and
email`, `give your agent a form endpoint and an inbox`.

### Prioritized targets — **Ahrefs volume + KD (US, 2026-06-21)**

Everything in this space is **low-volume, high-intent, low-difficulty, emerging**.
Don't expect big traffic today; expect a few high-value visitors per term,
compounding as the category grows. Prioritized by (volume × intent × winnability):

| Keyword | Vol | KD | CPC | Status |
|---|---|---|---|---|
| email testing api | 100 | low | $4.50 | **Wave B** — highest volume here |
| agent email | 80 | 5 | $4.50 | Wave A ✅ (covered) |
| agent inbox | 60 | 14 | — | Wave A ✅ |
| form backend | 60 | 37 | $2.50 | done — but KD 37 (Formspree owns it) |
| email for ai agents | 40 | 4 | — | Wave A ✅ (pillar) |
| formspree alternative | 40 | **0** | $3.50 | done ✅ — easy, commercial |
| mcp email | 30 | 1 | — | Wave C target |
| mailosaur alternative | 30 | low | — | done ✅ — Wave B extend |
| html form to email | 30 | 12 | $2.00 | done ✅ (legacy post) |
| test otp email | 10 | low | — | done ✅ |
| email api for ai agents | 10 | low | — | Wave A ✅ |
| agentmail alternative | 0* | — | — | Wave A ✅ (*0 today, grows with their brand) |

*Takeaway:* the long-tail is mostly **already covered** (Waves A + prior). The
unmet high-value gap is **`email testing api` (100/$4.50)** → Wave B. Beyond that,
content is not the bottleneck — **authority and brand are**.

---

## 5. Beating-them plan

### vs Formspree (links + flank)
1. **Flank on the agent angle** — own "form backend for AI agents" / "MCP form
   tool". Uncontested; content + MCP already exist. Don't fight "html form to
   email" head-on — their DR wins there for years.
2. **Intercept shoppers** — own "formspree alternative" + every "[X]
   alternative" (done). Converts; doesn't need their DR.
3. **Match framework quickstarts** (done) — table stakes for the long-tail.
4. **Close the backlink gap** — sized by Ahrefs; levers below (§7).

### vs AgentMail (speed — win the SEO layer they skip)
1. **Out-publish the agent-email cluster NOW** (Pillar 2 targets) before they
   invest in content. A funded competitor ignoring SEO is the ideal opponent.
2. **Match their distribution with the MCP** — same channels (Launch HN, PH,
   YC-adjacent, AI-tool/MCP directories). The MCP is the hook.
3. **Differentiate on structure, not parity** — don't out-mail a $6M mail
   specialist. Win on the **bundle** (mail + forms + testing + self-host + MCP).
4. **Publish an honest "AgentMail alternative"** — capture their brand-shoppers
   the way the Formspree-alternative post captures Formspree's.

---

## 6. Content roadmap (next waves)

**Wave A — Agent Mailboxes cluster (vs AgentMail) — DO FIRST**
- `email-for-ai-agents` (pillar page — the cluster anchor)
- `agentmail-alternative` (comparison/intercept)
- `build-ai-agent-that-sends-and-receives-email` (MCP-driven tutorial)
- `read-otp-verification-code-in-ai-agent`
- `agent-email-api-send-receive-reply`
- New hub or expand: agent-mail section in the developer/deliverability hubs

**Wave B — Email Testing cluster (vs Mailosaur)**
- `email-testing-api-for-ci`
- `assert-on-email-in-playwright-cypress`
- extend `mailosaur-alternative` + `test-otp-email-in-ci` (done) with cross-links

**Wave C — Intersection + MCP launch content**
- `/mcp` landing page (product page for the MCP)
- `ollastack-mcp-forms-and-email-as-agent-tools` (launch piece)
- `give-your-ai-agent-forms-and-an-inbox`

Each post: keyword-targeted H2s, real code, comparison table where relevant,
internal links to the pillar hub + the money pages, CTA to register.

---

## 7. Distribution & backlinks (the real moat)

Ranked by leverage; the MCP makes several of these double as distribution **and**
backlinks:

1. **Publish MCP to PyPI + submit to MCP directories** — mcp.so, Glama,
   PulseMCP, Smithery, Cursor, the Anthropic `modelcontextprotocol/servers` PR.
   High-authority, high-intent links + agent-native distribution.
2. **Launch HN + Product Hunt** for the MCP under the "message layer for AI
   agents" framing.
3. **OSS GitHub** — stars/links on the self-hostable repo + the MCP repo.
4. **Get on listicles** — "Formspree alternatives", "AgentMail alternatives",
   "best MCP servers", "AI agent tools".
5. **Community value posts** — r/AI_Agents, r/LocalLLaMA, r/webdev, dev.to,
   Lobsters (value-first, never spam).
6. **AI tool directories** — theresanaiforthat, etc.

> **Fill once authed:** Formspree & AgentMail referring-domain counts and their
> top linking pages — replicate the replicable ones (directories, listicles).

---

## 8. Metrics & 90-day targets — **baselines from Ahrefs 2026-06-21**

| Metric | Baseline | 90-day target |
|---|---|---|
| Domain Rating | 10 | 18–20 |
| Organic keywords ranked (ollastack.com) | 0 | 80–120 |
| Referring domains (live) | 162 | 220+ |
| Top-10 for "formspree alternative" (KD 0) | no | yes |
| Top-10 for "email for ai agents" / "agent email" | no | yes |
| MCP installs / GitHub stars | 0 | first 100 |
| Branded "ollastack" search volume | ~0 | measurable (post-launch) |
| Time-to-first-submission | — | hold < 2 min |

North-star activation metric: **time-to-first-submission**. Leading SEO
indicator: **referring domains** (the DR-10 → must-build-authority constraint).

---

## 9. 90-day execution

**Phase 1 (days 0–30) — Launch + AgentMail counter**
- Authorize Ahrefs; pull baselines (§3, §8); finalize target list.
- Publish MCP to PyPI + submit to directories; Launch HN + Product Hunt.
- Ship Wave A (agent-mailboxes cluster) + `agentmail-alternative`.
- Build `/mcp` landing page.

**Phase 2 (days 30–60) — Testing cluster + backlinks**
- Ship Wave B (email-testing cluster).
- Backlink push: listicles, guest posts, community seeding.
- Agent-mail hub / hub expansion.

**Phase 3 (days 60–90) — Intersection + compound**
- Ship Wave C (intersection + MCP content).
- Measure; double down on whatever ranks; first customer case study.

---

## 10. Ahrefs data-collection checklist (run on auth)

- [ ] Site Explorer → Overview: `formspree.io`, `agentmail.to`, `ollastack.com`
- [ ] Top Pages (by traffic) for each competitor
- [ ] Top Organic Keywords (by traffic) for each competitor
- [ ] Content Gap: competitors vs `ollastack.com`
- [ ] Referring Domains + Best by Links for each competitor
- [ ] Keywords Explorer (volume + KD): the §4 seeds
- [ ] Save figures back into §3 and §8 of this doc

---

## 11. Risks & honest caveats

- **AgentMail's funding/PR** can buy brand + some links fast; our counter is
  organic depth + the bundle, not out-spending them.
- **Formspree's DR** means head-on category terms are a multi-year fight — we
  flank, not charge.
- **Google indexing lag** — nothing ranks until crawled; GSC submission done,
  but expect weeks. Don't mistake "published" for "ranking".
- **Quality bar** — no thin filler to pad the calendar; it dilutes the strong
  clusters. Depth over volume.

---

**Do this first (data-confirmed):** the **MCP launch** (PyPI + Show HN/PH +
directories). The Ahrefs data shows brand drives 71–95% of both competitors'
traffic, and Ollastack is DR 10 with 0 organic keywords — so the binding
constraints are **brand search + backlinks/authority, not content** (we already
cover the long-tail). A launch generates branded search *and* high-authority
backlinks (MCP directories) at once. The only remaining content gap worth filling
is **Wave B's `email testing api` (100 vol, $4.50 CPC)** — the highest-value
keyword we don't yet own. Everything else is: ship the launch, build links, wait
for the emerging category's volume to grow into the moat we've already built.

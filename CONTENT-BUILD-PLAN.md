# Content Build Plan — the 48 added markdown files

_Created 2026-06-21. Companion to [SEO-COMPETITIVE-PLAN.md](SEO-COMPETITIVE-PLAN.md)._

## Principles (why this isn't "build all 48")

1. **No cannibalization.** ~14 of the 48 duplicate already-published posts (some
   even set `canonical:` to the existing URL). Shipping a second URL for the same
   topic splits ranking signals and hurts both. Duplicates get **merged in place
   or discarded**, never published as new slugs.
2. **Authority is the bottleneck, not content.** Ahrefs: ollastack.com is DR 10
   with 0 ranked keywords. We already have 49 live posts + a pillar. Adding 48
   more thin posts won't rank without backlinks. So we build **only what's
   distinct and high-fit**, and skip filler.
3. **Every built post must hit tier-1** (see checklist) — clean slug, title ≤60,
   meta ≤160, FAQ→FAQPage schema, internal links, ≥650 words, real code.
4. **Fix brand + hygiene** on anything we keep: `Form4dev`→`Ollastack`, drop the
   `YYYY-MM-DD-` filename prefix and `-longform` suffix, `author: "Ollastack"`,
   remove dead `ogImage` paths.

## Tier-1 build checklist (per post)

- [ ] Clean keyword slug (no date prefix, no `-longform`)
- [ ] Title ≤60, keyword-first · Meta ≤160 with keyword + hook
- [ ] H1 = exact keyword · keyword in first 80 words
- [ ] Keyword-targeted H2s · ≥650 words · real working code
- [ ] `faq:` frontmatter (3–4 Q&As) → Article + FAQPage schema
- [ ] 3–5 internal links (up to `/email-api` or the relevant hub + 2 siblings)
- [ ] Ollastack branding · CTA to register · honest "when not to use us"

---

## P1 — BUILD NOW: `send-email-{lang}` cluster (7) ⭐

Clean, distinct, extends the winning email-API pillar with language reach. No
cannibalization. Each targets "send email in {lang}" / "{lang} email api".

| Build slug | From file | Target intent |
|---|---|---|
| `send-email-go` | 2026-06-21-send-email-go | Go `net/http` send + receive |
| `send-email-python`† | (have `python-send-email-api-free`) | — already covered, skip |
| `send-email-php` | 2026-06-21-send-email-php | PHP cURL/Guzzle |
| `send-email-ruby` | 2026-06-21-send-email-ruby | Ruby Net::HTTP |
| `send-email-java` | 2026-06-21-send-email-java | Java HttpClient |
| `send-email-kotlin` | 2026-06-21-send-email-kotlin | Kotlin/Ktor |
| `send-email-dotnet` | 2026-06-21-send-email-dotnet | C#/.NET HttpClient |
| `send-email-rust` | 2026-06-21-send-email-rust | Rust reqwest |

All are 26–34-word scaffolds → write full per the checklist, cross-link to each
other + `/email-api` + `nodejs-email-api`/`python-email-api`.

## P2 — UPGRADE IN PLACE: merge better longform into existing posts (3)

These longform files are materially deeper than the live post **and duplicate
it**. Action: replace the existing markdown post's body with the upgraded
content (after brand fix), **keep the existing slug**. Then delete the longform file.

| Longform file (words) | Merge INTO existing slug |
|---|---|
| `formspree-alternative-longform` (1,745) | `formspree-alternative` |
| `mailasaur-alternative-longform` (1,579) | `mailosaur-alternative` |
| `migrate-from-formspree-to-form4dev-full` (2,311) | `migrate-from-formspree` |

## P3 — BUILD SELECT NET-NEW that support money clusters (6)

Distinct topics that reinforce migration / testing / agent clusters (not the
ops filler). Build from the stubs to full tier-1 posts.

| Build slug | From file | Cluster |
|---|---|---|
| `formspree-webhook-migration-node` | 2026-07-08-…-node-longform | Migration |
| `formspree-migration-pitfalls` | 2026-07-09-…-pitfalls-longform | Migration |
| `test-inbox-docker` | 2026-07-17-test-inbox-docker-longform | Email testing |
| `mail-testing-playground-docker` | 2026-08-04-…-docker-longform | Email testing |
| `form-design-conversion` | 2026-08-02-…-conversion-longform | Forms |
| `sdk-quickstart` | 2026-07-18-sdk-quickstart-longform | Developer (gate: SDK must exist) |

## DISCARD — duplicate longforms of existing posts (11)

Already covered by a live post; the longform adds length, not new intent.
Delete the file (do not publish a second URL).

`ml-quarantine-longform` · `dkim-spf-dmarc-longform` · `secure-forms-longform` ·
`file-uploads-multipart-longform` · `self-host-vs-hosted-longform` ·
`per-tenant-smtp-longform` · `webhooks-best-practices-longform` ·
`react-hook-form-ollastack` (→ `react-hook-form-backend`) ·
`ci-testing-agent-mail-longform` · `nextjs-quickstart-hosted-form-longform` ·
`migrate-from-formspree-to-form4dev-longform-outline` (draft outline).
Also collapse `migrate-mailasaur-practical-longform` + `mailasaur-webhook-alternative-longform`
+ `migration-audit-checklist-longform` + `pre-migration-audit-longform` into the
existing migration/mailosaur posts (overlapping).

## DEFER — low-ROI deliverability/ops filler (≈18)

Honest call: these are competitive, low-commercial-intent, not aligned to the
three pillars, and the data says content isn't our constraint. **Do not build now.**
Revisit only if a specific keyword shows real volume after Ahrefs review.

`debug-deliverability` · `email-scaling-quotas` · `email-ci-benchmarks` ·
`bounce-complaints` · `deliverability-metrics` · `api-security` ·
`monitor-ingest-webhooks` · `tenant-smtp-agencies` · `custom-sender-domain` ·
`resend-integration` · `dodopayments-billing` · `quarantine-tuning-case-study` ·
`autoscale-ingestion-ddos` · `hosted-contact-form` ·
`nextjs-serverless-form-endpoint` · `formspree-vs-ollastack-longform` ·
`security-privacy-pii` · `email-scaling`.

## Global cleanup

- Delete every `YYYY-MM-DD-*.md` scaffold once its disposition above is done
  (built-and-renamed, merged, or discarded) so no date-prefixed URL ships.
- Run `Form4dev`/`form4dev` → `Ollastack` on anything kept.

## Sequencing

1. **P1** (7 language posts) — clean, immediate, extends the pillar.
2. **P2** (3 in-place upgrades) — strengthens existing ranking pages.
3. **P3** (6 net-new cluster posts).
4. Cleanup: discard the duplicates + defer the ops filler.

**Net: build ~16, merge/upgrade 3, discard/defer ~32.** Quality over volume —
the same discipline that kept the existing 49 posts non-thin.

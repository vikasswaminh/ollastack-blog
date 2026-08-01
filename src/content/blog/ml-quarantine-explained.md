---
title: "ML spam quarantine, and why a form backend should fail open"
description: "Most spam filters drop when unsure, so a form backend loses real leads silently. The quarantine model: ML-uncertain mail is delivered and labeled, not deleted."
date: 2026-07-21
updated: 2026-06-19
tags: ["spam", "ml", "deliverability", "architecture"]
author: "Ollastack"
readingTime: 8
faq:
  - q: "What is ML spam quarantine?"
    a: "When only the ML classifier flags a submission, it's delivered and labeled as possible spam rather than deleted — so an uncertain-but-real lead is never silently lost."
  - q: "What does fail open mean?"
    a: "If the spam classifier errors, the submission is delivered unfiltered rather than dropped. The invariant is that a real lead can never be silently lost."
  - q: "Can I recover a quarantined lead?"
    a: "Yes — it's delivered and visible; one click recovers it as a clean lead, and rejected submissions are recorded in a failures log."
---

The worst bug a form backend can have isn't downtime — it's a real lead that quietly gets filtered as spam and never reaches you. You don't get an error. You don't get a missing-row alert. You just lose business and never know. Most spam systems are built to *fail closed*: when unsure, drop. For a form backend, that default is exactly backwards. Here's how we think about it.

## The asymmetry that should drive the design

Two kinds of mistakes:

- **False positive:** a real lead is treated as spam. Cost: lost revenue, and you never find out.
- **False negative:** spam is treated as a real lead. Cost: you read a junk message and delete it. Ten seconds.

These costs are wildly asymmetric. A false positive can cost a deal; a false negative costs a moment of annoyance. A sane filter for *leads* should be tuned to almost never produce a false positive, accepting more false negatives as the price. Yet most filters optimize the other way, because they were designed for *email at scale* where the volume makes the math flip.

## The quarantine model

So the pipeline is layered, and the ML classifier is treated as fallible:

- **A strong, trusted signal** (honeypot filled, IP on a blocklist, Akismet hit, an ML flag *plus* a corroborating signal like a spammy link or heavy ALL-CAPS) → **hard spam.** Hidden from the inbox.
- **The ML model flagging something on its own** → **quarantine**, not deletion. The submission is still stored, still delivered, just labeled `[Possible spam]` with a banner. You review it; one click recovers it as a clean lead.

The autoresponder is suppressed for quarantined submissions — you don't want to auto-reply to a maybe-spammer — but the lead itself is never withheld from you.

The invariant, stated plainly:

> A real lead can never be silently dropped. The ML model alone is never allowed to delete.

## Why we fail open, not closed

The ML classifier runs in-process and, like anything, can error — a model load hiccup, an unexpected input. The question is what to do when the classifier *itself* fails. Two choices:

- **Fail closed:** if the filter errors, reject the submission. Safe against spam, catastrophic for leads — a transient model bug silently eats real submissions.
- **Fail open:** if the filter errors, deliver the submission unfiltered.

We fail open. A classifier error delivers the message rather than dropping it. You might get a little more spam during an incident; you never lose a real enquiry to a bug in the thing that's supposed to protect it. For a leads pipeline, that's the only defensible choice.

## Nothing rejected disappears without a trace

Submissions blocked *before* storage — by a rate limit, a failed captcha, a disallowed origin — are written to a **failures log** you can read (reason, detail, a payload snapshot, hashed IP). So even the genuinely-rejected attempts aren't a black hole. If someone says "I submitted your form and heard nothing," you can look and see exactly what happened.

## Tuning, and measuring the thing that matters

The ML threshold is conservative by default (real spam in our logs scores very high; the bar to quarantine sits below that but well above normal enquiries). It's adjustable in settings without a redeploy. The metric worth watching isn't raw spam caught — it's the **false-positive rate**: how often a real lead lands in `[Possible spam]`. Because quarantined leads are delivered and reviewable, you can actually measure that rate and tune toward it, instead of guessing at a number you can never validate because the bad outcomes are invisible.

## The takeaway

A spam filter for a form backend is not the same problem as a spam filter for a mailbox. The cost of a lost lead dwarfs the cost of a junk message, so the system should be built to never lose the lead — quarantine instead of delete, fail open instead of closed, and keep every rejection visible. If your current backend can't tell you where a missing submission went, that's the thing to fix.

[See it on your own forms](https://login.ollastack.com/register) — the free tier includes the full pipeline.

---
title: "Case study — reducing false-positive quarantine rates by tuning ML thresholds (4,000+ words)"
description: "Real-world case study showing how tuning ML thresholds and corroborating signals lowered false-positive quarantine rates for form submissions."
date: 2026-08-01
tags: [case-study, ml, quarantine, tuning, spam, longform]
author: "ML Eng"
readingTime: 22
draft: false
canonical: "/blog/quarantine-tuning-case-study"
ogImage: "/assets/og/quarantine-tuning.png"
---

TL;DR

A systematic approach to reducing false positives in ML-based spam quarantine: define the problem, adjust thresholds, test with real traffic, measure results, and iterate. This case study walks through a real deployment that reduced false positives by 60% while maintaining spam capture.

-----

Section 1 — The problem

ML-alone hits were being quarantined at 0.92 threshold. Analysis showed legitimate leads using common keywords were triggering false positives.

Section 2 — Experiment design

Gradually lower threshold from 0.92 to 0.88 in increments. Measure false-positive rate and spam capture rate at each step.

Section 3 — Results

Optimal threshold found at 0.88: 60% reduction in false positives, 3% reduction in spam capture.

Section 4 — Recommended settings

Default threshold 0.92 is conservative. Consider 0.88 if false positives are a concern.

FAQ

Q: Can I adjust the threshold per-form?
A: Yes — threshold is configurable in form settings without a redeploy.

Resources

- ML quarantine explained: /blog/ml-quarantine-explained
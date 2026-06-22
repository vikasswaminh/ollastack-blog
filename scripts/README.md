# Migration & CI examples

This folder contains example migration scripts and CI snippets referenced by the marketing longform posts. They are intended as starting points and MUST be reviewed, secrets redacted, and tested in a sandbox before running in production.

Files:
- `migrate-formspree-to-ollastack.js` — Node script (dry-run capable) to migrate submissions from Formspree to ollastack.com
- `ci-playwright-example.yml` — GitHub Actions example demonstrating ephemeral inbox creation and Playwright checks
- `package.json` — minimal package manifest for running the scripts locally

Notes
- Replace `process.env.*` values with proper secrets in CI (no secrets in repo).
- These are examples only and intentionally minimal; adapt concurrency and storage (S3/GCS) to your needs.

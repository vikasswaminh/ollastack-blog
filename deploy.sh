#!/usr/bin/env bash
# Marketing-site deploy to Cloudflare Pages.
#
# Why this exists: CF Pages is no longer connected to the GitHub repo
# (source.type=null on the project) and the auto-build from `git push` does
# nothing. This script uploads the pre-built `dist/` directly via wrangler,
# which doesn't use CF CI minutes and works regardless of integration state.
#
# Required env:
#   CLOUDFLARE_API_TOKEN   — a Pages-Write child token, minted from the
#                             master "Create Additional Tokens" token (see
#                             memory/reference_marketing_deploy.md for the
#                             exact curl recipe).
#
# Usage: bash marketing/deploy.sh
# (run from anywhere — the script cd's to its own directory)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-bc7f0a3ee7f73a27bcbd9f7c82a46876}"
PROJECT="${CF_PAGES_PROJECT:-form4dev}"
BRANCH="${CF_PAGES_BRANCH:-main}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "✗ CLOUDFLARE_API_TOKEN is required." >&2
  echo "  Mint one from the master token. See memory/reference_marketing_deploy.md." >&2
  exit 2
fi

REV=$(git -C .. rev-parse --short HEAD 2>/dev/null || echo "unknown")
DIRTY=$(git -C .. status --porcelain marketing 2>/dev/null | head -1)
if [[ -n "$DIRTY" ]]; then
  echo "⚠ marketing/ has uncommitted changes — they'll be in the deploy."
fi

echo "▶ building marketing site (rev=$REV → project=$PROJECT, branch=$BRANCH)"
pnpm build

echo "▶ uploading dist/ to Cloudflare Pages"
CLOUDFLARE_API_TOKEN="$CLOUDFLARE_API_TOKEN" \
CLOUDFLARE_ACCOUNT_ID="$ACCOUNT_ID" \
  npx wrangler pages deploy dist \
    --project-name="$PROJECT" \
    --branch="$BRANCH" \
    --commit-hash="$REV" \
    --commit-dirty="$([[ -n "$DIRTY" ]] && echo true || echo false)"

echo "✓ deployed rev $REV to https://$PROJECT.pages.dev (canonical: https://form4dev.com)"

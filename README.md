# Ollastack marketing site

Static Astro site for **ollastack.com**. Deployed to Cloudflare Pages.

## Local dev

```sh
cd marketing
npm install
npm run dev
```

## Build

```sh
npm run build
# emits ./dist
```

## Deploy

Cloudflare Pages connects to the `vikasswaminh/form4dev` repo, CF Pages project
name `form4dev` (the public site serves `ollastack.com`). Build config:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `cd marketing && npm install && npm run build` |
| Build output directory | `marketing/dist` |
| Root directory | (empty) |
| Node version | `20` |

DNS:
- `ollastack.com` and `www.ollastack.com` → CF Pages project (CNAME or "Pages > Custom domains")
- `login.ollastack.com` → existing VM origin nginx (already configured)

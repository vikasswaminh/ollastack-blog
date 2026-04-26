# Form4Dev marketing site

Static Astro site for **form4dev.com**. Deployed to Cloudflare Pages.

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

Cloudflare Pages connects to `vikasswaminh/form4dev`. Build config:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `cd marketing && npm install && npm run build` |
| Build output directory | `marketing/dist` |
| Root directory | (empty) |
| Node version | `20` |

DNS:
- `form4dev.com` and `www.form4dev.com` → CF Pages project (CNAME or "Pages > Custom domains")
- `login.form4dev.com` → existing VM origin nginx (already configured)

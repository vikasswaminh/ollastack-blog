import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { posts } from "../data/posts";

const SITE = "https://blogs.ollastack.com";
const TODAY = new Date().toISOString().slice(0, 10);

interface Entry {
  url: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
}

// Auto-enumerate static pages under src/pages (excluding dynamic routes and noindex redirects)
const pageFiles = import.meta.glob("./**/*.astro");

function fileToUrl(key: string): string | null {
  let p = key.replace(/^\.\//, "/").replace(/\.astro$/, "");
  if (p.includes("[")) return null; // handled via collections / tags
  p = p.replace(/\/index$/, "");
  if (p === "" || p === "/") return null; // Root / is a noindex redirect to /blog
  if (p === "/404") return null; // Not indexable
  return p;
}

// Flagship high-value articles get top priority
const flagshipSlugs = new Set([
  "how-to-connect-a-contact-form-to-email-without-backend-code",
  "what-is-an-agent-email-api",
  "how-to-automate-otp-email-testing-in-ci-cd-pipelines",
  "how-to-build-a-form-backend-for-a-static-site-without-writing-a-server",
  "can-ai-agents-submit-forms-safely",
  "form-backend-for-ai-agents",
  "self-host-vs-hosted-form-backend",
  "per-tenant-smtp-guide",
  "form-webhooks-guide",
  "secure-forms-honeypot-captcha",
  "agentmail-alternative",
  "email-for-ai-agents",
]);

function priorityFor(url: string): string {
  if (url === "/blog") return "1.0";
  if (url.startsWith("/blog/")) {
    const slug = url.replace("/blog/", "");
    if (flagshipSlugs.has(slug)) return "0.9";
    return "0.8";
  }
  if (url === "/tags") return "0.6";
  if (url.startsWith("/tags/")) return "0.5";
  return "0.7";
}

function changefreqFor(url: string): "daily" | "weekly" | "monthly" {
  if (url === "/blog") return "daily";
  if (url.startsWith("/blog/")) return "weekly";
  if (url.startsWith("/tags")) return "weekly";
  return "monthly";
}

// Map of post dates for standalone .astro posts from posts[] metadata
const postDate: Record<string, string> = Object.fromEntries(
  posts.map((p) => [`/blog/${p.slug}`, p.date])
);

// 1. Static page entries
const staticEntries: Entry[] = Object.keys(pageFiles)
  .map(fileToUrl)
  .filter((u): u is string => u !== null)
  .map((url) => ({
    url,
    lastmod: postDate[url] ?? TODAY,
    changefreq: changefreqFor(url),
    priority: priorityFor(url),
  }));

// 2. Markdown collection posts
const collectionPosts = await getCollection("blog", ({ data }) => data.draft !== true);
const collectionBlog: Entry[] = collectionPosts.map((p) => {
  const modDate = p.data.updated ?? p.data.date;
  const isoDate = modDate instanceof Date ? modDate.toISOString().slice(0, 10) : TODAY;
  return {
    url: `/blog/${p.slug}`,
    lastmod: isoDate,
    changefreq: "weekly",
    priority: priorityFor(`/blog/${p.slug}`),
  };
});

// 3. Tag pages
const allTags = new Set<string>();
for (const p of collectionPosts) {
  if (p.data.tags && Array.isArray(p.data.tags)) {
    for (const t of p.data.tags) allTags.add(t);
  }
}
const tagEntries: Entry[] = [...allTags].map((t) => ({
  url: `/tags/${encodeURIComponent(t)}`,
  lastmod: TODAY,
  changefreq: "weekly",
  priority: "0.5",
}));

// Deduplicate and sort
const byUrl = new Map<string, Entry>();
for (const e of [...staticEntries, ...collectionBlog, ...tagEntries]) {
  if (!byUrl.has(e.url)) byUrl.set(e.url, e);
}

// Ensure /blog is always present as top priority
if (!byUrl.has("/blog")) {
  byUrl.set("/blog", {
    url: "/blog",
    lastmod: TODAY,
    changefreq: "daily",
    priority: "1.0",
  });
}

const all = [...byUrl.values()].sort((a, b) => {
  if (a.url === "/blog") return -1;
  if (b.url === "/blog") return 1;
  return a.url.localeCompare(b.url);
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${all
  .map(
    (e) => `  <url>
    <loc>${SITE}${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

export const GET: APIRoute = () =>
  new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });

import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { posts } from "../data/posts";

const SITE = "https://ollastack.com";
const TODAY = new Date().toISOString().slice(0, 10);

interface Entry {
  url: string;
  lastmod: string;
  changefreq: "daily" | "weekly" | "monthly";
  priority: string;
}

const staticPages: Entry[] = [
  { url: "/",         lastmod: TODAY, changefreq: "weekly",  priority: "1.0" },
  { url: "/pricing",  lastmod: TODAY, changefreq: "monthly", priority: "0.9" },
  { url: "/docs",     lastmod: TODAY, changefreq: "weekly",  priority: "0.8" },
  { url: "/docs/agents", lastmod: TODAY, changefreq: "monthly", priority: "0.7" },
  { url: "/docs/smtp",   lastmod: TODAY, changefreq: "monthly", priority: "0.7" },
  { url: "/blog",     lastmod: TODAY, changefreq: "weekly",  priority: "0.8" },
  { url: "/contact",  lastmod: TODAY, changefreq: "monthly", priority: "0.6" },
  { url: "/careers",  lastmod: TODAY, changefreq: "weekly",  priority: "0.6" },
];

// Legacy .astro posts (from data/posts) + the markdown content collection.
const legacyBlog: Entry[] = posts.map((p) => ({
  url: `/blog/${p.slug}`,
  lastmod: p.date,
  changefreq: "monthly",
  priority: "0.7",
}));

const collectionBlog: Entry[] = (
  await getCollection("blog", ({ data }) => data.draft !== true)
).map((p) => ({
  url: `/blog/${p.slug}`,
  lastmod: (p.data.updated ?? p.data.date).toISOString().slice(0, 10),
  changefreq: "monthly",
  priority: "0.7",
}));

const all: Entry[] = [...staticPages, ...legacyBlog, ...collectionBlog];

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
</urlset>
`;

export const GET: APIRoute = () =>
  new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });

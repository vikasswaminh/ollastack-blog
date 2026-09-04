import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { posts as legacyPosts } from '../data/posts';
import { SITE } from '../config';

export async function GET(context) {
  const collectionPosts = await getCollection('blog', ({ data }) => data.draft !== true);

  const postMap = new Map();

  collectionPosts.forEach((p) => {
    postMap.set(p.slug, {
      title: p.data.title,
      description: p.data.description,
      pubDate: p.data.date instanceof Date ? p.data.date : new Date(p.data.date),
      link: `/blog/${p.slug}`,
      categories: p.data.tags || [],
    });
  });

  legacyPosts.forEach((p) => {
    if (!postMap.has(p.slug)) {
      postMap.set(p.slug, {
        title: p.title,
        description: p.description,
        pubDate: new Date(p.date + "T00:00:00Z"),
        link: `/blog/${p.slug}`,
        categories: p.category ? [p.category] : [],
      });
    }
  });

  const allFeedItems = Array.from(postMap.values()).sort(
    (a, b) => b.pubDate.valueOf() - a.pubDate.valueOf()
  );

  return rss({
    title: `${SITE.brand} Blog — Engineering & Developer Playbooks`,
    description: "Technical deep-dives, architectural guides, and developer playbooks on AI agent forms, disposable test inboxes, programmatic email APIs, and webhook reliability.",
    site: context.site || "https://blogs.ollastack.com",
    customData: `<language>en-us</language>`,
    items: allFeedItems,
  });
}

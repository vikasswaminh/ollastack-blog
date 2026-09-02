import fs from 'fs';
import path from 'path';

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDirectory(fullPath);
    } else if (/\.(astro|md|ts|js|mjs|json|html)$/.test(entry.name)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;

      // Replace /blog/.../ with /blog/...
      content = content.replace(/\/blog\/([a-zA-Z0-9\-_]+)\//g, '/blog/$1');
      // Replace /tags/.../ with /tags/...
      content = content.replace(/\/tags\/([a-zA-Z0-9\-_]+)\//g, '/tags/$1');
      // Replace https://blogs.ollastack.com/blog/ with https://blogs.ollastack.com/blog
      content = content.replace(/https:\/\/blogs\.ollastack\.com\/blog\//g, 'https://blogs.ollastack.com/blog');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

processDirectory('./src');
console.log('Finished updating all trailing slashes across src directory.');

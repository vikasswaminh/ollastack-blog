// Rasterize public/og.svg -> public/og.png (1200x630 social card).
// Run: node scripts/make-og.mjs
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(here, "../public/og.svg");
const pngPath = resolve(here, "../public/og.png");

const svg = await readFile(svgPath);
await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: "fill" })
  .png()
  .toFile(pngPath);

console.log(`Wrote ${pngPath}`);

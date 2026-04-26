import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://form4dev.com",
  output: "static",
  build: {
    assets: "_assets",
  },
  compressHTML: true,
  trailingSlash: "ignore",
});

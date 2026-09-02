import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://blogs.ollastack.com",
  output: "static",
  build: {
    assets: "_assets",
  },
  compressHTML: true,
  trailingSlash: "never",
});

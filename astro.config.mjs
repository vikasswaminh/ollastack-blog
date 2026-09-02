import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://blogs.ollastack.com",
  output: "static",
  build: {
    assets: "_assets",
    format: "file",
  },
  compressHTML: true,
  trailingSlash: "never",
});

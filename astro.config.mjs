import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ollastack.com",
  output: "static",
  trailingSlash: "never",
  build: {
    assets: "_assets",
    format: "file",
  },
  compressHTML: true,
});

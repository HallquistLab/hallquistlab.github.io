import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hallquistlab.github.io",
  base: "/",
  output: "static",
  integrations: [sitemap()],
});

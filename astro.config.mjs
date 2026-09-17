import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const repository = "hallquist_lab_web";
const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  site: "https://hallquistlab.github.io",
  base: isGitHubPages ? `/${repository}` : "/",
  output: "static",
  integrations: [sitemap()],
});

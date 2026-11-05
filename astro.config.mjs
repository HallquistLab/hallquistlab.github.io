import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://hallquistlab.github.io",
  base: "/",
  output: "static",
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname;
        const historical = new Set([
          "unc-home",
          "participation-forms",
          "depend-parking-maps-directions",
          "participate",
          "studies",
          "about",
          "lab-activities",
          "news",
          "our-team",
          "events",
        ]);
        return (
          !pathname.startsWith("/archive/") &&
          !historical.has(pathname.replace(/^\/|\/$/g, ""))
        );
      },
    }),
  ],
});

// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

const base = process.env.BASE_PATH || "/";
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  // Shared static assets live in the repo-root `static/` folder so
  // Docusaurus and v2 can both reference `templates.json` and images.
  publicDir: "../static",
  // Sitemap is only emitted when `site` is set (production builds set
  // SITE_URL; dev does not, so the integration silently no-ops).
  integrations: [sitemap()],
  vite: {
    // @ts-expect-error - @tailwindcss/vite ships a Plugin<any>[] that
    // is structurally compatible with Astro's PluginOption but trips
    // a nominal type mismatch across Vite versions.
    plugins: [tailwindcss()],
  },
});

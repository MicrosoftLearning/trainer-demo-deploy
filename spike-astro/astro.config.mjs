// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// When deploying to GitHub Pages under a project repo (e.g.
// https://robfoulk.github.io/tdd/), set BASE_PATH=/tdd in the build env
// so all internal links and asset URLs include the prefix. Local dev
// (`npm run dev`) leaves BASE_PATH unset and continues to serve at /.
const base = process.env.BASE_PATH || '/';
const site = process.env.SITE_URL || undefined;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()],
  },
});

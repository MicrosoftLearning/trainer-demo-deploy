/**
 * Resolve a path against the configured Astro `base` so links work
 * under any `BASE_PATH`. Pass paths *without* a leading slash.
 *
 * @example
 *   withBase("gallery")       // "/trainer-demo-deploy/gallery"
 *   withBase("img/logo.png")  // "/trainer-demo-deploy/img/logo.png"
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // always trailing-slashed in Astro 4+
  if (!path) return base;
  return path.startsWith("/") ? `${base}${path.slice(1)}` : `${base}${path}`;
}

#!/usr/bin/env node
// @ts-check
/**
 * Post-build internal-link checker.
 *
 * Walks every HTML file under `dist/`, extracts each `href`/`src`
 * attribute, and verifies that internal links resolve to a built file
 * (or to an `index.html` under a built directory). Also flags any
 * unprefixed absolute path (`/foo` instead of `/<BASE_PATH>/foo`) when
 * `BASE_PATH` is set — those would 404 once deployed to GitHub Pages.
 *
 * Run via `npm run check:links`.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, posix, sep } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = dirname(__dirname);
const DIST_DIR = join(SITE_ROOT, "dist");
const BASE_PATH = (process.env.BASE_PATH || "/").replace(/\/+$/, "") || "/";

const tty = process.stdout.isTTY;
const c = {
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  yellow: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
  bold: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
};

/**
 * Recursively list every HTML file under `dir`.
 * @param {string} dir
 * @returns {Promise<string[]>}
 */
async function walkHtml(dir) {
  /** @type {string[]} */
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...(await walkHtml(full)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      out.push(full);
    }
  }
  return out;
}

const ATTR_RE = /(?:href|src)\s*=\s*"([^"]*)"/gi;
const SCRIPT_OR_STYLE_RE = /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi;

/**
 * Replace `<script>…</script>` and `<style>…</style>` blocks with
 * equally-long whitespace so byte offsets used for line numbers stay
 * accurate but the attribute regex won't fire on template literals
 * inside JS or CSS `url()` values.
 * @param {string} html
 */
function maskScriptsAndStyles(html) {
  return html.replace(SCRIPT_OR_STYLE_RE, (block) => block.replace(/[^\n]/g, " "));
}

/**
 * Classify a link. Returns one of:
 *   - "external"  → http(s)://, //, mailto:, tel:, data:, javascript:
 *   - "anchor"    → starts with "#" or empty
 *   - "internal"  → absolute path on this origin
 *   - "relative"  → not absolute; resolved against the HTML file's dir
 * @param {string} raw
 */
function classify(raw) {
  if (!raw) return { kind: "anchor", value: "" };
  if (raw.startsWith("#")) return { kind: "anchor", value: raw };
  if (/^(?:https?:)?\/\//i.test(raw)) return { kind: "external", value: raw };
  if (/^(?:mailto|tel|data|javascript):/i.test(raw)) {
    return { kind: "external", value: raw };
  }
  if (raw.startsWith("/")) return { kind: "internal", value: raw };
  return { kind: "relative", value: raw };
}

/**
 * Strip query string and fragment for filesystem resolution.
 * @param {string} path
 */
function stripQueryHash(path) {
  const q = path.indexOf("?");
  const h = path.indexOf("#");
  let cut = path.length;
  if (q >= 0) cut = Math.min(cut, q);
  if (h >= 0) cut = Math.min(cut, h);
  return path.slice(0, cut);
}

/**
 * URL-decode each segment so that paths like `/docs/my%20file/` resolve
 * to `dist/docs/my file/`. Returns the original string when decoding
 * fails (e.g. malformed percent-escape).
 * @param {string} pathname
 */
function decodePathname(pathname) {
  try {
    return pathname.split("/").map((seg) => decodeURIComponent(seg)).join("/");
  } catch {
    return pathname;
  }
}

/**
 * Resolve a URL pathname (already query/hash stripped) to a candidate
 * filesystem path under `dist/`. Returns `null` when the link is
 * outside the configured base or escapes `dist/` via path traversal.
 *
 * @param {string} pathname  URL path like "/trainer-demo-deploy/faq/"
 * @returns {string | null}
 */
function resolveInternalToFs(pathname) {
  let p = decodePathname(pathname);
  if (BASE_PATH !== "/") {
    const base = BASE_PATH;
    if (p === base) p = "/";
    else if (p.startsWith(base + "/")) p = p.slice(base.length);
    else return null;
  }
  if (p === "" || p === "/") return join(DIST_DIR, "index.html");
  const local = p.startsWith("/") ? p.slice(1) : p;
  const candidate = join(DIST_DIR, ...local.split("/"));
  // Containment check: refuse to leave dist/ via `..` segments.
  const distWithSep = DIST_DIR.endsWith(sep) ? DIST_DIR : DIST_DIR + sep;
  if (candidate !== DIST_DIR && !candidate.startsWith(distWithSep)) return null;
  return candidate;
}

/**
 * Check whether `fsPath` exists as a file. If it points at a directory
 * (or path missing trailing slash that maps to one), check for an
 * `index.html` inside it.
 * @param {string} fsPath
 */
async function existsAsServable(fsPath) {
  try {
    const s = await stat(fsPath);
    if (s.isFile()) return true;
    if (s.isDirectory()) {
      try {
        const idx = await stat(join(fsPath, "index.html"));
        return idx.isFile();
      } catch {
        return false;
      }
    }
    return false;
  } catch {
    // Fall back: maybe Astro emitted a directory + index.html where the
    // link was written without a trailing slash (e.g. `/faq` → `dist/faq/index.html`).
    try {
      const idx = await stat(`${fsPath}/index.html`);
      return idx.isFile();
    } catch {
      return false;
    }
  }
}

/**
 * Compute the 1-based line number for a byte offset in `text`.
 * @param {string} text
 * @param {number} offset
 */
function lineForOffset(text, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text.charCodeAt(i) === 10) line++;
  }
  return line;
}

/**
 * @param {string} file
 * @returns {Promise<{file: string, errors: string[]}>}
 */
async function checkFile(file) {
  const rel = relative(DIST_DIR, file).replace(/\\/g, "/");
  const html = await readFile(file, "utf8");
  const scanned = maskScriptsAndStyles(html);
  /** @type {string[]} */
  const errors = [];

  for (const match of scanned.matchAll(ATTR_RE)) {
    const raw = match[1];
    const offset = match.index ?? 0;
    const { kind, value } = classify(raw);

    if (kind === "anchor" || kind === "external" || !value) continue;

    if (kind === "relative") {
      // Strip query/hash BEFORE join+normalize so that fragments
      // containing `/` or `..` cannot affect path resolution.
      const cleanRelative = stripQueryHash(value);
      const fileUrlDir = posix.dirname("/" + rel);
      const resolvedPath = posix.normalize(posix.join(fileUrlDir, cleanRelative));
      const withBaseForResolve = BASE_PATH === "/" ? resolvedPath : BASE_PATH + resolvedPath;
      const cleanFs = resolveInternalToFs(withBaseForResolve);
      if (!cleanFs || !(await existsAsServable(cleanFs))) {
        const line = lineForOffset(html, offset);
        errors.push(
          `  - ${c.bold("broken")}: ${raw}\n    at line ${line} (relative; resolved to ${resolvedPath})`,
        );
      }
      continue;
    }

    // kind === "internal" — absolute path starting with "/".
    const stripped = stripQueryHash(value);

    if (BASE_PATH !== "/" && !stripped.startsWith(BASE_PATH + "/") && stripped !== BASE_PATH) {
      const line = lineForOffset(html, offset);
      errors.push(
        `  - ${c.bold("unprefixed")}: ${raw}\n    at line ${line} (missing base path ${c.bold(BASE_PATH)})`,
      );
      continue;
    }

    const fsPath = resolveInternalToFs(stripped);
    if (!fsPath || !(await existsAsServable(fsPath))) {
      const line = lineForOffset(html, offset);
      errors.push(`  - ${c.bold("broken")}: ${raw}\n    at line ${line}`);
    }
  }

  return { file: rel, errors };
}

async function main() {
  try {
    await stat(DIST_DIR);
  } catch {
    console.error(c.red(`✗ dist/ not found. Run \`npm run build\` first.`));
    process.exit(2);
  }

  const files = await walkHtml(DIST_DIR);
  if (files.length === 0) {
    console.log(c.yellow("No .html files found under dist/."));
    process.exit(0);
  }

  console.log(c.dim(`Checking ${files.length} HTML file(s) (BASE_PATH=${BASE_PATH})...`));
  console.log("");

  let failed = 0;
  let totalErrors = 0;
  for (const file of files) {
    const { file: rel, errors } = await checkFile(file);
    if (errors.length > 0) {
      failed += 1;
      totalErrors += errors.length;
      console.log(`${c.red("✗")} ${rel}`);
      for (const e of errors) console.log(e);
      console.log("");
    } else {
      console.log(`${c.green("✓")} ${rel}`);
    }
  }

  const summary = `${files.length} file(s) · ${failed} with broken links · ${totalErrors} total issue(s)`;
  console.log("");
  if (failed > 0) {
    console.log(c.red(`✗ ${summary}`));
    process.exit(1);
  }
  console.log(c.green(`✓ ${summary}`));
}

main().catch((err) => {
  console.error(c.red(`✗ check-links crashed: ${err.stack ?? err.message ?? err}`));
  process.exit(2);
});

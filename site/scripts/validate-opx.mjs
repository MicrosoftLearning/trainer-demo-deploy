#!/usr/bin/env node
// @ts-check
/**
 * Validate every `*.opx.yaml` script under `src/scripts/` against the
 * v1 schema in `../src/lib/opx.ts`.
 *
 * Outputs line-aware errors and exits non-zero on any failure. Run via
 * `npm run validate:opx`. Runtime requires `--experimental-strip-types`
 * (Node 22.6+) so we can import the TypeScript schema directly without
 * a separate build step or duplicated source-of-truth.
 */
import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
import { parseDocument, LineCounter, isMap, isSeq, isScalar } from "yaml";
import { ZodError } from "zod";

import { parseOpx } from "../src/lib/opx.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = dirname(__dirname);
const SCRIPTS_DIR = join(SITE_ROOT, "src", "scripts");

/** ANSI colors — only emit when stdout is a TTY. */
const tty = process.stdout.isTTY;
const c = {
  red: (s) => (tty ? `\x1b[31m${s}\x1b[0m` : s),
  green: (s) => (tty ? `\x1b[32m${s}\x1b[0m` : s),
  yellow: (s) => (tty ? `\x1b[33m${s}\x1b[0m` : s),
  dim: (s) => (tty ? `\x1b[2m${s}\x1b[0m` : s),
  bold: (s) => (tty ? `\x1b[1m${s}\x1b[0m` : s),
};

/**
 * Walk a parsed YAML document by a path of keys/indices and return the
 * 1-based `line` and `column` of the matched node. Returns `null` when
 * the path cannot be resolved (e.g. cross-field errors that don't map
 * to a single source location).
 */
function locateNode(doc, lineCounter, path) {
  if (!path || path.length === 0) return null;
  let node = doc.contents;
  for (const seg of path) {
    if (node == null) return null;
    if (isMap(node)) {
      const pair = node.items.find((p) => isScalar(p.key) && p.key.value === seg);
      if (!pair) return null;
      node = pair.value;
    } else if (isSeq(node)) {
      const idx = typeof seg === "number" ? seg : Number(seg);
      if (!Number.isInteger(idx) || idx < 0 || idx >= node.items.length) return null;
      node = node.items[idx];
    } else {
      return null;
    }
  }
  if (!node || !node.range) return null;
  const [start] = node.range;
  return lineCounter.linePos(start);
}

/**
 * Render a Zod issue path with bracket-style array indices,
 * e.g. `steps[3].files[0].op` (matches `validation.md` §"Error format").
 */
function prettyPath(path) {
  if (path.length === 0) return "<root>";
  let out = "";
  for (const seg of path) {
    if (typeof seg === "number") out += `[${seg}]`;
    else if (out === "") out = String(seg);
    else out += `.${seg}`;
  }
  return out;
}

/**
 * Format a single Zod issue with its source location, when available.
 */
function formatIssue(doc, lineCounter, issue) {
  const path = issue.path.map((p) => (typeof p === "number" ? p : String(p)));
  const pretty = prettyPath(path);
  const loc = locateNode(doc, lineCounter, path);
  const where = loc ? c.dim(`at line ${loc.line}, column ${loc.col}`) : c.dim("(no source location)");
  return `  - ${c.bold(pretty)}: ${issue.message}\n    ${where}`;
}

async function listOpxFiles() {
  const entries = await readdir(SCRIPTS_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /\.opx\.ya?ml$/i.test(e.name))
    .map((e) => join(SCRIPTS_DIR, e.name))
    .sort((a, b) => a.localeCompare(b));
}

/**
 * Validate one file. Returns `{ ok, errors, warnings, script }`.
 * `script` is the parsed `OpxScript` on success, used by `main()` to
 * enforce cross-file rules (e.g. `meta.id` uniqueness).
 */
async function validateOne(file) {
  const raw = await readFile(file, "utf8");
  const lineCounter = new LineCounter();
  const doc = parseDocument(raw, { keepSourceTokens: true, lineCounter });

  if (doc.errors.length > 0) {
    return {
      ok: false,
      errors: doc.errors.map((e) => {
        const pos = e.linePos?.[0];
        const where = pos ? c.dim(`at line ${pos.line}, column ${pos.col}`) : c.dim("(no source location)");
        return `  - ${c.bold("yaml parse")}: ${e.message}\n    ${where}`;
      }),
      warnings: [],
      script: null,
    };
  }

  const idFromFile = file.replace(/.*[/\\]/, "").replace(/\.opx\.ya?ml$/i, "");
  const obj = doc.toJS();

  try {
    // Validate the schema without the filename-stem check so we can
    // report that rule as a line-aware error against `meta.id`.
    const script = parseOpx(obj);

    if (script.meta.id !== idFromFile) {
      const synthetic = {
        path: ["meta", "id"],
        message: `meta.id "${script.meta.id}" does not match filename stem "${idFromFile}".`,
      };
      // Keep `script` populated so cross-file uniqueness still applies
      // even when stem check fails — duplicate ids should surface
      // regardless of whether one of the offending files also has a
      // stem mismatch.
      return {
        ok: false,
        errors: [formatIssue(doc, lineCounter, synthetic)],
        warnings: [],
        script,
      };
    }

    return { ok: true, errors: [], warnings: collectWarnings(script), script };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        ok: false,
        errors: err.issues.map((issue) => formatIssue(doc, lineCounter, issue)),
        warnings: [],
        script: null,
      };
    }
    return {
      ok: false,
      errors: [`  - ${c.bold("error")}: ${err.message}`],
      warnings: [],
      script: null,
    };
  }
}

/**
 * Soft checks that warn but don't fail CI. See `validation.md`
 * §"Cross-field rules (warnings, not errors)".
 */
function collectWarnings(script) {
  const warnings = [];

  // Wall-clock check at speed 1.0.
  const wall = script.steps.reduce((acc, step) => {
    return acc + step.timing.appearAfter + step.timing.typing + step.timing.holdFor;
  }, script.meta.startDelay);
  if (wall < 15000 || wall > 35000) {
    warnings.push(
      `wall-clock ≈ ${(wall / 1000).toFixed(1)}s — outside recommended [15s, 35s] band`,
    );
  }

  if (script.meta.loopPause < 2000) {
    warnings.push(`loopPause = ${script.meta.loopPause}ms — below recommended minimum 2000ms`);
  }

  if (script.meta.mode === "marquee") {
    warnings.push(`mode = "marquee" in src/scripts/ — use "player" for carousel scripts`);
  }

  const hasCode = script.steps.some((s) => s.agent?.code);
  if (!hasCode) {
    warnings.push(`no agent step has a code block — consider adding one for visual variety`);
  }

  return warnings;
}

async function main() {
  const files = await listOpxFiles();
  if (files.length === 0) {
    console.log(c.yellow(`No *.opx.yaml files found in ${relative(SITE_ROOT, SCRIPTS_DIR)}/`));
    process.exit(0);
  }

  let failed = 0;
  let warned = 0;
  /** @type {Map<string, string[]>} */
  const idToFiles = new Map();

  for (const file of files) {
    const rel = relative(SITE_ROOT, file).replace(/\\/g, "/");
    const { ok, errors, warnings, script } = await validateOne(file);

    if (script) {
      const bucket = idToFiles.get(script.meta.id) ?? [];
      bucket.push(rel);
      idToFiles.set(script.meta.id, bucket);
    }

    if (!ok) {
      failed += 1;
      console.log(`${c.red("✗")} ${rel}\n`);
      for (const e of errors) console.log(e);
      console.log("");
    } else if (warnings.length > 0) {
      warned += 1;
      console.log(`${c.yellow("!")} ${rel}`);
      for (const w of warnings) console.log(`  ${c.yellow("warn")} ${w}`);
      console.log("");
    } else {
      console.log(`${c.green("✓")} ${rel}`);
    }
  }

  // Cross-file rule: meta.id must be unique across src/scripts/.
  let duplicateIds = 0;
  for (const [id, group] of idToFiles) {
    if (group.length > 1) {
      duplicateIds += 1;
      console.log("");
      console.log(`${c.red("✗")} duplicate meta.id ${c.bold(`"${id}"`)} in:`);
      for (const f of group) console.log(`  - ${f}`);
    }
  }
  if (duplicateIds > 0) failed += duplicateIds;

  const summary = `${files.length} file${files.length === 1 ? "" : "s"} · ${failed} failed · ${warned} with warnings`;
  console.log("");
  if (failed > 0) {
    console.log(c.red(`✗ ${summary}`));
    process.exit(1);
  }
  console.log(c.green(`✓ ${summary}`));
}

main().catch((err) => {
  console.error(c.red(`✗ validator crashed: ${err.stack ?? err.message ?? err}`));
  process.exit(2);
});

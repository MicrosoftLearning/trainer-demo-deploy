/**
 * Build-time OPX script loader.
 *
 * Uses Vite's `import.meta.glob` to read every `*.opx.yaml` in the
 * `src/scripts/` folder. Each file is parsed with `yaml`, validated
 * against the v1 Zod schema in `./opx.ts`, and frozen. There is no
 * runtime fetch — failures here surface as build errors.
 *
 * Filename stem is canonical: it must equal `meta.id` (the schema
 * enforces a non-empty `id`, the caller enforces match).
 */
import { parse as parseYaml } from "yaml";
import { parseOpx, type OpxScript } from "./opx";

const RAW_SCRIPTS = import.meta.glob("/src/scripts/*.opx.yaml", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function stemFromPath(p: string): string {
  const file = p.split("/").pop() ?? p;
  return file.replace(/\.opx\.ya?ml$/i, "");
}

function loadOne(path: string, raw: string): OpxScript {
  const idFromFile = stemFromPath(path);
  let yamlObj: unknown;
  try {
    yamlObj = parseYaml(raw);
  } catch (err) {
    throw new Error(`OPX YAML parse error in ${path}: ${(err as Error).message}`);
  }
  try {
    return parseOpx(yamlObj, idFromFile);
  } catch (err) {
    throw new Error(
      `OPX validation failed for ${path}: ${(err as Error).message}`,
    );
  }
}

let _cache: OpxScript[] | null = null;

export function loadAllScripts(): OpxScript[] {
  if (_cache) return _cache;
  const entries = Object.entries(RAW_SCRIPTS).sort(([a], [b]) => a.localeCompare(b));
  _cache = entries.map(([path, raw]) => loadOne(path, raw));
  return _cache;
}

export function loadScript(id: string): OpxScript | undefined {
  return loadAllScripts().find((s) => s.meta.id === id);
}

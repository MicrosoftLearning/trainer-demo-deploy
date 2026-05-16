// Orchestrator Preview Script (.opx) — schema + loader.
// One YAML file = one playable transcript.
import { z } from "zod";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";

// ---- Step schemas ---------------------------------------------------------
const Avatar = z.object({
  initials: z.string().min(1).max(3),
  gradient: z.tuple([z.string(), z.string()]).optional(),
});

const UserStep = z.object({
  user: z.object({
    handle: z.string(),
    avatar: Avatar,
    body: z.string(),                              // markdown
    when: z.string().default("now"),
  }),
});

const CodeBlock = z.object({
  lang: z.string().default("text"),
  source: z.string(),
});

const AgentStep = z.object({
  agent: z.object({
    body: z.string(),                              // markdown
    code: CodeBlock.optional(),
  }),
});

const ToolStep = z.object({
  tool: z.object({
    kind: z.enum(["search", "run", "read", "edit"]).default("search"),
    title: z.string(),
    detail: z.string().optional(),
    result: z.string().optional(),                  // markdown allowed
  }),
});

const FileOp = z.enum(["add", "edit", "delete", "rename"]);
const FilesStep = z.object({
  files: z.array(z.object({
    path: z.string(),
    op: FileOp.default("add"),
    lines: z.number().int().nonnegative().default(0),
  })).min(1),
});

const SummaryStep = z.object({
  summary: z.object({
    title: z.string(),
    lead: z.string().optional(),
    bullets: z.array(z.string()).default([]),
  }),
});

const StatusStep = z.object({
  status: z.object({
    kind: z.enum(["done", "running", "error"]).default("done"),
    text: z.string(),
  }),
});

export const Step = z.union([UserStep, AgentStep, ToolStep, FilesStep, SummaryStep, StatusStep]);
export type Step = z.infer<typeof Step>;

// ---- Meta -----------------------------------------------------------------
const Task = z.object({
  label: z.string(),
  progress: z.tuple([z.number().int().nonnegative(), z.number().int().positive()]),
});
const Diff = z.object({
  files: z.number().int().nonnegative(),
  added: z.number().int().nonnegative(),
  removed: z.number().int().nonnegative(),
});
const Meta = z.object({
  id: z.string(),
  title: z.string(),
  agent: z.string().default("orchestrator"),
  model: z.string().default("Claude Opus 4.7"),
  context: z.string().default(""),
  notes: z.number().int().nonnegative().default(0),
  task: Task,
  diff: Diff,
  speed: z.number().positive().default(1),
  mode: z.enum(["marquee", "player"]).default("marquee"),
});

export const OpxScript = z.object({
  meta: Meta,
  steps: z.array(Step).min(1),
}).refine((s) => s.meta.task.progress[0] <= s.meta.task.progress[1], {
  message: "task.progress: done must be <= total",
});
export type OpxScript = z.infer<typeof OpxScript>;

// ---- Loader (build-time only; reads from src/scripts/) --------------------
export function loadScript(id: string): OpxScript {
  const root = path.resolve(process.cwd(), "src", "scripts");
  const candidates = [
    path.join(root, `${id}.opx.yaml`),
    path.join(root, `${id}.opx.yml`),
    path.join(root, `${id}.yaml`),
  ];
  const file = candidates.find((p) => fs.existsSync(p));
  if (!file) throw new Error(`OPX script not found for id "${id}". Tried:\n${candidates.join("\n")}`);
  const raw = fs.readFileSync(file, "utf8");
  const data = yaml.load(raw);
  const parsed = OpxScript.safeParse(data);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `- ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`OPX script "${id}" failed validation:\n${msg}`);
  }
  return parsed.data;
}

// ---- Step kind helpers ----------------------------------------------------
export type StepKind = "user" | "agent" | "tool" | "files" | "summary" | "status";
export function stepKind(s: Step): StepKind {
  if ("user" in s) return "user";
  if ("agent" in s) return "agent";
  if ("tool" in s) return "tool";
  if ("files" in s) return "files";
  if ("summary" in s) return "summary";
  return "status";
}

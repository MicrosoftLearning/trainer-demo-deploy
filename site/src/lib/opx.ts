/**
 * OPX v1 schema (Zod) + script loader.
 *
 * The runtime imports the parsed/validated OPX object via `loadScript`
 * or `loadAllScripts`. Both return `OpxScript`. Validation errors are
 * thrown synchronously with line-aware messages where possible.
 */
import { z } from "zod";

export const OPX_SCHEMA_VERSION = "1.0.0" as const;

// ---------------------------------------------------------------------------
// Primitive schemas
// ---------------------------------------------------------------------------

const HexColor = z
  .string()
  .regex(/^#[0-9a-fA-F]{3,8}$/, "Expected a hex color like #8661C5");

const InlineMarkdown = z.string();

const AvatarSchema = z
  .object({
    initials: z.string().min(1).max(3),
    gradient: z.tuple([HexColor, HexColor]).optional(),
  })
  .strict();

const TimingSchema = z
  .object({
    appearAfter: z.number().int().nonnegative().default(0),
    holdFor: z.number().int().nonnegative().default(1400),
    typing: z.number().int().nonnegative().default(0),
  })
  .strict()
  .default({ appearAfter: 0, holdFor: 1400, typing: 0 });

const AdvancesSchema = z
  .object({
    task: z.number().int().nonnegative().default(0),
    files: z.number().int().nonnegative().default(0),
    added: z.number().int().nonnegative().default(0),
    removed: z.number().int().nonnegative().default(0),
  })
  .strict()
  .default({ task: 0, files: 0, added: 0, removed: 0 });

// ---------------------------------------------------------------------------
// Step body schemas (no top-level kind keys here — see StepSchema)
// ---------------------------------------------------------------------------

const UserBody = z
  .object({
    handle: z.string().min(1),
    avatar: AvatarSchema,
    body: InlineMarkdown,
    when: z.string().default("now"),
  })
  .strict();

const AgentCode = z
  .object({
    lang: z.string().min(1),
    source: z.string(),
  })
  .strict();

const AgentBody = z
  .object({
    body: InlineMarkdown,
    code: AgentCode.optional(),
  })
  .strict();

const ToolBody = z
  .object({
    kind: z.enum(["search", "run", "read", "edit"]).default("search"),
    title: z.string().min(1),
    detail: InlineMarkdown.optional(),
    result: InlineMarkdown.optional(),
  })
  .strict();

const FileRow = z
  .object({
    path: z.string().min(1),
    op: z.enum(["add", "edit", "delete", "rename"]).default("add"),
    lines: z.number().int().nonnegative().default(0),
  })
  .strict();

const SummaryBody = z
  .object({
    title: z.string().min(1),
    lead: InlineMarkdown.optional(),
    bullets: z.array(InlineMarkdown).default([]),
  })
  .strict();

const StatusBody = z
  .object({
    kind: z.enum(["done", "running", "error"]).default("done"),
    text: InlineMarkdown,
  })
  .strict();

// ---------------------------------------------------------------------------
// Step union (exactly-one-of: user|agent|tool|files|summary|status)
// ---------------------------------------------------------------------------

const STEP_KIND_KEYS = ["user", "agent", "tool", "files", "summary", "status"] as const;

const RawStepSchema = z
  .object({
    user: UserBody.optional(),
    agent: AgentBody.optional(),
    tool: ToolBody.optional(),
    files: z.array(FileRow).min(1).optional(),
    summary: SummaryBody.optional(),
    status: StatusBody.optional(),
    timing: TimingSchema,
    advances: AdvancesSchema,
  })
  .strict()
  .superRefine((step, ctx) => {
    const present = STEP_KIND_KEYS.filter((k) => step[k] !== undefined);
    if (present.length !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          present.length === 0
            ? `Step is missing a kind. Add exactly one of: ${STEP_KIND_KEYS.join(", ")}.`
            : `Step has multiple kinds (${present.join(", ")}). Each step must have exactly one.`,
      });
    }
  });

export type StepKind = (typeof STEP_KIND_KEYS)[number];

// ---------------------------------------------------------------------------
// Meta + top-level
// ---------------------------------------------------------------------------

const TaskSchema = z
  .object({
    label: z.string().min(1),
    progress: z.tuple([z.number().int().nonnegative(), z.number().int().min(1)]),
  })
  .strict()
  .superRefine((task, ctx) => {
    if (task.progress[0] > task.progress[1]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["progress"],
        message: `task.progress[0] (${task.progress[0]}) must be ≤ task.progress[1] (${task.progress[1]}).`,
      });
    }
  });

const DiffSchema = z
  .object({
    files: z.number().int().nonnegative(),
    added: z.number().int().nonnegative(),
    removed: z.number().int().nonnegative(),
  })
  .strict();

const MetaSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    agent: z.string().default("orchestrator"),
    model: z.string().default("Claude Opus 4.7"),
    context: z.string().default(""),
    task: TaskSchema,
    diff: DiffSchema,
    speed: z.number().positive().default(1),
    mode: z.enum(["marquee", "player"]).default("marquee"),
    loop: z.boolean().default(true),
    startDelay: z.number().int().nonnegative().default(400),
    loopPause: z.number().int().nonnegative().default(2200),
  })
  .strict();

const ScriptSchema = z
  .object({
    meta: MetaSchema,
    steps: z.array(RawStepSchema).min(1),
  })
  .strict()
  .superRefine((script, ctx) => {
    const totals = { task: 0, files: 0, added: 0, removed: 0 };
    for (const step of script.steps) {
      totals.task += step.advances.task;
      totals.files += step.advances.files;
      totals.added += step.advances.added;
      totals.removed += step.advances.removed;
    }
    const meta = script.meta;
    if (totals.task !== meta.task.progress[0]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["steps"],
        message: `sum(advances.task) is ${totals.task} but meta.task.progress[0] is ${meta.task.progress[0]}.`,
      });
    }
    if (totals.files !== meta.diff.files) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["steps"],
        message: `sum(advances.files) is ${totals.files} but meta.diff.files is ${meta.diff.files}.`,
      });
    }
    if (totals.added !== meta.diff.added) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["steps"],
        message: `sum(advances.added) is ${totals.added} but meta.diff.added is ${meta.diff.added}.`,
      });
    }
    if (totals.removed !== meta.diff.removed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["steps"],
        message: `sum(advances.removed) is ${totals.removed} but meta.diff.removed is ${meta.diff.removed}.`,
      });
    }
  });

export type OpxScript = z.infer<typeof ScriptSchema>;
export type OpxStep = OpxScript["steps"][number];
export type OpxMeta = OpxScript["meta"];

/**
 * Parse + validate a raw OPX object. Throws ZodError on failure.
 * The `idFromFilename` argument enforces the rule that `meta.id`
 * must equal the filename stem.
 */
export function parseOpx(raw: unknown, idFromFilename?: string): OpxScript {
  const script = ScriptSchema.parse(raw);
  if (idFromFilename && script.meta.id !== idFromFilename) {
    throw new Error(
      `meta.id "${script.meta.id}" does not match filename stem "${idFromFilename}".`,
    );
  }
  return script;
}

export const __INTERNALS__ = { ScriptSchema, STEP_KIND_KEYS };

import { describe, expect, it } from "vitest";
import { ZodError } from "zod";
import { OPX_SCHEMA_VERSION, parseOpx } from "./opx";

const validScript = () => ({
  meta: {
    id: "demo-test",
    title: "Demo",
    task: { label: "Do the thing", progress: [1, 1] },
    diff: { files: 1, added: 5, removed: 0 },
    mode: "player",
  },
  steps: [
    {
      user: { handle: "u", avatar: { initials: "u" }, body: "go" },
      advances: { task: 1, files: 1, added: 5, removed: 0 },
    },
  ],
});

describe("OPX_SCHEMA_VERSION", () => {
  it("is the pinned v1 version string", () => {
    expect(OPX_SCHEMA_VERSION).toBe("1.0.0");
  });
});

describe("parseOpx — happy path", () => {
  it("accepts a minimal valid script", () => {
    const out = parseOpx(validScript());
    expect(out.meta.id).toBe("demo-test");
    expect(out.steps).toHaveLength(1);
  });

  it("applies defaults for optional meta fields", () => {
    const out = parseOpx(validScript());
    expect(out.meta.agent).toBe("orchestrator");
    expect(out.meta.loop).toBe(true);
    expect(out.meta.startDelay).toBe(400);
  });

  it("applies defaults for step timing and advances", () => {
    // Totals must still match, so use a zero-advance fixture to exercise defaults.
    const out = parseOpx({
      meta: {
        id: "x",
        title: "X",
        task: { label: "t", progress: [0, 1] },
        diff: { files: 0, added: 0, removed: 0 },
      },
      steps: [{ user: { handle: "u", avatar: { initials: "u" }, body: "hi" } }],
    });
    expect(out.steps[0].timing.holdFor).toBe(1400);
    expect(out.steps[0].advances).toEqual({ task: 0, files: 0, added: 0, removed: 0 });
  });
});

describe("parseOpx — cross-field rules", () => {
  it("rejects when progress[0] > progress[1]", () => {
    const obj = validScript();
    obj.meta.task.progress = [2, 1];
    obj.steps[0].advances.task = 2;
    try {
      parseOpx(obj);
      throw new Error("expected ZodError");
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const messages = (err as ZodError).issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("task.progress[0]"))).toBe(true);
    }
  });

  it("rejects when sum(advances.task) ≠ meta.task.progress[0]", () => {
    const obj = validScript();
    obj.steps[0].advances.task = 99;
    obj.steps[0].advances.files = 1;
    obj.steps[0].advances.added = 5;
    try {
      parseOpx(obj);
      throw new Error("expected ZodError");
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const messages = (err as ZodError).issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("sum(advances.task)"))).toBe(true);
    }
  });

  it("rejects mismatched file/added/removed totals", () => {
    const obj = validScript();
    obj.steps[0].advances.files = 0;
    try {
      parseOpx(obj);
      throw new Error("expected ZodError");
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const messages = (err as ZodError).issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("sum(advances.files)"))).toBe(true);
    }
  });
});

describe("parseOpx — step kind union", () => {
  it("rejects a step with zero kinds", () => {
    const obj = validScript();
    // @ts-expect-error testing runtime rejection of empty step
    obj.steps[0] = { advances: { task: 1, files: 1, added: 5, removed: 0 } };
    try {
      parseOpx(obj);
      throw new Error("expected ZodError");
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const messages = (err as ZodError).issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("missing a kind"))).toBe(true);
    }
  });

  it("rejects a step with two kinds", () => {
    const obj = validScript();
    // Add an `agent` kind alongside the existing `user`.
    (obj.steps[0] as Record<string, unknown>).agent = { body: "agent reply" };
    try {
      parseOpx(obj);
      throw new Error("expected ZodError");
    } catch (err) {
      expect(err).toBeInstanceOf(ZodError);
      const messages = (err as ZodError).issues.map((i) => i.message);
      expect(messages.some((m) => m.includes("multiple kinds"))).toBe(true);
    }
  });
});

describe("parseOpx — idFromFilename rule", () => {
  it("accepts when meta.id matches the filename stem", () => {
    expect(() => parseOpx(validScript(), "demo-test")).not.toThrow();
  });

  it("throws when meta.id does not match the filename stem", () => {
    expect(() => parseOpx(validScript(), "other-stem")).toThrow(
      /does not match filename stem/,
    );
  });
});

describe("parseOpx — schema strictness", () => {
  it("rejects unknown keys at the top level", () => {
    const obj = { ...validScript(), extraneous: 1 };
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("rejects unknown keys in meta", () => {
    const obj = validScript();
    (obj.meta as Record<string, unknown>).extra = "nope";
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("requires steps to be non-empty", () => {
    const obj = validScript();
    obj.steps = [];
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });
});

describe("parseOpx — step kind acceptance", () => {
  // Each non-`user` body must parse cleanly when used as the single step kind.
  const baseMeta = {
    id: "kind-test",
    title: "K",
    task: { label: "t", progress: [0, 1] },
    diff: { files: 0, added: 0, removed: 0 },
  };

  it("accepts an `agent` step", () => {
    expect(() =>
      parseOpx({ meta: baseMeta, steps: [{ agent: { body: "ok" } }] }),
    ).not.toThrow();
  });

  it("accepts a `tool` step with default kind", () => {
    const out = parseOpx({
      meta: baseMeta,
      steps: [{ tool: { title: "search" } }],
    });
    expect(out.steps[0].tool?.kind).toBe("search");
  });

  it("accepts a `files` step", () => {
    // `files` advance must equal meta.diff.files for totals to balance.
    const out = parseOpx({
      meta: { ...baseMeta, diff: { files: 1, added: 2, removed: 0 } },
      steps: [
        {
          files: [{ path: "src/a.ts", op: "add", lines: 2 }],
          advances: { files: 1, added: 2 },
        },
      ],
    });
    expect(out.steps[0].files?.[0].path).toBe("src/a.ts");
  });

  it("accepts a `summary` step with bullets", () => {
    expect(() =>
      parseOpx({
        meta: baseMeta,
        steps: [{ summary: { title: "Done", bullets: ["one", "two"] } }],
      }),
    ).not.toThrow();
  });

  it("accepts a `status` step with default kind", () => {
    const out = parseOpx({
      meta: baseMeta,
      steps: [{ status: { text: "ok" } }],
    });
    expect(out.steps[0].status?.kind).toBe("done");
  });
});

describe("parseOpx — field-level rejections", () => {
  it("rejects an invalid mode", () => {
    const obj = validScript();
    (obj.meta as Record<string, unknown>).mode = "carousel";
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("rejects a non-positive speed", () => {
    const obj = validScript();
    (obj.meta as Record<string, unknown>).speed = 0;
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("rejects a malformed hex gradient color", () => {
    const obj = validScript();
    // `gradient` is optional on AvatarSchema; the fixture omits it, so
    // poke it onto the inferred shape via an index assignment.
    (obj.steps[0].user!.avatar as Record<string, unknown>).gradient = [
      "not-a-color",
      "#8661C5",
    ];
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("rejects avatar.initials longer than 3 characters", () => {
    const obj = validScript();
    obj.steps[0].user!.avatar.initials = "abcd";
    expect(() => parseOpx(obj)).toThrow(ZodError);
  });

  it("rejects an invalid file row `op`", () => {
    expect(() =>
      parseOpx({
        meta: {
          id: "f",
          title: "F",
          task: { label: "t", progress: [0, 1] },
          diff: { files: 1, added: 0, removed: 0 },
        },
        steps: [
          {
            files: [{ path: "x", op: "rewrite", lines: 0 }],
            advances: { files: 1 },
          },
        ],
      }),
    ).toThrow(ZodError);
  });
});

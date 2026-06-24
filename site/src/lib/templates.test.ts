import { describe, expect, it } from "vitest";
import type { TagType } from "../data/tags-shim";
import {
  allTemplates,
  azdInitCommand,
  filterTemplates,
  getAuthorsWithCounts,
  getTagsBySection,
  getUniqueAuthors,
  tagSection,
  templateSlug,
  type Template,
} from "./templates";

const sample = (over: Partial<Template> = {}): Template => ({
  title: "Sample Template",
  description: "Demo description with the word azd inside it.",
  preview: "preview.png",
  website: "https://example.com",
  author: "Test Author",
  source: "https://github.com/petender/tdd-azd-starter",
  demoguide: null,
  tags: ["functions"],
  cost: "$",
  deploytime: "5 min",
  ...over,
});

describe("templateSlug", () => {
  it("lowercases, dashes whitespace, and strips punctuation", () => {
    expect(templateSlug({ title: "AZ-104 — Demo Lab!" })).toBe("az-104-demo-lab");
  });

  it("collapses repeated separators and trims edges", () => {
    expect(templateSlug({ title: "  Foo   Bar  " })).toBe("foo-bar");
  });
});

describe("azdInitCommand", () => {
  it("extracts owner and repo from a github.com URL", () => {
    expect(azdInitCommand({ source: "https://github.com/petender/tdd-azd-starter" })).toBe(
      "azd init -t petender/tdd-azd-starter",
    );
  });

  it("ignores trailing path segments, query, and hash", () => {
    expect(
      azdInitCommand({
        source: "https://github.com/Foo/Bar-baz/tree/main?x=1#readme",
      }),
    ).toBe("azd init -t Foo/Bar-baz");
  });

  it("returns null for non-github sources", () => {
    expect(azdInitCommand({ source: "https://gitlab.com/x/y" })).toBeNull();
  });

  it("returns null when source is empty or null", () => {
    expect(azdInitCommand({ source: null })).toBeNull();
    expect(azdInitCommand({ source: "" })).toBeNull();
  });
});

describe("filterTemplates", () => {
  const data: Template[] = [
    sample({ title: "Azure Function Hub", description: "serverless", tags: ["openai"], author: "Alice" }),
    sample({ title: "Static Web App", description: "frontend hosting", tags: ["functions"], author: "Bob, Carol" }),
    sample({ title: "Kubernetes Cluster", description: "container orchestration", tags: ["aks"], author: "Dan" }),
  ];

  it("returns all when filter is empty", () => {
    expect(filterTemplates(data, {})).toHaveLength(3);
  });

  it("filters by case-insensitive search across title and description", () => {
    expect(filterTemplates(data, { search: "FRONTEND" }).map((t) => t.title)).toEqual([
      "Static Web App",
    ]);
    expect(filterTemplates(data, { search: "azure" }).map((t) => t.title)).toEqual([
      "Azure Function Hub",
    ]);
  });

  it("treats search whitespace as significant after trim", () => {
    expect(filterTemplates(data, { search: "  hub  " }).map((t) => t.title)).toEqual([
      "Azure Function Hub",
    ]);
  });

  it("filters by tags using OR-within-list semantics", () => {
    const out = filterTemplates(data, { tags: ["functions", "aks"] }).map((t) => t.title);
    expect(out).toEqual(["Static Web App", "Kubernetes Cluster"]);
  });

  it("filters by authors matching any name in a multi-author string", () => {
    expect(filterTemplates(data, { authors: ["Carol"] }).map((t) => t.title)).toEqual([
      "Static Web App",
    ]);
  });

  it("combines filters with AND semantics", () => {
    const out = filterTemplates(data, { search: "container", tags: ["aks"] });
    expect(out).toHaveLength(1);
    expect(out[0].title).toBe("Kubernetes Cluster");

    expect(filterTemplates(data, { search: "container", tags: ["functions"] })).toHaveLength(0);
  });
});

describe("tagSection", () => {
  it("maps Service tag types to 'Azure Services'", () => {
    // `appinsights` is a Service entry in the tag catalog.
    expect(tagSection("appinsights")).toBe("Azure Services");
  });

  it("returns null for special tags without a section type", () => {
    // 'hot', 'new', 'mct', 'msft' are decorative — should not appear in the filter rail.
    expect(tagSection("hot")).toBeNull();
    expect(tagSection("new")).toBeNull();
  });

  it("returns null for unknown tags", () => {
    // Cast: the test exercises the runtime branch where the input is
    // outside the union; the compile-time check is the whole point.
    expect(tagSection("definitely-not-a-tag-xyz" as TagType)).toBeNull();
  });
});

describe("getUniqueAuthors", () => {
  it("splits multi-author strings on commas and de-duplicates", () => {
    const data = [
      sample({ author: "Alice, Bob" }),
      sample({ author: "Bob , Carol" }),
      sample({ author: "Alice" }),
    ];
    expect(getUniqueAuthors(data)).toEqual(["Alice", "Bob", "Carol"]);
  });

  it("ignores empty author strings", () => {
    const data = [sample({ author: "" }), sample({ author: "Z" })];
    expect(getUniqueAuthors(data)).toEqual(["Z"]);
  });
});

describe("getAuthorsWithCounts", () => {
  it("counts authors across multi-author entries", () => {
    const data = [
      sample({ author: "Alice, Bob" }),
      sample({ author: "Alice" }),
      sample({ author: "Carol" }),
    ];
    const counts = getAuthorsWithCounts(data);
    expect(counts).toEqual([
      { name: "Alice", count: 2 },
      { name: "Bob", count: 1 },
      { name: "Carol", count: 1 },
    ]);
  });
});

describe("getTagsBySection", () => {
  it("groups tags into the three filter rail sections", () => {
    const grouped = getTagsBySection();
    expect(Object.keys(grouped)).toEqual(["Azure Services", "ILT Courses", "Frameworks"]);
    for (const section of Object.values(grouped)) {
      // Within a section, entries are sorted by label.
      const labels = section.map((s) => s.label);
      const sorted = [...labels].sort((a, b) => a.localeCompare(b));
      expect(labels).toEqual(sorted);
    }
  });

  it("never lists a tag in more than one section", () => {
    const grouped = getTagsBySection();
    const seen = new Set<string>();
    for (const section of Object.values(grouped)) {
      for (const entry of section) {
        expect(seen.has(entry.tag)).toBe(false);
        seen.add(entry.tag);
      }
    }
  });
});

describe("real catalog data integrity (smoke test)", () => {
  it("loads at least one template from static/templates.json", () => {
    expect(allTemplates.length).toBeGreaterThan(0);
  });

  it("is sorted alphabetically by title (case-insensitive)", () => {
    const titles = allTemplates.map((t) => t.title.toLowerCase());
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });
});

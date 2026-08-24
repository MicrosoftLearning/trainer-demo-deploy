import { describe, expect, it } from "vitest";
import { CatalogCourseTags } from "../data/tags-shim";
import type { TagType } from "../data/tags-shim";
import {
  allTemplates,
  azdInitCommand,
  filterTemplates,
  GENERAL_INDUSTRY,
  getAuthorsWithCounts,
  getUniqueIndustries,
  getTagsBySection,
  getUniqueAuthors,
  normalizeIndustry,
  tagMeta,
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
  industry: GENERAL_INDUSTRY,
  cost: "$",
  deploytime: "5 min",
  ...over,
});

describe("normalizeIndustry", () => {
  it("treats missing and blank industry values as General", () => {
    expect(normalizeIndustry()).toBe(GENERAL_INDUSTRY);
    expect(normalizeIndustry(null)).toBe(GENERAL_INDUSTRY);
    expect(normalizeIndustry("   ")).toBe(GENERAL_INDUSTRY);
  });

  it("trims an explicitly assigned industry", () => {
    expect(normalizeIndustry("  Healthcare ")).toBe("Healthcare");
  });
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
    sample({ title: "Static Web App", description: "frontend hosting", tags: ["functions"], author: "Bob, Carol", industry: "Retail" }),
    sample({ title: "Kubernetes Cluster", description: "container orchestration", tags: ["aks"], author: "Dan", industry: "Healthcare" }),
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

  it("filters by industries using OR-within-list semantics", () => {
    const out = filterTemplates(data, { industries: ["Retail", "Healthcare"] }).map(
      (t) => t.title,
    );
    expect(out).toEqual(["Static Web App", "Kubernetes Cluster"]);
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

describe("getUniqueIndustries", () => {
  it("returns unique industries with General first and the rest alphabetized", () => {
    const data = [
      sample({ industry: "Retail" }),
      sample({ industry: GENERAL_INDUSTRY }),
      sample({ industry: "Healthcare" }),
      sample({ industry: "Retail" }),
    ];

    expect(getUniqueIndustries(data)).toEqual([GENERAL_INDUSTRY, "Healthcare", "Retail"]);
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

describe("CatalogCourseTags", () => {
  it("contains the current course portfolio", () => {
    expect(CatalogCourseTags).toEqual([
      "ab-100",
      "ab-6008",
      "ab-620",
      "ab-730",
      "ab-731",
      "ai-103",
      "ai-200",
      "ai-300",
      "ai-3003",
      "ai-3008",
      "ai-3016",
      "ai-3025",
      "ai-3026",
      "ai-901",
      "az-104",
      "az-2007",
      "az-2008",
      "az-305",
      "az-400",
      "az-500",
      "az-700",
      "dp-300",
      "dp-3011",
      "dp-3014",
      "dp-3028",
      "dp-3029",
      "dp-600",
      "dp-601",
      "dp-602",
      "dp-603",
      "dp-604",
      "dp-605",
      "dp-700",
      "dp-750",
      "dp-800",
      "dp-900",
      "gh-100",
      "gh-200",
      "gh-300",
      "gh-500",
      "gh-600",
      "gh-900",
      "md-4011",
      "ms-4002",
      "ms-4004",
      "ms-4014",
      "ms-4017",
      "ms-4018",
      "ms-4019",
      "ms-4021",
      "ms-4022",
      "ms-4023",
      "pl-300",
      "pl-7008",
      "sc-100",
      "sc-200",
      "sc-300",
      "sc-401",
    ]);
  });

  it("registers every portfolio course as an ILT course", () => {
    for (const tag of CatalogCourseTags) {
      expect(tagMeta(tag), `missing course metadata for '${tag}'`).toBeDefined();
      expect(tagSection(tag), `${tag} is not an ILT course`).toBe("ILT Courses");
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

  it("registers every catalog tag and leaves only badges unsectioned", () => {
    const badgeTags = new Set<TagType>(["hot", "new", "mct", "msft"]);

    for (const template of allTemplates) {
      for (const tag of template.tags) {
        expect(tagMeta(tag), `${template.title}: unknown tag '${tag}'`).toBeDefined();
        if (!badgeTags.has(tag)) {
          expect(tagSection(tag), `${template.title}: unsectioned tag '${tag}'`).not.toBeNull();
        }
      }
    }
  });
});

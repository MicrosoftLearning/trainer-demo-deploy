/**
 * Catalog data: load `static/templates.json` (the single source of
 * truth) plus sort/filter helpers used by `/gallery`.
 */
import templatesJson from "../../../static/templates.json";
import { Tags } from "../data/tags-shim";
import type { Tag, TagType } from "../data/tags-shim";

export type Template = {
  title: string;
  description: string;
  preview: string;
  website: string;
  author: string;
  source: string | null;
  demoguide: string | null;
  courseblueprint?: string | null;
  tags: TagType[];
  cost: string;
  deploytime: string;
  prereqs?: string;
};

/** Stable slug for deep-link `?id=<slug>` URLs. */
export function templateSlug(t: Pick<Template, "title">): string {
  return t.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const all = (templatesJson as Template[]).map((t) => ({ ...t }));
all.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

/** All templates, sorted alphabetically by title (case-insensitive). */
export const allTemplates: Template[] = all;

/** Unique author names (handles "First Last, Second Author" multi-author entries). */
export function getUniqueAuthors(templates: Template[] = allTemplates): string[] {
  const set = new Set<string>();
  for (const t of templates) {
    if (!t.author) continue;
    for (const a of t.author.split(",")) {
      const name = a.trim();
      if (name) set.add(name);
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

/** Unique tags actually used by the catalog (for the filter rail). */
export function getUsedTags(templates: Template[] = allTemplates): TagType[] {
  const set = new Set<TagType>();
  for (const t of templates) {
    for (const tag of t.tags) set.add(tag);
  }
  return Array.from(set).sort();
}

export type CatalogFilter = {
  /** Case-insensitive substring match on title + description. */
  search?: string;
  /** Tags — AND-across-categories is handled by the caller; this is OR-within. */
  tags?: TagType[];
  /** Authors — OR within the list. */
  authors?: string[];
};

/** Apply filters. Empty/undefined fields are pass-through. */
export function filterTemplates(
  templates: Template[],
  filter: CatalogFilter,
): Template[] {
  const search = filter.search?.trim().toLowerCase();
  const tags = filter.tags && filter.tags.length > 0 ? new Set(filter.tags) : null;
  const authors = filter.authors && filter.authors.length > 0 ? new Set(filter.authors) : null;

  return templates.filter((t) => {
    if (search) {
      const haystack = `${t.title} ${t.description}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    if (tags) {
      // OR within: any matching tag is enough.
      if (!t.tags.some((x) => tags.has(x))) return false;
    }
    if (authors) {
      const ta = t.author.split(",").map((a) => a.trim());
      if (!ta.some((x) => authors.has(x))) return false;
    }
    return true;
  });
}

/** Filter rail section keys, in display order. */
export const FILTER_SECTIONS = ["Azure Services", "ILT Courses", "Frameworks"] as const;
export type FilterSection = (typeof FILTER_SECTIONS)[number];

/** Map a tag's `type` field to a filter rail section. Returns null for special tags (hot/new/mct/msft). */
export function tagSection(tag: TagType): FilterSection | null {
  const meta = Tags[tag];
  if (!meta?.type) return null;
  switch (meta.type) {
    case "ILT Courses":
      return "ILT Courses";
    case "Framework":
      return "Frameworks";
    case "Service":
    case "Database":
    case "Platform":
      return "Azure Services";
    default:
      return null;
  }
}

/** Tags grouped by filter rail section, sorted by label within each. */
export function getTagsBySection(
  templates: Template[] = allTemplates,
): Record<FilterSection, Array<{ tag: TagType; label: string; count: number }>> {
  const counts = new Map<TagType, number>();
  for (const t of templates) {
    for (const tag of t.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  const out: Record<FilterSection, Array<{ tag: TagType; label: string; count: number }>> = {
    "Azure Services": [],
    "ILT Courses": [],
    Frameworks: [],
  };
  for (const [tag, count] of counts) {
    const section = tagSection(tag);
    if (!section) continue;
    out[section].push({ tag, label: Tags[tag]?.label ?? tag, count });
  }
  for (const section of FILTER_SECTIONS) {
    out[section].sort((a, b) => a.label.localeCompare(b.label));
  }
  return out;
}

/** Author counts across the catalog. */
export function getAuthorsWithCounts(
  templates: Template[] = allTemplates,
): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const t of templates) {
    if (!t.author) continue;
    for (const a of t.author.split(",")) {
      const name = a.trim();
      if (!name) continue;
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }
  return Array.from(counts, ([name, count]) => ({ name, count })).sort((a, b) =>
    a.name.localeCompare(b.name),
  );
}

/** Tag display metadata accessor used by Card chips. */
export function tagMeta(tag: TagType): Tag | undefined {
  return Tags[tag];
}

/** Build the `azd init -t <owner>/<repo>` command for a template's `source` repo. */
export function azdInitCommand(t: Pick<Template, "source">): string | null {
  if (!t.source) return null;
  // Match github.com/<owner>/<repo> capturing exactly the next two path segments.
  const m = t.source.match(/github\.com\/([^/]+)\/([^/?#]+)/i);
  if (!m) return null;
  return `azd init -t ${m[1]}/${m[2]}`;
}

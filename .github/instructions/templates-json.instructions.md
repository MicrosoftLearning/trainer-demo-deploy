---
applyTo: 'static/templates.json'
description: 'Authoritative instructions for updating static/templates.json entries using repo-mined metadata and strict validation'
---

# Templates Catalog Implementation Instructions

These instructions govern adding and maintaining entries in `static/templates.json`. They define a deterministic process and validation rules.

## Scope
- File: `static/templates.json` (single JSON array of template objects)
- Tags: must be from `src/data/tags.tsx` TagType union
- Sources: A single GitHub repository per entry is the authoritative source for metadata

## Contract: Template Entry Schema

Fields and types:
- title (string, required, unique)
- description (string, required) - Omit reference to bicep or AZD, it is the demo that we care about
- preview (string, required) — relative path under `./templates/images/` or an absolute HTTPS URL
- website (string, required) — author profile or project page
- author (string, required)
- source (string, required) — GitHub repo URL
- demoguide (string, optional) — raw markdown URL
- tags (string[], required) — each value must be in TagType
- cost (string, required) — decimal as string (e.g., "3.00")
- deploytime (string, required) — minutes as string (e.g., "5")
- prereqs (string, optional) — raw markdown URL

Conventions:
- Keep keys in the order listed above
- All fields are JSON strings except `tags` (array of strings)
- Deduplicate and sort `tags` lexicographically for stable diffs
- No trailing commas; entire file must be a single valid JSON array

## Allowed Tags
Authoritative allowed values are defined in `src/data/tags.tsx` (TagType). Do not invent new tags here—add to TagType first if necessary. Should contain a tag from the ILT course catalog.

## Automation Workflow: From GitHub Repo to Entry

When a user provides a GitHub repository URL, populate fields as follows:

1. Discover metadata
   - source: the provided repo URL
   - website: repo owner profile URL (e.g., https://github.com/<owner>) or the repo homepage if defined
   - author: repo owner display name if available; otherwise owner handle
   - title: prefer a concise productized name from README H1; else repo name in human case
   - description: first paragraph under README H1 (sanitize to one sentence, max ~240 chars)
   - demoguide: README raw URL if it serves as the demo guide, or search for demoguide/*.md, docs/*guide*.md; use raw URL
   - prereqs: search for prereqs.md or similar; use raw URL if present
   - preview: look for images referenced in README (png/svg/jpg/webp). Prefer a repo `static/templates/images/` asset if already in our repo, else the first readable image in the repo via raw URL. If none, set `./templates/images/test.png`.

2. Infer tags (best-effort, then human-confirm)
   - Map keywords in README and repo topics to TagType values (e.g., aks → "aks", functions → "functions", apim → "apim", dotnet → "dotnet")
   - Include certification tags if README or repo references AZ-*, AI-*, DP-*, SC-* codes
   - Always validate against TagType; discard unknowns

3. Ask user to confirm or adjust metadata
   - Present all fields for review
   - Allow user to edit title, description, tags, and URLs
   - Ensure all required fields are filled

4. Normalize & validate
   - Deduplicate and sort tags
   - Ensure required fields present and non-empty
   - Validate URLs (https://)
   - Keep cost/deploytime as strings

5. Insert into `static/templates.json`
   - Append as a new object near the end of the array
   - Preserve formatting: no spaces for indentation; keep key order
   - Do not reorder existing entries

6. Status Report
   - Report to the user in the chat the changes that were made. Assumptions, defaults and guesses that were made

## JSON Schema (machine-validated)

```json
{
   "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://example.com/schemas/templates.schema.json",
  "type": "array",
  "items": {
    "type": "object",
    "required": [
      "title",
      "description",
      "preview",
      "website",
      "author",
      "source",
      "tags",
      "cost",
      "deploytime"
    ],
    "additionalProperties": false,
    "properties": {
      "title": {"type": "string", "minLength": 3},
      "description": {"type": "string", "minLength": 10},
   "preview": {"type": "string", "pattern": "^(\\./templates/images/|https://)"},
      "website": {"type": "string", "format": "uri", "pattern": "^https://"},
      "author": {"type": "string", "minLength": 2},
      "source": {"type": "string", "format": "uri", "pattern": "^https://github.com/"},
      "demoguide": {"type": "string", "format": "uri", "pattern": "^https://"},
      "tags": {
        "type": "array",
        "minItems": 1,
        "items": {"type": "string"},
        "uniqueItems": true
      },
      "cost": {"type": "string", "pattern": "^\\d+(\\.\\d{1,2})?$"},
      "deploytime": {"type": "string", "pattern": "^\\d+$"},
      "prereqs": {"type": "string", "format": "uri", "pattern": "^https://"}
    }
  }
}
```


## Validation Checklist (pre-commit)
- [ ] JSON parses; array only, no stray objects or trailing commas
- [ ] Required fields present and non-empty
- [ ] Tags are valid TagType, unique, sorted, Include at least 1 ILT course from tags
- [ ] cost and deploytime are strings and match patterns
- [ ] preview is repo image or local asset path
- [ ] demoguide/prereqs raw URLs when present
  
- Note: Do not execute repo scripts or tests during this step; checks are manual/visual only.

## Problem Resolution
If metadata is missing from the repo, create a sensible placeholder and flag it in the PR description. Do not block insertion if the schema can be satisfied with defaults. Prefer updating the source repo later to improve fidelity.

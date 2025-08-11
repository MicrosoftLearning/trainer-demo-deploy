---
mode: 'agent'
description: 'Research a GitHub repository and generate a complete entry for static/templates.json with validated fields and allowed tags.'
tools: ['fetch', 'githubRepo', 'search', 'openSimpleBrowser', 'codebase', 'editFiles', 'runTasks', 'problems']
---
# Create Template Entry

Your goal is to research the provided GitHub repository and append a complete, valid object to `static/templates.json`.

## Inputs
- ${input:RepoUrl} — A GitHub repository URL (e.g., https://github.com/OWNER/REPO)

## Output
- Updated `static/templates.json` content as a single JSON array including the newly appended object, preserving all existing entries and formatting no spaces, flush left. Output only JSON.

## Constraints
- The file is a single JSON array of objects; do not output any extra text.
- Keys must appear in this exact order:
  1. title
  2. description
  3. preview
  4. website
  5. author
  6. source
  7. demoguide (optional)
  8. tags (array)
  9. cost (string)
  10. deploytime (string)
  11. prereqs (optional)
- Tags must match TagType values defined in `src/data/tags.tsx`.
- Keep cost and deploytime as strings.
- Ensure all URLs use https://.
- Deduplicate and sort tags lexicographically.
- Do not reorder existing entries.

## Research Tasks
Use tools to gather the following from the repo:
1. README
   - Title: H1 heading; if absent, humanize repo name
   - Description: first non-empty paragraph under H1, single sentence, ≤ 240 chars rewritten to ignore references to Bicep or AZD. The demo is the focus.
   - Images: first usable image (png/jpg/svg/webp); use raw URL for `preview`
2. Repo metadata
   - Owner page URL for `website`
   - Owner handle or display name for `author`
   - Topics and description text to help infer `tags`
3. Demo and prerequisites
   - `demoguide`: README raw URL or demoguide/*.md under main/master
   - `prereqs`: prereqs.md under main/master when available
4. Tag inference
   - Map keywords (aks, functions, apim, app service, container apps, acr, aci, cosmos, storage, blob, event hub/grid, key vault, monitor, app insights, openai, azure ai, ml, front door, cdn, redis, vnet, vpn, sentinel, purview, traffic manager, firewall, bastion, app gateway, private endpoint/link, load balancer, dotnet, node, python, blazor) to TagType
   - Should have 1 at least ILT course tag. Courses May be referenced in README or demo guide.
   - Filter strictly to allowed TagType
   - always have the "new" tag

## Defaults (if missing)
- preview: ./templates/images/test.png
- cost: "3.00"
- deploytime: "5"
- tags: if none can be inferred, use ["new"]

## Validation
- Ensure every new field is present and non-empty (except optional ones) and URLs are https.
- Do not run any repository validation or test scripts (e.g., npm/yarn/pnpm tasks or schema validators). Produce the updated JSON only.
- package.json is irrelevant to this task. 

## Steps
1. Read `static/templates.json` and `src/data/tags.tsx`.
2. Fetch README (main/master) and extract title, description, preview image.
3. Query GitHub API for topics and owner details (use provided auth if available).
4. Locate demoguide and prereqs files (prefer raw URLs).
5. Infer valid tags, dedupe, and sort.
6. Construct the new object with the exact key order and defaults where required.
7. Append to the existing array, preserving formatting (2 spaces) and order of existing entries.
8. Output only the updated JSON array. The user is only interested in the changes. Displaying the entire file is not necessary.
9. Explain to the user any defaults, guesses, or assumptions made.

## Acceptance Criteria
- The output is valid JSON and structurally consistent with the schema (no need to run validators or tests).
- The new entry has unique title and required fields populated.
- All tags are from TagType and sorted.
- No reordering of existing entries and no trailing commas.

## Example (structure only)
```json
{
  "title": "...",
  "description": "...",
  "preview": "./templates/images/...png",
  "website": "https://github.com/OWNER",
  "author": "OWNER",
  "source": "https://github.com/OWNER/REPO",
  "demoguide": "https://raw.githubusercontent.com/OWNER/REPO/main/README.md",
  "tags": ["az-204", "dotnet", "functions"],
  "cost": "3.00",
  "deploytime": "5",
  "prereqs": "https://raw.githubusercontent.com/OWNER/REPO/main/prereqs.md"
}
```

```prompt
---
description: "Generate an audience-aware demo guide for a deployed Azure project"
agent: "az-07-DemoGuide"
model: "GPT-5.3-Codex"
tools:
  - read/readFile
  - edit/createFile
  - edit/editFiles
  - execute/runInTerminal
  - search/codebase
  - search/listDirectory
  - "microsoft/playwright-mcp/*"
  - "azure-mcp/*"
  - agent
argument-hint: Provide the project name to generate a demo guide for
---

# Generate Demo Guide

Create a comprehensive, audience-aware demonstration guide for a deployed
Azure infrastructure project. Includes pre-demo validation, step-by-step
demo guide, talking points, and contingency playbook.

## Mission

Read all project artifacts, ask about audience format, validate environment
readiness, and generate a professional demo guide that a presenter can
follow to deliver a successful live demonstration.

## Scope & Preconditions

- `generated-scenarios/${input:projectName}/02-architecture-assessment.md` must exist
- `generated-scenarios/${input:projectName}/05-implementation-reference.md` should exist (or `04-implementation-plan.md` at minimum)
- `generated-scenarios/${input:projectName}/06-deployment-summary.md` should exist (deployed resources and outputs feed the demo guide)
- Read `.github/skills/az-consolidated/SKILL.md` for naming conventions, template H2 structure, and demo patterns/personas
- Output saved to `generated-scenarios/${input:projectName}/demoguide/demoguide.md`
- Include Playwright MCP generated screenshots of the different demo steps; store these in `generated-scenarios/${input:projectName}/demoguide/images/` and reference them in the demoguide.md. To make this possible, prompt the user for an authenticated Playwright browser session. Use that session to loop through the demo steps.

## Inputs

| Variable               | Description                                      | Default   |
| ---------------------- | ------------------------------------------------ | --------- |
| `${input:projectName}` | Project name matching the `generated-scenarios/` folder | Required  |

## Workflow

### Step 1: Read Source Artifacts

Read all available project artifacts in order:

1. `01-requirements.md` — business context, stakeholders
2. `02-architecture-assessment.md` — resources, WAF scores
3. `04-implementation-plan.md` — resource inventory, dependencies
4. `05-implementation-reference.md` — deployment details, file structure
5. `06-deployment-summary.md` — deployed resources, outputs, endpoints
6. `generated-scenarios/{projectName}/infra/` or `generated-scenarios/{projectName}/infra/terraform/` — actual templates

### Step 2: Generate Pre-Demo Checklist

Create validation commands for every resource in the architecture.
Include Azure CLI commands that the presenter can copy-paste to verify
the environment before going live.

### Step 3: Generate Demo Script

For each major feature or resource:

1. Title with time estimate
2. What to show (Portal / CLI / code)
3. What to say (talking point for the audience)
4. Expected result
5. Failure recovery reference

### Step 4: Create relevant demo screenshots

Use Playwright MCP tools to capture screenshots of the deployed resources in the Azure Portal. Store these in `generated-scenarios/${input:projectName}/demoguide/images/` and reference them in the demo guide next to the relevant steps.

### Step 5: Validate screenshot files

If Playwright capture was used, validate required screenshots exist in
`generated-scenarios/${input:projectName}/demoguide/images/` before finalizing.

Minimum required files:

- `resource-group-overview.png`
- `firewall-overview.png`
- `network-topology.png` (if applicable)
- One screenshot per major demo step

If Playwright is unavailable or declined, require:

- `<img>` placeholders with `TODO: capture screenshot` alt text
- A brief note describing why screenshots were not captured live

### Step 6: Save Artifact

Save to `generated-scenarios/{projectName}//demoguide/demoguide.md` following the
exact H2 structure defined in the azure-artifacts skill.

## Quality Checklist

- [ ] All source artifacts read before generation
- [ ] Audience format confirmed with user
- [ ] H2 headings match template structure exactly
- [ ] Every demo step has a time estimate
- [ ] Every CLI command uses actual resource names
- [ ] Pre-demo checklist covers all critical resources
- [ ] Playwright-generated screenshots included and properly referenced
- [ ] Required screenshot files exist on disk, or fallback placeholders + reason are present
```

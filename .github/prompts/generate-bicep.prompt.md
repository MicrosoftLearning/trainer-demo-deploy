---
description: "Plan governance-aware infrastructure and generate production-ready Bicep templates, following the Azure Developer CLI (AZD framework) with a focus on Azure Verified Modules (AVM) and policy compliance."
agent: "az-05-Bicep"
model: "GPT-5.3-Codex"
tools:
  - read/readFile
  - edit/createFile
  - edit/editFiles
  - execute/runInTerminal
  - search/codebase
  - agent
  - "bicep/*"
argument-hint: Provide the project name to plan and generate Bicep templates for
---

# Generate Bicep Templates

Discover governance constraints, plan the implementation, generate
production-ready Bicep templates with AVM modules, and validate.

## Mission

Run governance discovery, verify AVM availability, auto-select deployment
strategy, generate the implementation plan, then progressively build
Bicep modules with security baselines and automated validation.

## Scope & Preconditions

- `generated-scenarios/${input:projectName}/02-architecture-assessment.md` must exist
- Read `.github/skills/az-consolidated/SKILL.md` for naming, tags, AVM, security, templates, and Bicep patterns
- Templates saved to `generated-scenarios/${input:projectName}/infra/` and compatible with `azd provision`

## Inputs

| Variable               | Description                                  | Default  |
| ---------------------- | -------------------------------------------- | -------- |
| `${input:projectName}` | Project name matching the `generated-scenarios/` folder | Required |

## Workflow

### Step 1: Governance Discovery

1. Verify Azure connectivity (`az account show`)
2. Query ALL effective policy assignments via REST API
3. Classify policy effects — `Deny` policies are hard blockers
4. Save to `generated-scenarios/{projectName}/04-governance-constraints.md` and `.json`

### Step 2: AVM Verification & Deployment Strategy

1. Query AVM metadata for each resource in the architecture
2. Auto-select deployment strategy (phased for >5 resources, single otherwise)
3. Document module paths and versions

### Step 3: Progressive Implementation

Generate templates following dependency order:

1. **main.bicep** — orchestrator with `uniqueSuffix`, conditional phases
2. **main.bicepparam** — parameter file for default environment
3. **modules/** — one module per resource, AVM-first
4. Apply: baseline tags, security baseline, CAF naming, governance compliance

### Step 4: Validation

1. Run `bicep build main.bicep` — fix any errors
2. Run `bicep lint main.bicep` — fix any warnings
3. Save `generated-scenarios/{projectName}/05-implementation-reference.md`

## Output Expectations

```text
generated-scenarios/{projectName}/infra/
├── main.bicep
├── main.bicepparam
├── modules/
    ├── {resource1}.bicep
    ├── {resource2}.bicep
    └── ...

```

---
description: "Run the full Azure infrastructure workflow end-to-end"
agent: "az-01-conductor"
model: "Claude Opus 4.6"
tools:
  - agent
  - edit/createFile
  - edit/editFiles
  - read/readFile
  - search/listDirectory
  - execute/runInTerminal
argument-hint: Describe the Azure infrastructure project you want to build
---

# Run Conductor — End-to-End Workflow

Orchestrate the complete Azure infrastructure development workflow
for a new project, delegating to specialized agents with automatic handoffs
between each step.

## Mission

Guide a project from business description through validated Bicep
templates using the full agent pipeline: Requirements → Architect →
Design → Bicep → Development (conditional) → Deploy → Demo Guide.
All steps are required to have a successful project and do the handover to the user. After the final handoff, prompt the user to confirm the project run is complete.

## Scope & Preconditions

- User describes their project in business terms or technical terms
- All artifacts are saved to `generated-scenarios/${input:projectName}/`
- Bicep templates are saved to `generated-scenarios/${input:projectName}/infra/` and should support `azd provision`
- Each step produces artifacts that feed the next step
- Proceed through workflow steps automatically unless the user explicitly pauses

## Inputs

| Variable                      | Description                                       | Default  |
| ----------------------------- | ------------------------------------------------- | -------- |
| `${input:projectName}`        | Project name (kebab-case)                         | Required |
| `${input:projectDescription}` | Business or technical description of the workload | Required |

## Workflow

### Step 1: Requirements

Delegate to **Requirements** agent with the project description.
Wait for `01-requirements.md` to be generated.

Automatically continue to Step 2 after requirements generation.

### Step 2: Architecture Assessment

Delegate to **Architect** agent to review requirements and produce
WAF assessment with cost estimates.

Automatically continue to the next step after architecture generation.

### Step 3: Design Artifacts

Delegate to **Design** agent to generate architecture diagrams.
Automatically continue to Step 4 after design generation.

### Step 4: Bicep Templates

Delegate to **Bicep** agent for governance discovery, implementation
planning, template generation, and validation.

After templates are generated, verify `bicep build` and `bicep lint` pass.

Automatically continue to Step 4b (Development) if user requested a sample webapp, otherwise skip to Step 5 (Deploy).

### Step 4b: Development (Conditional)

If the user requested a sample web application during Step 1:

1. Delegate to **Development** agent with the project name and chosen industry
2. The agent scaffolds a .NET 10 C# Razor Pages webapp with local seed data
3. Wires the app into `azure.yaml` as a service
4. Generates `07-webapp-summary.md`

Skip this step if:

- The user declined a sample webapp
- The architecture is VM-only (no App Service, Container Apps, ACI, or AKS)

Automatically continue to Step 5 (Deploy).

### Step 5: Deploy

Delegate to **Deploy** agent. Run what-if analysis, prompt the user for
Azure credentials and confirmation, then execute the deployment. Generate
`06-deployment-summary.md` with deployed resource details.

Automatically continue to Step 6 (Demo Guide).

### Step 6: Demo Guide

Generate **demo step-by-step instructions guide**.

With this final step completed successfully, **after** running the validation, **prompt** the user in chat to **confirm** the project run is complete.

## Output Expectations

```text
generated-scenarios/{projectName}/
├── 01-requirements.md
├── 02-architecture-assessment.md
├── 03-architect-diagram.py
├── 04-implementation-plan.md
├── 04-dependency-diagram.py
├── 04-dependency-diagram.png
├── 04-runtime-diagram.py
├── 04-runtime-diagram.png
├── 04-preflight-check.md
├── 05-implementation-reference.md
├── 06-deployment-summary.md
├── 07-webapp-summary.md          (conditional — if sample webapp requested)
├── /demoguide/demoguide.md
├── /demoguide/images/*.png
└── README.md

generated-scenarios/{projectName}/infra/
├── main.bicep
├── main.bicepparam
└── modules/

generated-scenarios/{projectName}/src/         (conditional — if sample webapp requested)
└── {ProjectName}.Web/
```

## Quality Assurance

Before completing each step, verify:

- [ ] Artifact file exists and follows the H2 template from azure-artifacts skill
- [ ] No stale references to previous steps
- [ ] Workflow progressed through automatic handoffs
- [ ] All validation commands pass before proceeding
- [ ] Prompted the user to confirm the project run is complete at the end

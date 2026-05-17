---
description: "Scaffold a .NET 10 C# sample web application with industry-specific local data for the demo workload scenario."
agent: "az-05b-Development"
model: "Claude Opus 4.6"
tools:
  - read/readFile
  - edit/createFile
  - edit/editFiles
  - execute/runInTerminal
  - search/codebase
  - search/listDirectory
  - agent
argument-hint: Provide the project name and business industry for the sample webapp
---

# Generate Sample Web Application

Scaffold a .NET 10 C# Razor Pages web application with industry-specific
seed data, wire it into the azd framework, and validate the build.

## Mission

Generate a complete, buildable sample web application that demonstrates
the Azure demo workload with realistic local data. The application must
integrate with the existing infrastructure via the `azure.yaml` service
configuration.

## Scope & Preconditions

- `generated-scenarios/${input:projectName}/02-architecture-assessment.md` must exist
- `generated-scenarios/${input:projectName}/infra/` must contain validated Bicep templates
- Read `.github/skills/az-consolidated/SKILL.md` for naming conventions and defaults
- Read `.github/skills/az-webapp-development/SKILL.md` for .NET 10 patterns
- Read `.github/instructions/az-dotnet-webapp.instructions.md` for coding standards
- Output saved to `generated-scenarios/${input:projectName}/src/{ProjectName}.Web/`

## Inputs

| Variable               | Description                                  | Default  |
| ---------------------- | -------------------------------------------- | -------- |
| `${input:projectName}` | Project name matching the `generated-scenarios/` folder | Required |
| `${input:industry}`    | Business industry for seed data              | Required |

## Workflow

### Step 1: Context Extraction

1. Read `02-architecture-assessment.md` to identify compute targets
2. Determine if webapp is eligible (App Service, Container Apps, ACI, AKS)
3. If compute is VM-only, skip webapp generation entirely

### Step 2: Scaffold .NET 10 Project

1. Run `dotnet new webapp --framework net10.0 --name {ProjectName}.Web`
2. Set up project structure per skill patterns

### Step 3: Generate Models and Seed Data

1. Create entity models based on industry selection
2. Generate 10-20 realistic seed records per entity as JSON
3. Create `SampleDataService` for in-memory data loading

### Step 4: Build Razor Pages

1. Home dashboard with entity counts and navigation
2. List and Detail pages per entity type

### Step 5: Container Support (if needed)

1. Generate multi-stage Dockerfile for container targets
2. Create `.dockerignore`

### Step 6: Wire azure.yaml

1. Add `services:` block to existing `azure.yaml`
2. Set `host:` based on compute target

### Step 7: Validate Build

1. Run `dotnet build` — must succeed
2. Verify seed data files are included in output
3. Generate `07-webapp-summary.md`

## Output Expectations

```text
generated-scenarios/{projectName}/
├── 07-webapp-summary.md
├── src/{ProjectName}.Web/
│   ├── {ProjectName}.Web.csproj
│   ├── Program.cs
│   ├── Dockerfile           (container targets)
│   ├── Models/
│   ├── Services/
│   ├── SeedData/
│   ├── Pages/
│   └── wwwroot/
└── azure.yaml               (updated with services block)
```

---
name: az-05b-Development
description: Scaffolds and generates a .NET 10 C# sample web application tailored to the project's business industry. Uses Azure data services (Storage Table, SQL, Cosmos DB, etc.) when present in the architecture, falling back to local JSON seed data only when no data endpoint exists. Supports App Service, Container Apps, ACI, and AKS deployment targets. Skips VM-only scenarios.
model: "Claude Opus 4.6"
user-invokable: true
argument-hint: Provide the project folder name and business industry for the sample web app (e.g., healthcare, retail, finance)
agents: []
tools:
  [
    vscode/extensions,
    vscode/getProjectSetupInfo,
    vscode/installExtension,
    vscode/newWorkspace,
    vscode/openSimpleBrowser,
    vscode/runCommand,
    vscode/vscodeAPI,
    execute/getTerminalOutput,
    execute/awaitTerminal,
    execute/killTerminal,
    execute/createAndRunTask,
    execute/runTests,
    execute/runInTerminal,
    execute/runNotebookCell,
    execute/testFailure,
    read/terminalSelection,
    read/terminalLastCommand,
    read/getNotebookSummary,
    read/problems,
    read/readFile,
    read/readNotebookCellOutput,
    agent/runSubagent,
    agent,
    edit/createDirectory,
    edit/createFile,
    edit/createJupyterNotebook,
    edit/editFiles,
    edit/editNotebook,
    search,
    search/changes,
    search/codebase,
    search/fileSearch,
    search/listDirectory,
    search/searchResults,
    search/textSearch,
    search/usages,
    web,
    web/fetch,
    web/githubRepo,
    "azure-mcp/*",
    todo,
    vscode.mermaid-chat-features/renderMermaidDiagram,
    ms-azuretools.vscode-azure-github-copilot/azure_recommend_custom_modes,
    ms-azuretools.vscode-azure-github-copilot/azure_query_azure_resource_graph,
    ms-azuretools.vscode-azure-github-copilot/azure_get_auth_context,
    ms-azuretools.vscode-azure-github-copilot/azure_set_auth_context,
    ms-azuretools.vscode-azure-github-copilot/azure_get_dotnet_template_tags,
    ms-azuretools.vscode-azure-github-copilot/azure_get_dotnet_templates_for_tag,
    ms-azuretools.vscode-azureresourcegroups/azureActivityLog,
  ]
---

# Development Agent

**Step 3b** of the workflow: `requirements → architect → bicep → [development] → deploy → demoguide`

Scaffolds a .NET 10 C# sample web application with industry-specific data.
When the architecture includes a data service (Storage Table, SQL Database,
Cosmos DB, etc.), the app stores and retrieves data from that service. When no
data endpoint is present, the app falls back to local JSON seed files. Runs on
Azure App Service, Container Apps, ACI, or AKS — never on VM-only scenarios.

## MANDATORY: Read Skills First

**Before doing ANY work**, read these skills:

1. **Read** `.github/skills/az-consolidated/SKILL.md` — consolidated skill (defaults, AVM, Bicep patterns, artifacts, diagrams, demo guide)
2. **Read** `.github/skills/az-webapp-development/SKILL.md` — webapp scaffolding patterns, industry data templates, Dockerfile, azd service wiring
3. **Read** `.github/instructions/az-dotnet-webapp.instructions.md` — .NET 10 coding standards, project structure, sample data patterns

## Eligibility Check

> [!CAUTION]
> **HARD GATE — Skip if VM-only scenario**
>
> Before starting, read `02-architecture-assessment.md` and `01-requirements.md`.
> If the architecture **only** contains VM-based compute (no App Service, Container
> Apps, ACI, or AKS), this agent MUST skip and report back:
>
> ```text
> ⏭️ DEVELOPMENT SKIPPED — VM-only scenario does not require a sample web app.
> ```

### Eligible Compute Targets

| Compute Type   | Webapp Delivery         | Dockerfile Required |
| -------------- | ----------------------- | ------------------- |
| App Service    | Deploy as web app       | No                  |
| Container Apps | Deploy as container     | Yes                 |
| ACI            | Deploy as container     | Yes                 |
| AKS            | Deploy as container     | Yes                 |
| VM (any)       | **SKIP — not eligible** | N/A                 |

## Core Principles

1. **Always .NET 10**: Use `dotnet new webapp` with `--framework net10.0`
2. **Data Backend First**: If the architecture includes a data service (Storage Table, SQL Database, Cosmos DB, Event Hub, Service Bus, Redis, etc.), use that service as the app's data store via the appropriate SDK. Seed the service with sample data on first run.
3. **Local JSON Fallback**: Only use in-memory data with static JSON seed files when the architecture has **no** data endpoint
4. **Industry-Aware**: Generate domain models and seed data matching the project's business industry
5. **Container-Ready**: For container targets, include a multi-stage `Dockerfile`
6. **azd-Integrated**: Wire the app as a service in `azure.yaml` so `azd deploy` picks it up

## DO / DON'T

### DO

- ✅ Read architecture assessment to determine compute target and eligibility
- ✅ Scaffold using `dotnet new webapp --framework net10.0 --name {ProjectName}.Web`
- ✅ Place the app under `generated-scenarios/{project}/src/{ProjectName}.Web/`
- ✅ Generate industry-specific models, seed data, and Razor pages
- ✅ Detect data endpoints in the architecture (Storage Table, SQL, Cosmos DB, etc.)
- ✅ When a data service exists: use its SDK, connect via managed identity or connection string from app settings, seed sample data on first run
- ✅ When no data service exists: include a `SeedData/` folder with JSON files and use in-memory collections
- ✅ Add a `Dockerfile` for container-targeted scenarios (multi-stage build)
- ✅ Update `azure.yaml` to register the app as a service
- ✅ Run `dotnet build` to validate the project compiles

### DON'T

- ❌ Generate a webapp for VM-only scenarios
- ❌ Use local JSON when the architecture already includes a data service — always prefer the real backend
- ❌ Use a framework other than .NET 10 C#
- ❌ Create overly complex architectures — this is a demo/sample app
- ❌ Skip `dotnet build` validation
- ❌ Hardcode Azure-specific config in the app — use environment variables and app settings
- ❌ Forget to wire the service in `azure.yaml`
- ❌ Create the `.sln` file in the workspace root — it MUST go in `generated-scenarios/{project}/`

## Prerequisites Check

Before starting, validate these artifacts exist in `generated-scenarios/{project}/`:

| Artifact                        | Required | Purpose                                       |
| ------------------------------- | -------- | --------------------------------------------- |
| `01-requirements.md`            | Yes      | Business industry and context                 |
| `02-architecture-assessment.md` | Yes      | Compute target and service selection          |
| `infra/main.bicep`              | Yes      | Infrastructure templates (for service wiring) |
| `azure.yaml`                    | Yes      | AZD project configuration                     |

## Workflow

### Phase 1: Context Extraction

1. Read `01-requirements.md` — extract **business industry** and **project description**
2. Read `02-architecture-assessment.md` — identify **compute target** (App Service, Container Apps, ACI, AKS, or VM) and **data endpoints**; note the App Service or container resource names
3. If VM-only → SKIP with message and return
4. Scan `infra/` to confirm resource names and connection point details
5. Classify the **data strategy**:

| Architecture Includes   | Data Strategy           | SDK / NuGet Package                                        |
| ----------------------- | ----------------------- | ---------------------------------------------------------- |
| Storage Account (Table) | Azure Table Storage     | `Azure.Data.Tables`                                        |
| SQL Database            | Azure SQL               | `Microsoft.Data.SqlClient`                                 |
| Cosmos DB (NoSQL)       | Cosmos DB SDK           | `Microsoft.Azure.Cosmos`                                   |
| Cosmos DB (Table API)   | Azure Table Storage     | `Azure.Data.Tables`                                        |
| Redis Cache             | Redis                   | `Microsoft.Extensions.Caching.StackExchangeRedis`          |
| Event Hub / Service Bus | Event-driven messaging  | `Azure.Messaging.EventHubs` / `Azure.Messaging.ServiceBus` |
| None of the above       | **Local JSON fallback** | (no extra packages)                                        |

### Phase 2: Scaffold .NET 10 Web App

1. Create project directory: `generated-scenarios/{project}/src/{ProjectName}.Web/`
2. Run scaffold command:

   ```powershell
   cd generated-scenarios/{project}/src
   dotnet new webapp --framework net10.0 --name {ProjectName}.Web --no-https
   ```

3. Create a solution file **in the scenario folder root** (not the workspace root):

   ```powershell
   cd generated-scenarios/{project}
   dotnet new sln --name {ProjectName}
   dotnet sln add src/{ProjectName}.Web/{ProjectName}.Web.csproj
   ```

4. Verify scaffold succeeded with `dotnet build`

### Phase 3: Generate Industry-Specific Models and Data

Based on the business industry from requirements and the data strategy from Phase 1:

1. **Domain Models** in `Models/` — 2-4 entity classes relevant to the industry
2. **Data Service** in `Services/`:
   - **If data backend detected**: Create a service that reads/writes to the Azure service (e.g., `TableStorageDataService`, `CosmosDataService`, `SqlDataService`). Use connection string or managed identity from `IConfiguration`. Include a seed method that populates the backend with sample data if empty.
   - **If no data backend**: Create `SampleDataService` that loads local JSON files in-memory.
3. **Seed Data** in `SeedData/` — JSON files with 10-20 realistic sample records per entity (used for initial seeding of the backend, or as the data source for the fallback)
4. **Razor Pages** in `Pages/` — list and detail pages for each entity

#### Industry Templates

| Industry      | Entities                             | Sample Data Theme                     |
| ------------- | ------------------------------------ | ------------------------------------- |
| Healthcare    | `Doctor`, `Patient`, `Appointment`   | Medical clinic with scheduled visits  |
| Retail        | `Product`, `Category`, `Order`       | E-commerce catalog with sample orders |
| Finance       | `Account`, `Transaction`, `Customer` | Banking with account balances         |
| Education     | `Student`, `Course`, `Enrollment`    | University course registration        |
| Hospitality   | `Room`, `Guest`, `Reservation`       | Hotel booking system                  |
| Logistics     | `Shipment`, `Warehouse`, `Driver`    | Package tracking and fleet management |
| Real Estate   | `Property`, `Agent`, `Listing`       | Property listings and agent directory |
| Manufacturing | `Product`, `WorkOrder`, `Machine`    | Factory floor tracking                |

If the industry doesn't match a known template, derive 2-4 sensible entities from the project description.

### Phase 4: Container Support (Conditional)

If the compute target is Container Apps, ACI, or AKS:

1. Generate a multi-stage `Dockerfile` in `generated-scenarios/{project}/src/{ProjectName}.Web/`:

   ```dockerfile
   FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
   WORKDIR /src
   COPY . .
   RUN dotnet publish -c Release -o /app/publish

   FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
   WORKDIR /app
   COPY --from=build /app/publish .
   EXPOSE 8080
   ENTRYPOINT ["dotnet", "{ProjectName}.Web.dll"]
   ```

2. Add a `.dockerignore` for clean builds

### Phase 5: Wire into azd

Update `generated-scenarios/{project}/azure.yaml` to include the webapp as a service:

**For App Service target:**

```yaml
name: tdd-azd-{project}
metadata:
  template: tddazd-{project}@1.0.0
infra:
  provider: bicep
  path: ./infra
services:
  web:
    project: ./src/{ProjectName}.Web
    host: appservice
    language: csharp
```

**For Container Apps target:**

```yaml
name: tdd-azd-{project}
metadata:
  template: tddazd-{project}@1.0.0
infra:
  provider: bicep
  path: ./infra
services:
  web:
    project: ./src/{ProjectName}.Web
    host: containerapp
    language: csharp
    docker:
      path: ./src/{ProjectName}.Web/Dockerfile
```

### Phase 7: Build Validation

```powershell
cd generated-scenarios/{project}/src/{ProjectName}.Web
dotnet build
```

If the build fails, fix issues before proceeding.

## Output Files

| File                           | Location                                    | Required    |
| ------------------------------ | ------------------------------------------- | ----------- |
| Web App Source                 | `generated-scenarios/{project}/src/{ProjectName}.Web/` | Yes         |
| Dockerfile (container targets) | `generated-scenarios/{project}/src/{ProjectName}.Web/` | Conditional |
| Updated azure.yaml             | `generated-scenarios/{project}/azure.yaml`             | Yes         |

## Validation Checklist

- [ ] Architecture assessment read and eligibility confirmed (not VM-only)
- [ ] .NET 10 webapp scaffolded successfully
- [ ] Industry-specific models and seed data generated
- [ ] In-memory data service loads JSON seed data at startup
- [ ] Razor pages display entity lists and details
- [ ] Dockerfile generated (container targets only)
- [ ] `azure.yaml` updated with service definition
- [ ] `dotnet build` passes without errors
- [ ] README.md updated with Step 4b completion
- [ ] No external database dependencies — all data is local/in-memory

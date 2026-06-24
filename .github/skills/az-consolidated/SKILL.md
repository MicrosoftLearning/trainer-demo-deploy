---
name: azd-demo-builder
description: "Consolidated skill for Azure demo scenario generation: defaults, AVM-first Bicep, architecture diagrams, artifact templates, and demo guide patterns."
compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
license: MIT
metadata:
  author: petender
  version: "2.0"
  category: azure-infrastructure
---

# Azure Demo Builder — Consolidated Skill

Single reference for all agents. Covers Azure defaults, Bicep patterns,
architecture diagrams, artifact templates, and demo guide generation.

---

## 1. Azure Defaults

### Default Regions

| Service             | Default Region  | Reason                              |
| ------------------- | --------------- | ----------------------------------- |
| **All resources**   | `eastus2`       | Primary Azure Region                |
| **Static Web Apps** | `westeurope`    | Not available in swedencentral      |
| **Azure OpenAI**    | `swedencentral` | Limited availability — verify first |
| **Fallback**        | `westus3`       | Secondary Azure Region (if needed)  |

### Required Tags

| Tag               | Required | Example Values       |
| ----------------- | -------- | -------------------- |
| `Environment`     | Yes      | AZD Environment Name |
| `ManagedBy`       | Yes      | `Bicep`              |
| `Project`         | Yes      | Project identifier   |
| `SecurityControl` | Yes      | `Ignore`             |

```bicep
tags: {
  Environment: azd environment name
  ManagedBy: 'Bicep'
  Project: projectName
  SecurityControl: 'Ignore'
}
```

> **Resource Group Tags**: When using `targetScope = 'resourceGroup'`, azd
> creates the RG without tags. Add this to `main.bicep` to tag the RG:
>
> ```bicep
> resource rgTags 'Microsoft.Resources/tags@2024-03-01' = {
>   name: 'default'
>   properties: { tags: tags }
> }
> ```

### Unique Suffix Pattern

Generate ONCE in `main.bicep`, pass to ALL modules:

```bicep
var uniqueSuffix = uniqueString(resourceGroup().id)
```

### Security Baseline

| Setting                    | Value            | Applies To                        |
| -------------------------- | ---------------- | --------------------------------- |
| `supportsHttpsTrafficOnly` | `true`           | Storage accounts                  |
| `minimumTlsVersion`        | `'TLS1_2'`       | All services                      |
| `allowBlobPublicAccess`    | `false`          | Storage accounts                  |
| `publicNetworkAccess`      | `'Disabled'`     | Data services                     |
| Authentication             | Managed Identity | Prefer over keys/strings          |
| SQL Auth                   | Azure AD-only    | `azureADOnlyAuthentication: true` |

### Naming Conventions

| Resource         | Abbreviation | Name Pattern                | Max Length |
| ---------------- | ------------ | --------------------------- | ---------- |
| Resource Group   | `rg`         | `rg-{project}-{env}`        | 90         |
| Virtual Network  | `vnet`       | `vnet-{project}-{env}`      | 64         |
| Subnet           | `snet`       | `snet-{purpose}-{env}`      | 80         |
| NSG              | `nsg`        | `nsg-{purpose}-{env}`       | 80         |
| Key Vault        | `kv`         | `kv-{short}-{env}-{suffix}` | **24**     |
| Storage Account  | `st`         | `st{short}{env}{suffix}`    | **24**     |
| App Service Plan | `asp`        | `asp-{project}-{env}`       | 40         |
| App Service      | `app`        | `app-{project}-{env}`       | 60         |
| SQL Server       | `sql`        | `sql-{project}-{env}`       | 63         |
| SQL Database     | `sqldb`      | `sqldb-{project}-{env}`     | 128        |
| Static Web App   | `stapp`      | `stapp-{project}-{env}`     | 40         |
| Log Analytics    | `log`        | `log-{project}-{env}`       | 63         |
| App Insights     | `appi`       | `appi-{project}-{env}`      | 255        |
| Container App    | `ca`         | `ca-{project}-{env}`        | 32         |
| Container Env    | `cae`        | `cae-{project}-{env}`       | 60         |
| Cosmos DB        | `cosmos`     | `cosmos-{project}-{env}`    | 44         |
| Service Bus      | `sb`         | `sb-{project}-{env}`        | 50         |

**Length-constrained resources** (Key Vault, Storage — 24 char limit):

```bicep
var kvName = 'kv-${take(projectName, 8)}-${take(environment, 3)}-${take(uniqueSuffix, 6)}'
var stName = 'st${take(replace(projectName, '-', ''), 8)}${take(environment, 3)}${take(uniqueSuffix, 6)}'
```

**Rules**: lowercase with hyphens, include `uniqueSuffix` in globally unique names,
use `take()` to truncate, no hyphens in Storage Account names.

### azure.yaml Naming Convention

Every `generated-scenarios/{project}/azure.yaml` MUST follow this naming pattern:

```yaml
name: tdd-azd-{project}
metadata:
  template: tddazd-{project}@1.0.0
infra:
  provider: bicep
  path: ./infra
```

| Field      | Pattern                  | Example (`newfoundrydemo`)    |
| ---------- | ------------------------ | ----------------------------- |
| `name`     | `tdd-azd-{project}`      | `tdd-azd-newfoundrydemo`      |
| `template` | `tddazd-{project}@1.0.0` | `tddazd-newfoundrydemo@1.0.0` |

> [!IMPORTANT]
> The `name` field uses `tdd-azd-` prefix (with hyphens).
> The `template` field uses `tddazd-` prefix (no hyphens before project name).
> This is mandatory for all scenarios — agents generating `azure.yaml` must apply this.

---

## 2. Azure Verified Modules (AVM)

### AVM-First Policy

1. **ALWAYS** check AVM availability first via `mcp_bicep_list_avm_metadata`
2. Use AVM module defaults for SKUs when available
3. **NEVER** write raw Bicep for a resource that has an AVM module

### Common AVM Modules

| Resource           | Module Path                                        | Min Version |
| ------------------ | -------------------------------------------------- | ----------- |
| Key Vault          | `br/public:avm/res/key-vault/vault`                | `0.11.0`    |
| Virtual Network    | `br/public:avm/res/network/virtual-network`        | `0.5.0`     |
| Storage Account    | `br/public:avm/res/storage/storage-account`        | `0.14.0`    |
| App Service Plan   | `br/public:avm/res/web/serverfarm`                 | `0.4.0`     |
| App Service        | `br/public:avm/res/web/site`                       | `0.12.0`    |
| SQL Server         | `br/public:avm/res/sql/server`                     | `0.10.0`    |
| Log Analytics      | `br/public:avm/res/operational-insights/workspace` | `0.9.0`     |
| App Insights       | `br/public:avm/res/insights/component`             | `0.4.0`     |
| NSG                | `br/public:avm/res/network/network-security-group` | `0.5.0`     |
| Static Web App     | `br/public:avm/res/web/static-site`                | `0.4.0`     |
| Container App      | `br/public:avm/res/app/container-app`              | `0.11.0`    |
| Container Env      | `br/public:avm/res/app/managed-environment`        | `0.8.0`     |
| Cosmos DB          | `br/public:avm/res/document-db/database-account`   | `0.10.0`    |
| Front Door         | `br/public:avm/res/cdn/profile`                    | `0.7.0`     |
| Service Bus        | `br/public:avm/res/service-bus/namespace`          | `0.10.0`    |
| Container Registry | `br/public:avm/res/container-registry/registry`    | `0.6.0`     |

### AVM Usage Pattern

```bicep
module keyVault 'br/public:avm/res/key-vault/vault:0.11.0' = {
  name: '${kvName}-deploy'
  params: {
    name: kvName
    location: location
    tags: tags
    enableRbacAuthorization: true
    enablePurgeProtection: true
  }
}
```

### AVM Known Pitfalls

| Module                 | Issue                                       | Fix                                          |
| ---------------------- | ------------------------------------------- | -------------------------------------------- |
| Log Analytics          | `dailyQuotaGb` is `int`, not `string`       | Use `dailyQuotaGb: 5`                        |
| Container Env          | `appLogsConfiguration` deprecated           | Use `logsConfiguration` with destination obj |
| Container App          | `scaleSettings` is object, not array        | Check AVM schema for exact shape             |
| SQL Server             | `sku` is typed object `{name,tier,cap}`     | Pass full SKU object                         |
| App Service            | Instrumentation key deprecated              | Use `APPLICATIONINSIGHTS_CONNECTION_STRING`  |
| Key Vault              | `softDeleteRetentionInDays` is immutable    | Set correctly on first deploy (default: 90)  |
| Static Web App         | Free SKU unreliable via ARM in some regions | Use `Standard` for reliable Bicep deployment |
| Static Web Apps region | Only 5 regions available                    | Use `westeurope` for EU                      |

---

## 3. Bicep Patterns

### Private Endpoint Wiring

Three-resource pattern: private endpoint → DNS zone group → DNS zone link.

```bicep
resource privateEndpoint 'Microsoft.Network/privateEndpoints@2024-01-01' = {
  name: 'pe-${serviceName}-${uniqueSuffix}'
  location: location
  tags: tags
  properties: {
    subnet: { id: subnetId }
    privateLinkServiceConnections: [
      {
        name: 'plsc-${serviceName}'
        properties: {
          privateLinkServiceId: targetResourceId
          groupIds: [groupId]
        }
      }
    ]
  }
}

resource privateDnsZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2024-01-01' = {
  parent: privateEndpoint
  name: 'default'
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'config'
        properties: { privateDnsZoneId: privateDnsZoneId }
      }
    ]
  }
}
```

**Group IDs by service type:**

| Service       | Group ID    | DNS Zone                             |
| ------------- | ----------- | ------------------------------------ |
| Storage Blob  | `blob`      | `privatelink.blob.core.windows.net`  |
| Storage Table | `table`     | `privatelink.table.core.windows.net` |
| Key Vault     | `vault`     | `privatelink.vaultcore.azure.net`    |
| SQL Server    | `sqlServer` | `privatelink.database.windows.net`   |
| Cosmos DB     | `Sql`       | `privatelink.documents.azure.com`    |
| App Service   | `sites`     | `privatelink.azurewebsites.net`      |
| Event Hub     | `namespace` | `privatelink.servicebus.windows.net` |
| Container Reg | `registry`  | `privatelink.azurecr.io`             |

### Diagnostic Settings

Every resource must send logs and metrics to a workspace:

```bicep
param logAnalyticsWorkspaceName string

resource workspace 'Microsoft.OperationalInsights/workspaces@2023-09-01' existing = {
  name: logAnalyticsWorkspaceName
}

resource diagnosticSettings 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  name: 'diag-${parentResourceName}'
  scope: parentResource
  properties: {
    workspaceId: workspace.id
    logs: [{ categoryGroup: 'allLogs', enabled: true }]
    metrics: [{ category: 'AllMetrics', enabled: true }]
  }
}
```

### Conditional Deployment

```bicep
@description('Deploy a Redis cache for session state')
param deployRedis bool = false

module redis 'modules/redis.bicep' = if (deployRedis) {
  name: 'redis-cache'
  params: {
    name: 'redis-${projectName}-${environment}-${uniqueSuffix}'
    location: location
    tags: tags
  }
}

output redisHostName string = deployRedis ? redis.outputs.hostName : ''
```

### Module Composition Contract

Every module accepts `name`, `location`, `tags`, `logAnalyticsWorkspaceName`.
Every module outputs `resourceId`, `resourceName`, `principalId`.

```bicep
// modules/storage.bicep
@description('Storage account name (max 24 chars)')
param name string
@description('Azure region')
param location string
@description('Resource tags')
param tags object
@description('Log Analytics workspace name for diagnostics')
param logAnalyticsWorkspaceName string

// ... resource definition ...

@description('Resource ID of the storage account')
output resourceId string = storageAccount.id
@description('Name of the storage account')
output resourceName string = storageAccount.name
@description('Principal ID of the managed identity (empty if none)')
output principalId string = storageAccount.identity.?principalId ?? ''
```

### Managed Identity Binding

```bicep
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, appService.id, keyVaultSecretsUserRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      keyVaultSecretsUserRoleId
    )
    principalId: appService.identity.principalId
    principalType: 'ServicePrincipal'
  }
}
```

**Common role definition IDs:**

| Role                      | ID                                     |
| ------------------------- | -------------------------------------- |
| Key Vault Secrets User    | `4633458b-17de-408a-b874-0445c86b69e6` |
| Storage Blob Data Reader  | `2a2b9908-6ea1-4ae2-8e65-a410df84e7d1` |
| Storage Blob Data Contrib | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
| Cosmos DB Account Reader  | `fbdf93bf-df7d-467e-a4d2-9458aa1360c8` |
| SQL DB Contributor        | `9b7fa17d-e63e-47b0-bb0a-15c516ac86ec` |

### Deployer Data Plane Access (MANDATORY)

When resources use RBAC for data plane authorization (e.g., Key Vault with
`enableRbacAuthorization: true`, Storage with `allowSharedKeyAccess: false`),
the deploying user loses data plane access unless explicit role assignments are created.

**Rule**: Every RBAC-enabled resource MUST include a role assignment granting the
deploying user (the person running `azd up`) appropriate data plane access.

**Step 1 — Accept the deployer's principal ID in `main.bicep`:**

```bicep
@description('Principal ID of the deploying user. Azure Developer CLI populates this automatically.')
param principalId string
```

**Step 2 — Wire `AZURE_PRINCIPAL_ID` in `main.bicepparam`:**

```bicep
param principalId = readEnvironmentVariable('AZURE_PRINCIPAL_ID', '')
```

> [!NOTE]
> `azd` automatically sets the `AZURE_PRINCIPAL_ID` environment variable
> to the signed-in user's object ID. No manual configuration is needed.

**Step 3 — Create role assignments for the deployer on each RBAC-enabled resource:**

```bicep
// Deployer data plane access — Key Vault Administrator
resource deployerKvRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(principalId)) {
  name: guid(keyVault.id, principalId, keyVaultAdminRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      keyVaultAdminRoleId
    )
    principalId: principalId
    principalType: 'User'
  }
}
```

> [!IMPORTANT]
> Use `principalType: 'User'` for the deployer (not `ServicePrincipal`).
> Wrap in `if (!empty(principalId))` to avoid failures in CI/CD pipelines
> where the parameter may be empty.

**Deployer data plane role mapping — assign one per RBAC-enabled resource:**

| Resource                | Recommended Role               | Role Definition ID                     |
| ----------------------- | ------------------------------ | -------------------------------------- |
| Key Vault               | Key Vault Administrator        | `00482a5a-887f-4fb3-b363-3b7fe8e74483` |
| Storage Account (Blob)  | Storage Blob Data Contributor  | `ba92f5b4-2d11-453d-a403-e96b0029c9fe` |
| Storage Account (Table) | Storage Table Data Contributor | `0a9a7e1f-b9d0-4cc4-a60d-0319b160aaa3` |
| Cosmos DB (NoSQL)       | Cosmos DB Data Contributor     | Use custom Cosmos DB data plane role   |
| Service Bus             | Service Bus Data Owner         | `090c5cfd-751d-490a-894a-3ce6f1109419` |
| Event Hubs              | Event Hubs Data Owner          | `f526a384-b230-433a-b45c-95f59c4a2dec` |
| Azure AI Search         | Search Index Data Contributor  | `8ebe5a00-799e-43f5-93ac-243d3dce84a7` |
| App Configuration       | App Configuration Data Owner   | `5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b` |

> [!TIP]
> For demo/PoC scenarios, prefer the broader admin/owner data plane roles
> (e.g., `Key Vault Administrator` over `Key Vault Secrets User`) so the
> deployer can fully manage the resource during demonstrations.

## 4. Architecture Diagrams

> [!CAUTION]
> **MANDATORY DELIVERABLES — Both diagram types are required for every scenario.**
> A scenario is NOT complete without both the architecture diagram AND the runtime flow diagram.

### Output Naming

```text
generated-scenarios/{project}/
├── 03-architect-diagram.py              # Architecture diagram source
├── 03-architect-diagram.png             # Architecture diagram PNG
├── 03-architect-runtime-diagram.py      # Runtime flow diagram source
├── 03-architect-runtime-diagram.png     # Runtime flow diagram PNG
```

### Execution

Save `.py` to `generated-scenarios/{project}/`, then execute **both**:

```bash
python3 generated-scenarios/{project}/03-architect-diagram.py
python3 generated-scenarios/{project}/03-architect-runtime-diagram.py
```

Verify both PNGs exist on disk before marking Step 3 complete.

### Diagram Types

| Type                     | Purpose                                             | File Prefix                    |
| ------------------------ | --------------------------------------------------- | ------------------------------ |
| **Architecture Diagram** | Static resource layout, boundaries, Azure hierarchy | `03-architect-diagram`         |
| **Runtime Flow Diagram** | Data paths, request flows, auth chains at runtime   | `03-architect-runtime-diagram` |

### Runtime Flow Diagram Guidelines

The runtime diagram shows how data and requests move through the architecture during operation:

- **Request paths**: User → App Gateway/Front Door → App Service → Database
- **Data flows**: App → Storage (read/write), App → Cache (read), App → Event Hub (publish)
- **Auth flows**: App → Managed Identity → Key Vault, App → Entra ID
- **Telemetry flows**: App → App Insights → Log Analytics
- Use `Edge(label="...")` with flow taxonomy labels (request, read, write, auth, telemetry)
- Use `Edge(style="dashed")` for config/secret retrieval flows
- Use `direction="LR"` to emphasize the flow direction

### Diagram Contract

- Cluster vars: `clu_<scope>_<slug>` (scope: `sub|rg|net|tier|zone|ext`)
- Node vars: `n_<domain>_<service>_<role>` (domain: `edge|web|app|data|id|sec|ops|int`)
- Flow taxonomy: `auth|request|response|read|write|event|replicate|secret|telemetry|admin`
- Default `direction="LR"` unless justified
- Short labels (2-4 words), max 3 edge styles

### Prerequisites

```bash
pip install diagrams matplotlib pillow
# Graphviz required: choco install graphviz (Windows)
```

### Quick Start

```python
from diagrams import Diagram, Cluster, Edge
from diagrams.azure.compute import AppServices
from diagrams.azure.database import CosmosDb
from diagrams.azure.network import ApplicationGateway
from diagrams.azure.security import KeyVaults
from diagrams.azure.identity import ActiveDirectory

graph_attr = {
    "bgcolor": "white",
    "pad": "0.8",
    "nodesep": "0.9",
    "ranksep": "0.9",
    "splines": "spline",
    "fontname": "Arial Bold",
    "fontsize": "16",
    "dpi": "150",
}

node_attr = {
    "fontname": "Arial Bold",
    "fontsize": "11",
    "labelloc": "t",
}

cluster_style = {"margin": "30", "fontname": "Arial Bold", "fontsize": "14"}

with Diagram("Architecture",
             show=False,
             direction="LR",
             graph_attr=graph_attr,
             node_attr=node_attr):

    with Cluster("Resource Group", graph_attr=cluster_style):
        app = AppServices("Web App")
        db = CosmosDb("Cosmos DB")

    app >> Edge(label="Managed Identity") >> db
```

### Azure Service Categories

| Category        | Import                       | Key Services                                           |
| --------------- | ---------------------------- | ------------------------------------------------------ |
| **Compute**     | `diagrams.azure.compute`     | VM, AKS, Functions, App Service, Container Apps        |
| **Networking**  | `diagrams.azure.network`     | VNet, Load Balancer, App Gateway, Front Door, Firewall |
| **Database**    | `diagrams.azure.database`    | SQL, Cosmos DB, PostgreSQL, MySQL, Redis               |
| **Storage**     | `diagrams.azure.storage`     | Blob, Files, Data Lake, Queue, Table                   |
| **Integration** | `diagrams.azure.integration` | Logic Apps, Service Bus, Event Grid, APIM              |
| **Security**    | `diagrams.azure.security`    | Key Vault, Sentinel, Defender                          |
| **Identity**    | `diagrams.azure.identity`    | Entra ID, Managed Identity                             |
| **Monitor**     | `diagrams.azure.monitor`     | Monitor, App Insights, Log Analytics                   |

### Connection Syntax

```python
a >> b                              # Simple arrow
a >> b >> c                         # Chain
a >> [b, c, d]                      # Fan-out
[a, b] >> c                         # Fan-in
a >> Edge(label="HTTPS") >> b       # Labeled
a >> Edge(style="dashed") >> b      # Dashed (config/secrets)
```

### Clusters

Map Azure hierarchy: Subscription -> Resource Group -> VNet -> Subnet.
Include CIDR blocks in VNet/Subnet labels.

```python
with Cluster("rg-app-prod"):
    with Cluster("vnet-spoke (10.1.0.0/16)"):
        with Cluster("snet-app (10.1.1.0/24)"):
            app = AppServices("Web App")
```

### Guardrails

- **DO**: Save to `generated-scenarios/{project}/` with `projectname-*` prefix
- **DO**: Execute Python to generate PNG, verify it exists
- **DO**: Use actual resource names from IaC, not placeholders
- **DO**: Use `labelloc='t'` in `node_attr` for clean labels
- **DON'T**: Skip PNG generation
- **DON'T**: Use invalid or made-up diagram node types
- **DON'T**: Use Mermaid for architecture diagrams (always Python `diagrams`)

---

## 5. Artifact Templates

### Generation Rules

| Rule                | Requirement                                             |
| ------------------- | ------------------------------------------------------- |
| **Template H2s**    | Use H2 text from this skill verbatim, in listed order   |
| **No omissions**    | Every listed H2 must appear in output                   |
| **Anchor rule**     | Extra sections allowed only AFTER last required H2      |
| **Attribution**     | Include: `> Generated by {agent} agent \| {YYYY-MM-DD}` |
| **Output folder**   | All artifacts to `generated-scenarios/{project}/`                  |
| **No placeholders** | No "TBD", "Insert here", or "TODO" in final output      |

### Project Scenario README

Every project in `generated-scenarios/{project}/` **MUST** have a `README.md`.
Template: `.github/skills/az-azure-artifacts/templates/PROJECT-README.template.md`

After saving step artifacts, update README: mark step complete, add artifact files,
update date and progress percentage (each step ≈ 14%).

### Documentation Styling

**Callout styles:**

```markdown
> [!NOTE] — Informational
> [!TIP] — Best practice
> [!IMPORTANT] — Critical configuration
> [!WARNING] — Security/reliability risk
> [!CAUTION] — Data loss / breaking change
```

**Status emoji:**

| Purpose          | Emoji |
| ---------------- | ----- |
| Success/Complete | ✅    |
| Warning          | ⚠️    |
| Error/Critical   | ❌    |
| Info/Tip         | 💡    |
| Security         | 🔐    |
| Pending          | ⏳    |

**Category icons:**

| Category   | Icon |
| ---------- | ---- |
| Compute    | 💻   |
| Data       | 💾   |
| Networking | 🌐   |
| Security   | 🔐   |
| Monitoring | 📊   |
| Identity   | 👤   |
| Storage    | 📦   |

---

## 6. Demo Guide Patterns

> [!CAUTION]
> **MANDATORY — Playwright Screenshots Are Required**
>
> Every demo guide MUST include Playwright-captured screenshots of the deployed
> Azure resources. This is a required deliverable, not a nice-to-have.
> Screenshots MUST be stored in `generated-scenarios/{project}/demoguide/images/`.

### Screenshot Requirements

| Screenshot                               | Source                                   | Required  |
| ---------------------------------------- | ---------------------------------------- | --------- |
| Resource group overview                  | Azure Portal → Resource Group → Overview | Yes       |
| Key resource detail (per major resource) | Azure Portal → Resource → Overview       | Yes       |
| Network topology (if VNet present)       | Azure Portal → VNet → Diagram            | If VNet   |
| Demo step result (per step)              | Portal view showing expected outcome     | Yes       |
| Deployed webapp homepage (if webapp)     | Live webapp URL in browser               | If webapp |

### Screenshot Workflow

1. Use Playwright MCP `browser_take_screenshot` to capture each required screenshot
2. Store in `generated-scenarios/{project}/demoguide/images/` with descriptive filenames
3. Reference in demo guide using: `<img src="demoguide/images/{filename}.png" alt="{desc}" style="width:70%;" />`
4. If Playwright unavailable: insert `TODO: capture screenshot` placeholders **and report to user**

{context will be added later}

### Quality Standards

- Every CLI command uses actual project resource names (no `{placeholder}` in final output)
- Time estimates add up to ±2 min of audience format total
- Contingency playbook covers top 3 most likely failure scenarios
- Pre-demo checklist validates all resources the demo touches
- Talking points match the selected audience persona tone

---

## 7. Webapp Development Patterns

For full details, see `.github/skills/az-webapp-development/SKILL.md`.

### When to Generate a Sample Webapp

| Compute Target   | Webapp? | Host Type      |
| ---------------- | ------- | -------------- |
| App Service      | Yes     | `appservice`   |
| Container Apps   | Yes     | `containerapp` |
| ACI              | Yes     | `aci`          |
| AKS              | Yes     | `aks`          |
| Virtual Machines | No      | —              |

### Industry Data Models

| Industry      | Entities                       |
| ------------- | ------------------------------ |
| Healthcare    | Doctor, Patient, Appointment   |
| Retail        | Product, Category, Order       |
| Finance       | Customer, Account, Transaction |
| Education     | Student, Course, Enrollment    |
| Hospitality   | Room, Guest, Reservation       |
| Logistics     | Shipment, Warehouse, Driver    |
| Real Estate   | Property, Agent, Listing       |
| Manufacturing | Product, WorkOrder, Machine    |

### Data Strategy

The webapp's data storage depends on the architecture:

| Architecture Includes           | Data Strategy              | Fallback   |
| ------------------------------- | -------------------------- | ---------- |
| Storage Account (Table Storage) | `Azure.Data.Tables` SDK    | —          |
| SQL Database                    | `Microsoft.Data.SqlClient` | —          |
| Cosmos DB                       | `Microsoft.Azure.Cosmos`   | —          |
| Redis Cache                     | Redis caching SDK          | —          |
| **No data service**             | —                          | Local JSON |

> Use the Azure data service when present; fall back to local JSON only when
> no data endpoint exists in the architecture.

### azd Service Wiring

When a sample webapp is generated, `azure.yaml` gains a `services:` block:

```yaml
services:
  web:
    project: ./src/{ProjectName}.Web
    host: { appservice|containerapp|aci|aks }
    language: csharp
```

Container targets also require a `docker.path` entry pointing to the Dockerfile.

---
description: "Infrastructure as Code best practices for Azure Bicep templates using Azure Developer CLI (azd) with a focus on Azure Verified Modules (AVM) and policy compliance."
applyTo: "**/*.bicep, **/azure.yaml"
---

# Bicep Development Best Practices

## Quick Reference

| Rule              | Standard                                                                    |
| ----------------- | --------------------------------------------------------------------------- |
| Region            | `eastus2` (alt: `westus3`)                                                  |
| Resource group    | Always named after the azd environment: `rg-${environment}` — see below    |
| Unique suffix     | `var uniqueSuffix = uniqueString(resourceGroup().id)` in main.bicep         |
| AVM first         | **MANDATORY** - Use Azure Verified Modules where available                  |
| Tags              | Environment, ManagedBy, Project, SecurityControl: 'Ignore' on ALL resources **including the resource group** |

## Naming Conventions

### Resource Patterns

| Resource   | Max | Pattern                        | Example                  |
| ---------- | --- | ------------------------------ | ------------------------ |
| Storage    | 24  | `st{project}{env}{suffix}`     | `stcontosodev7xk2`       |
| Key Vault  | 24  | `kv-{project}-{env}-{suffix}`  | `kv-contoso-dev-abc123`  |
| SQL Server | 63  | `sql-{project}-{env}-{suffix}` | `sql-contoso-dev-abc123` |

### Identifiers

Use lowerCamelCase for parameters, variables, resources, modules.

## Unique Names (CRITICAL)

```bicep
// main.bicep - Generate once, pass to ALL modules
var uniqueSuffix = uniqueString(resourceGroup().id)

module keyVault 'modules/key-vault.bicep' = {
  params: { uniqueSuffix: uniqueSuffix }
}

// Every module must accept uniqueSuffix and use it in resource names
var kvName = 'kv-${take(projectName, 10)}-${environment}-${take(uniqueSuffix, 6)}'
```

## Resource Group Naming (MANDATORY)

The resource group must always be named after the azd environment so operators
can immediately identify which environment a resource group belongs to.

- Pattern: `rg-{environment}` (e.g. `rg-demo`, `rg-wed0429`)
- In `main.bicep`, declare as a `targetScope = 'subscription'` deployment and
  create the resource group inline, **or** use the azd default resource group
  name convention by setting it in `main.bicepparam`:

```bicep
// main.bicepparam — wire the env name so azd names the RG correctly
param environment = readEnvironmentVariable('AZURE_ENV_NAME', 'demo')
```

```bicep
// main.bicep — derive the resource group name from the environment
var resourceGroupName = 'rg-${environment}'
```

When `targetScope = 'resourceGroup'` (the default), ensure the azd environment
is created with a matching resource group:

```bash
azd env new my-env
azd env set AZURE_RESOURCE_GROUP rg-my-env  # optional override
azd up
```

azd automatically creates a resource group named `rg-{AZURE_ENV_NAME}` on
`azd up` — **do not override this default unless the project has a specific
naming requirement**.

### Resource Group Tags (MANDATORY)

When using `targetScope = 'resourceGroup'`, azd creates the resource group
automatically **without tags**. You MUST add a `Microsoft.Resources/tags`
resource in `main.bicep` to apply the standard tags to the resource group:

```bicep
@description('Apply standard tags to the resource group itself')
resource rgTags 'Microsoft.Resources/tags@2024-03-01' = {
  name: 'default'
  properties: {
    tags: tags
  }
}
```

Place this resource **before** any module deployments in `main.bicep`.
This ensures the resource group has the same `SecurityControl: 'Ignore'`
and other standard tags as all child resources.

## Parameters

```bicep
@description('Azure region for all resources.')
@allowed(['swedencentral', 'germanywestcentral', 'northeurope'])
param location string = 'swedencentral'

@description('Unique suffix for resource naming.')
@minLength(5)
param uniqueSuffix string
```

## Security Defaults (MANDATORY)

> [!IMPORTANT]
> The security settings below are baseline defaults. Discovered Azure Policy
> See `bicep-policy-compliance.instructions.md`.

```bicep
// Storage
supportsHttpsTrafficOnly: true
minimumTlsVersion: 'TLS1_2'
allowBlobPublicAccess: false
allowSharedKeyAccess: false  // Policy may require this

// SQL
azureADOnlyAuthentication: true
minimalTlsVersion: '1.2'
publicNetworkAccess: 'Disabled'
```

## Deployer Data Plane Access (MANDATORY)

> [!IMPORTANT]
> When a resource uses RBAC for data plane authorization, the deploying user
> has **no data plane access by default**. You MUST assign explicit role assignments.

Every `main.bicep` must accept the deployer's identity and assign data plane roles:

```bicep
@description('Principal ID of the deployer (azd auto-provides via AZURE_PRINCIPAL_ID)')
param principalId string
```

In `main.bicepparam`:

```bicep
param principalId = readEnvironmentVariable('AZURE_PRINCIPAL_ID', '')
```

For each RBAC-enabled resource, add a deployer role assignment in the
role assignment module (or inline). Use `principalType: 'User'` and guard
with `if (!empty(principalId))`:

```bicep
var keyVaultAdminRoleId = '00482a5a-887f-4fb3-b363-3b7fe8e74483'

resource deployerKvRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = if (!empty(principalId)) {
  name: guid(keyVault.id, principalId, keyVaultAdminRoleId)
  scope: keyVault
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', keyVaultAdminRoleId)
    principalId: principalId
    principalType: 'User'
  }
}
```

**Resources that require deployer data plane roles:**

| Resource          | Role                          | Why                                       |
| ----------------- | ----------------------------- | ----------------------------------------- |
| Key Vault (RBAC)  | Key Vault Administrator       | Read/write secrets, keys, certificates    |
| Storage (no SAS)  | Storage Blob Data Contributor | Read/write blobs when shared key disabled |
| Cosmos DB         | Cosmos DB Data Contributor    | Read/write documents                      |
| Service Bus       | Service Bus Data Owner        | Send/receive messages                     |
| Event Hubs        | Event Hubs Data Owner         | Send/receive events                       |
| App Configuration | App Config Data Owner         | Read/write configuration values           |

See `.github/skills/az-consolidated/SKILL.md` → "Deployer Data Plane Access" for full role ID table.

## Diagnostic Settings Pattern

```bicep
// Pass NAMES not IDs to diagnostic modules
module diagnostics 'modules/diagnostics.bicep' = {
  params: { appServiceName: appModule.outputs.appServiceName }
}

// In module - use existing keyword
resource appService 'Microsoft.Web/sites@2023-12-01' existing = {
  name: appServiceName
}
resource diag 'Microsoft.Insights/diagnosticSettings@2021-05-01-preview' = {
  scope: appService  // ✅ Symbolic reference works
}
```

## Module Outputs (MANDATORY)

```bicep
// Every module must output BOTH ID and Name
output resourceId string = resource.id
output resourceName string = resource.name
output principalId string = resource.identity.principalId
```

## Azure Verified Modules (AVM)

**MANDATORY: Use AVM modules for ALL resources where an AVM module exists.**

Raw Bicep is only permitted when no AVM module exists.
Document the rationale in implementation reference.

```bicep
// ✅ Use AVM for Key Vault
module keyVault 'br/public:avm/res/key-vault/vault:0.11.0' = {
  params: { name: kvName, location: location, tags: tags }
}

// ❌ Only use raw resources if no AVM exists
```

### AVM Fallback Workflow

1. **Check AVM availability**: Use `mcp_bicep_list_avm_metadata` or https://aka.ms/avm/index
2. **If AVM exists**: Use `br/public:avm/res/{service}/{resource}:{version}`
3. **If no AVM**: Use raw Bicep and document why no AVM module applies
4. Document justification in implementation reference

## Azure SQL — AAD-Only Auth Pattern

When using `azureADOnlyAuthentication: true`, the SQL Server still requires a local
`administratorLogin`/`administratorLoginPassword` via the ARM API, but that account is
disabled for actual login. **These values must differ from the AAD admin login name.**

- Always hardcode `administratorLogin` to a static value distinct from the AAD admin
  login (e.g., `'sqladminlocal'`). Never re-use the same string for both.
- The `administrators.login` field is the AAD principal display name/UPN passed in as a
  parameter.

```bicep
// ✅ Correct — local admin name is distinct from AAD admin login
module sqlServer 'br/public:avm/res/sql/server:0.10.0' = {
  params: {
    administratorLogin: 'sqladminlocal'          // static, never used for auth
    administratorLoginPassword: uniqueString(...)  // irrelevant with AAD-only
    administrators: {
      azureADOnlyAuthentication: true
      login: sqlAdminLogin                        // AAD principal display name
      sid: sqlAdminObjectId
    }
  }
}

// ❌ Wrong — same value for both causes ExternalAdministratorLoginSameAsSqlAdmin
// administratorLogin: sqlAdminLogin
// administrators: { login: sqlAdminLogin }
```

## Patterns to Avoid

| Anti-Pattern           | Problem          | Solution                             |
| ---------------------- | ---------------- | ------------------------------------ |
| Hardcoded names        | Collisions       | Use `uniqueString()` suffix          |
| Missing `@description` | Poor docs        | Document all parameters              |
| Explicit `dependsOn`   | Unnecessary      | Use symbolic references              |
| Resource ID for scope  | BCP036 error     | Use `existing` + names               |
| S1 for zone redundancy | Policy blocks    | Use P1v3+                            |
| `RequestHeaders`       | ARM error        | Use `RequestHeader` (singular)       |
| WAF policy hyphens     | Validation fails | `wafpolicy{name}` alphanumeric only  |
| Raw Bicep (no AVM)     | Policy drift     | Use AVM modules or document fallback |

## Zone Redundancy SKUs

| SKU       | Zone Redundancy  | Use Case            |
| --------- | ---------------- | ------------------- |
| S1/S2     | ❌ Not supported | Dev/test            |
| P1v3/P2v3 | ✅ Supported     | Production          |
| P1v4/P2v4 | ✅ Supported     | Production (latest) |

## Azure.YAML

The AZD framework requires an azure.yaml file in the root of the \scenario\{project}\ folder with the following content:

```yaml
name: tdd-azd-{project}
metadata:
  template: tdd-azd-{project}@1.0.0
infra:
  provider: bicep
```

## Validation Commands

```bash
bicep build main.bicep
bicep lint main.bicep
az deployment group what-if --resource-group rg-example --template-file main.bicep
```

## 🚀 To Actually Deploy

```bash
# Navigate to project directory
cd generated-scenarios/{project-name}

# Initialize azd environment (first time only)
azd init

# Preview infrastructure changes
azd provision --preview

# Deploy infrastructure
azd up
```

> [!TIP]
> Use `azd down` to tear down all deployed resources when the demo is complete.

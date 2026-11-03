---
name: azure-validate
description: "Pre-deployment and post-deployment validation patterns for Azure infrastructure. Covers authentication, template linting, what-if analysis, resource provider checks, and health verification."
compatibility: Works with Claude Code, GitHub Copilot, VS Code, and any Agent Skills compatible tool.
license: MIT
metadata:
  author: petender
  version: "1.0"
  category: azure-validation
---

# Azure Validate Skill

Pre-deployment and post-deployment validation gates that ensure Azure
infrastructure is ready for deployment and correctly provisioned afterward.
Used by the Deploy agent as hard gates before executing any deployment.

---

## 1. Pre-Deployment Validation Gates

All gates must pass before deployment proceeds. Each gate is a hard stop —
failure means the deployment cannot continue until the issue is resolved.

> [!CAUTION]
> **GATE FAILURE POLICY**: If a gate fails and cannot be auto-remediated,
> **present the failure to the user and ask how to proceed**.
> Do NOT autonomously skip deployment or generate a dry-run summary.
> The user must explicitly decide whether to:
>
> 1. Fix the issue and retry
> 2. Skip the gate (accepting risk)
> 3. Abort the deployment

### Gate Sequence

```text
Gate 1: Authentication    → az login / azd auth status
Gate 2: Subscription      → correct subscription selected
Gate 3: Template          → bicep build + bicep lint pass
Gate 4: Parameters        → required params have values
Gate 5: Resource Providers → all needed providers registered
Gate 6: What-If           → no unexpected destructive changes
```

---

## 2. Gate 1 — Authentication Check

### Azure CLI

```powershell
# Check if logged in
$account = az account show 2>$null | ConvertFrom-Json
if (-not $account) {
    Write-Error "Not authenticated. Run 'az login' first."
    exit 1
}
Write-Host "Authenticated as: $($account.user.name)"
Write-Host "Tenant: $($account.tenantId)"
```

### Azure Developer CLI

```powershell
# Check azd authentication
azd auth login --check-status
```

### Expected Output

| Field                      | Check                                |
| -------------------------- | ------------------------------------ |
| `user.name` or `user.type` | Non-empty; matches expected identity |
| `tenantId`                 | Matches the target tenant            |
| `state`                    | `Enabled`                            |

> [!WARNING]
> Service principal authentication (`user.type: "servicePrincipal"`) may have
> restricted permissions compared to interactive login. Verify RBAC before proceeding.

---

## 3. Gate 2 — Subscription Context

### Verify Correct Subscription

```powershell
# Show current subscription
az account show --query "{Name:name, SubscriptionId:id, State:state}" -o table

# List all available subscriptions
az account list --query "[].{Name:name, SubscriptionId:id, IsDefault:isDefault}" -o table
```

### Switch Subscription (If Needed)

```powershell
# By name
az account set --subscription "Visual Studio Enterprise"

# By ID
az account set --subscription "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

### Validation Checks

| Check                       | Command                                                          | Expected                |
| --------------------------- | ---------------------------------------------------------------- | ----------------------- |
| Subscription state          | `az account show --query "state" -o tsv`                         | `Enabled`               |
| Spending limit              | `az account show --query "spendingLimit" -o tsv`                 | Not `On` for production |
| Subscription ID matches env | Compare `az account show --query "id"` with `azd env get-values` | Match                   |

> [!IMPORTANT]
> Always confirm the subscription before deploying. Deploying to the wrong subscription
> is the most common and costly mistake in demo environments.

---

## 4. Gate 3 — Template Validation

### Bicep Build (Syntax Check)

```powershell
# Build main template (transpiles to ARM JSON)
bicep build generated-scenarios/{project}/infra/main.bicep

# Build all bicep files in the directory
Get-ChildItem generated-scenarios/{project}/infra -Recurse -Filter "*.bicep" | ForEach-Object {
    Write-Host "Building: $($_.FullName)"
    bicep build $_.FullName
}
```

A successful `bicep build` produces no output. Any output indicates errors.

### Bicep Lint (Best Practice Check)

```powershell
# Lint the main template
bicep lint generated-scenarios/{project}/infra/main.bicep
```

Linting checks against `bicepconfig.json` rules. Common lint warnings:

| Rule                                  | Severity | Meaning                                                |
| ------------------------------------- | -------- | ------------------------------------------------------ |
| `no-unused-params`                    | Warning  | Parameter defined but not used                         |
| `no-unused-vars`                      | Warning  | Variable defined but not used                          |
| `secure-parameter-default`            | Error    | Secure param has a default value                       |
| `adminusername-should-not-be-literal` | Warning  | Admin username is hardcoded                            |
| `no-hardcoded-env-urls`               | Warning  | Uses `management.azure.com` instead of `environment()` |

### ARM Template Validation API

```powershell
# Validate against Azure Resource Manager (without deploying)
az deployment group validate `
  --resource-group {rg-name} `
  --template-file generated-scenarios/{project}/infra/main.bicep `
  --parameters generated-scenarios/{project}/infra/main.bicepparam
```

This calls the ARM validation endpoint which checks:

- Template schema validity
- Parameter type correctness
- Resource API version availability
- Cross-resource reference resolution

---

## 5. Gate 4 — Parameter Validation

### Check Required Parameters

```powershell
# Extract parameters from the Bicep file
bicep build generated-scenarios/{project}/infra/main.bicep --stdout | `
  ConvertFrom-Json | `
  Select-Object -ExpandProperty parameters | `
  ForEach-Object { $_.PSObject.Properties } | `
  Select-Object Name, @{N='Type';E={$_.Value.type}}, @{N='Default';E={$_.Value.defaultValue}} | `
  Format-Table
```

### Verify .bicepparam File

```powershell
# Ensure the parameter file exists
Test-Path generated-scenarios/{project}/infra/main.bicepparam

# Verify it references the correct template
Get-Content generated-scenarios/{project}/infra/main.bicepparam | Select-Object -First 1
# Expected: using 'main.bicep'
```

### Common Parameter Issues

| Issue                      | Symptom                             | Fix                                    |
| -------------------------- | ----------------------------------- | -------------------------------------- |
| Missing required parameter | `The parameter 'X' is required`     | Add to `.bicepparam` file              |
| Wrong type                 | `Expected type 'string', got 'int'` | Correct the value type                 |
| Invalid allowed value      | `Not in allowed values list`        | Check `@allowed()` decorator           |
| Secure param in plain text | Lint error                          | Use Key Vault reference or `@secure()` |

---

## 6. Gate 5 — Resource Provider Registration

### Check Required Providers

Every Azure service requires its resource provider to be registered in the subscription.

```powershell
# Check if a specific provider is registered
az provider show --namespace Microsoft.Web --query "registrationState" -o tsv

# Check multiple providers at once
$providers = @(
    "Microsoft.Web",
    "Microsoft.ServiceBus",
    "Microsoft.Storage",
    "Microsoft.KeyVault",
    "Microsoft.OperationalInsights",
    "Microsoft.Insights",
    "Microsoft.App",
    "Microsoft.ManagedIdentity",
    "Microsoft.Authorization"
)

foreach ($p in $providers) {
    $state = az provider show --namespace $p --query "registrationState" -o tsv 2>$null
    Write-Host "$p : $state"
}
```

### Register Missing Providers

```powershell
# Register a provider (takes 1-5 minutes)
az provider register --namespace Microsoft.Web --wait

# Batch register
$providers | ForEach-Object {
    Write-Host "Registering: $_"
    az provider register --namespace $_ --wait
}
```

### Common Resource Providers by Service

| Azure Service           | Resource Provider               |
| ----------------------- | ------------------------------- |
| App Service / Functions | `Microsoft.Web`                 |
| Service Bus             | `Microsoft.ServiceBus`          |
| Key Vault               | `Microsoft.KeyVault`            |
| Storage                 | `Microsoft.Storage`             |
| Log Analytics           | `Microsoft.OperationalInsights` |
| Application Insights    | `Microsoft.Insights`            |
| Container Apps          | `Microsoft.App`                 |
| Managed Identity        | `Microsoft.ManagedIdentity`     |
| Role Assignments        | `Microsoft.Authorization`       |
| Cosmos DB               | `Microsoft.DocumentDB`          |
| SQL Server              | `Microsoft.Sql`                 |
| Event Hubs              | `Microsoft.EventHub`            |
| API Management          | `Microsoft.ApiManagement`       |
| Cognitive Services      | `Microsoft.CognitiveServices`   |

---

## 7. Gate 6 — What-If Analysis

### Run What-If

```powershell
# Resource group scoped
az deployment group what-if `
  --resource-group {rg-name} `
  --template-file generated-scenarios/{project}/infra/main.bicep `
  --parameters generated-scenarios/{project}/infra/main.bicepparam

# Subscription scoped
az deployment sub what-if `
  --location eastus2 `
  --template-file generated-scenarios/{project}/infra/main.bicep `
  --parameters generated-scenarios/{project}/infra/main.bicepparam
```

### What-If Validation Criteria

| Check                             | Pass Criteria                                                         |
| --------------------------------- | --------------------------------------------------------------------- |
| No unexpected `Delete` operations | Zero resources being deleted (unless intentional)                     |
| Resource count matches plan       | Number of `Create` operations aligns with `04-implementation-plan.md` |
| No `Error` status resources       | All resources can be evaluated                                        |
| Region correctness                | Resources deploy to the expected region                               |

### Automated What-If Parsing

```powershell
# Save what-if output for analysis
$whatif = az deployment group what-if `
  --resource-group {rg-name} `
  --template-file generated-scenarios/{project}/infra/main.bicep `
  --parameters generated-scenarios/{project}/infra/main.bicepparam `
  --no-pretty-print 2>&1

# Check for destructive changes
if ($whatif -match "Delete") {
    Write-Warning "DESTRUCTIVE CHANGES DETECTED - Review before proceeding"
}
```

---

## 8. Post-Deployment Validation

### Resource Provisioning State

All resources must reach `Succeeded` state:

```powershell
# Check all resources in the group
$resources = az resource list `
  --resource-group {rg-name} `
  --query "[].{Name:name, Type:type, State:provisioningState}" -o json | ConvertFrom-Json

$failed = $resources | Where-Object { $_.State -ne "Succeeded" }
if ($failed) {
    Write-Error "Resources not in Succeeded state:"
    $failed | Format-Table
} else {
    Write-Host "All $($resources.Count) resources provisioned successfully."
}
```

### Deployment Output Capture

```powershell
# Get deployment outputs (endpoints, keys, connection strings)
az deployment group show `
  --resource-group {rg-name} `
  --name {deployment-name} `
  --query "properties.outputs" -o json
```

### Connectivity Validation

```powershell
# Test App Service endpoint
$url = az webapp show --name {app-name} --resource-group {rg-name} --query "defaultHostName" -o tsv
Invoke-WebRequest -Uri "https://$url" -Method Head -UseBasicParsing

# Test Function App endpoint
$url = az functionapp show --name {func-name} --resource-group {rg-name} --query "defaultHostName" -o tsv
Invoke-WebRequest -Uri "https://$url" -Method Head -UseBasicParsing
```

---

## 9. Validation Report Format

Generate a structured validation report for the deployment summary:

```markdown
## Validation Results

| Gate               | Status  | Details                         |
| ------------------ | ------- | ------------------------------- |
| Authentication     | ✅ PASS | user@contoso.com, Tenant: xxxx  |
| Subscription       | ✅ PASS | Visual Studio Enterprise (xxxx) |
| Template Build     | ✅ PASS | 0 errors, 0 warnings            |
| Template Lint      | ⚠️ WARN | 2 warnings (non-blocking)       |
| Parameters         | ✅ PASS | All required params provided    |
| Resource Providers | ✅ PASS | 7/7 registered                  |
| What-If            | ✅ PASS | 12 creates, 0 deletes           |
```

### Status Legend

| Status  | Meaning            | Blocks Deployment?                  |
| ------- | ------------------ | ----------------------------------- |
| ✅ PASS | Gate passed        | No                                  |
| ⚠️ WARN | Non-critical issue | No (but document in summary)        |
| ❌ FAIL | Critical issue     | **Yes** — must fix before deploying |

---

## 10. Common Validation Failures

> [!IMPORTANT]
> For every failure below, if auto-remediation does not resolve the issue,
> **prompt the user** with the error details and ask how to proceed.
> Never autonomously skip deployment or generate a "blocked" summary.

| Failure                           | Gate         | Auto-Fix Attempt                                                                  | If Auto-Fix Fails |
| --------------------------------- | ------------ | --------------------------------------------------------------------------------- | ----------------- |
| `az account show` returns nothing | Auth         | Prompt `az login`                                                                 | **Ask the user**  |
| Wrong subscription selected       | Subscription | Run `az account set --subscription {id}`                                          | **Ask the user**  |
| `bicep build` outputs errors      | Template     | Display errors for review                                                         | **Ask the user**  |
| Bicep CLI not installed           | Template     | Try `az bicep install`                                                            | **Ask the user**  |
| Azure CLI extension broken        | Auth         | Try removing broken extension                                                     | **Ask the user**  |
| Missing parameter value           | Parameters   | Add to `.bicepparam` or set azd env variable                                      | **Ask the user**  |
| Provider not registered           | Providers    | `az provider register --namespace {ns} --wait`                                    | **Ask the user**  |
| What-if shows unexpected deletes  | What-If      | Review template changes; may indicate renamed resources                           | **Ask the user**  |
| Resource stuck in `Creating`      | Post-Deploy  | Wait and retry; check Activity Log for errors                                     | **Ask the user**  |
| `Forbidden` on resource access    | Post-Deploy  | Verify RBAC; managed identity may need role assignment propagation (up to 10 min) | **Ask the user**  |
| Endpoint returns 404/503          | Connectivity | App may need time to start; check deployment logs                                 | **Ask the user**  |

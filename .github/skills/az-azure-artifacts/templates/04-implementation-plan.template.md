# 📀 Step 4: Implementation Plan - {project-name}

📑 Implementation Contents

- [📋 Overview](#-overview)
- [📦 Resource Inventory](#-resource-inventory)
- [🗂️ Module Structure](#-module-structure)
- [🔨 Implementation Tasks](#-implementation-tasks)
- [🚀 Deployment Phases](#-deployment-phases)
- [🔗 Dependency Graph](#-dependency-graph)
- [🔄 Runtime Flow Diagram](#-runtime-flow-diagram)
- [🏷️ Naming Conventions](#-naming-conventions)
- [🔒 Execution Handoff](#-execution-handoff)

## 📋 Overview

Brief description of what will be implemented.

---

## 📦 Resource Inventory

| Resource   | Type                            | SKU | AVM Status            | Dependencies | Status  |
| ---------- | ------------------------------- | --- | --------------------- | ------------ | ------- |
| Resource 1 | Microsoft.Provider/resourceType |     | ✅ AVM                |              | ⬜ Todo |
| Resource 2 | Microsoft.Provider/resourceType |     | ⚠️ Requires Review    |              | ⬜ Todo |
| Resource 3 | Microsoft.Provider/resourceType |     | ❌ No AVM (Justified) |              | ⬜ Todo |

---

## 🗂️ Module Structure

```text
generated-scenarios/{project-name}/infra/
├── main.bicep
├── main.bicepparam
├── modules/
    ├── module1.bicep
    ├── module2.bicep
    └── module3.bicep

```

| Module        | AVM Source                            | Version | Purpose   |
| ------------- | ------------------------------------- | ------- | --------- |
| module1.bicep | `br/public:avm/res/{provider}/{type}` | {x.x.x} | {purpose} |
| module2.bicep | `br/public:avm/res/{provider}/{type}` | {x.x.x} | {purpose} |
| module3.bicep | `br/public:avm/res/{provider}/{type}` | {x.x.x} | {purpose} |

---

## 🔨 Implementation Tasks

### Task 1: main.bicep (Orchestration)

**Purpose**: Main entry point

**Parameters**:

- List parameters

**Variables**:

- List variables (e.g., uniqueSuffix from uniqueString(resourceGroup().id))

**Modules Called**:

1. module1.bicep
2. module2.bicep

### Task 2: modules/module1.bicep

**Resources**:

- List resources

**Outputs**:

- List outputs

### Task 3: modules/module2.bicep

**Resources**:

- List resources

**Key Configuration**:

```bicep
Example configuration snippet
```

**Outputs**:

- List outputs

### Task N: azd deployment

**Features**:

- Parameter validation
- Bicep lint/build verification
- Deployment execution using AZD framework
- Output display

---

## 🔗 Dependency Graph

![Module Dependency Graph](./04-dependency-diagram.png)

Source: [04-dependency-diagram.py](./04-dependency-diagram.py)

> Map each node label to an Implementation Task heading in the task table below.

---

## 🔄 Runtime Flow Diagram

![Runtime Flow Diagram](./04-runtime-diagram.png)

Source: [04-runtime-diagram.py](./04-runtime-diagram.py)

> Keep this runtime view focused on request/auth/secret/event/telemetry paths only.

---

## 🏷️ Naming Conventions

| Resource       | Pattern                  | Example            | Generated Name |
| -------------- | ------------------------ | ------------------ | -------------- |
| Resource Group | rg-{project}-{env}       | rg-project-dev     | {actual name}  |
| Resource 1     | {prefix}-{project}-{env} | prefix-project-dev | {actual name}  |

---

## 🔒 Execution Handoff

> Continue directly to bicep-code after this artifact is generated.

---

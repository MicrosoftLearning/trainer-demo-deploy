# 🏛️ Step 2: Architecture Assessment - {project-name}

📑 Assessment Contents

- [✅ Requirements Validation](#-requirements-validation)
- [💎 Executive Summary](#-executive-summary)
- [📦 Resource SKU Recommendations](#-resource-sku-recommendations)
- [🎯 Architecture Decision Summary](#-architecture-decision-summary)
- [🚀 Implementation Handoff](#-implementation-handoff)
- [🔒 Execution Handoff](#-execution-handoff)
- [References](#references)

---

### Recommended Architecture

```mermaid
flowchart TB
    User["\U0001F464 Users"] --> FD["\U0001F6E1\uFE0F Front Door / CDN"]
    FD --> App["\U0001F4BB App Service"]
    App --> DB[("\U0001F5C4\uFE0F Database")]
    App --> KV["\U0001F511 Key Vault"]
    App --> Storage["\U0001F4E6 Storage"]
    App --> Monitor["\U0001F4CA Monitor"]

    subgraph Security
        KV
        NSG["\U0001F6E1\uFE0F NSG"]
    end

    subgraph Data
        DB
        Storage
    end
```

> Replace the above with actual architecture for the project.

---

## 📦 Resource SKU Recommendations

| Service   | Recommended SKU | Configuration |
| --------- | --------------- | ------------- |
| {service} | {sku}           | {config}      |

---

## 🎯 Architecture Decision Summary

| Decision   | Choice | Rationale |
| ---------- | ------ | --------- |
| Decision 1 |        |           |
| Decision 2 |        |           |

---

## 🚀 Implementation Handoff

### Ready for bicep-plan

The architecture is ready for implementation with the following key parameters:

| Parameter      | Value    |
| -------------- | -------- |
| Region         | {region} |
| Environment    | {env}    |
| Resource Count | {count}  |

### Resources to Provision

| #   | Resource   | SKU   | Key Config |
| --- | ---------- | ----- | ---------- |
| 1   | {resource} | {sku} | {config}   |
| 2   | {resource} | {sku} | {config}   |

---

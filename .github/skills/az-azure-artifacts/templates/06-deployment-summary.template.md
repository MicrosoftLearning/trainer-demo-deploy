# 🚀 Step 5: Deployment Summary - {project-name}

📑 Deployment Summary Contents

- [📋 Deployment Details](#-deployment-details)
- [🏗️ Deployed Resources](#-deployed-resources)
- [📤 Outputs (Expected)](#-outputs-expected)

## 📋 Deployment Details

| Property              | Value                                                   |
| --------------------- | ------------------------------------------------------- |
| **Deployment Name**   | `{deployment-name}`                                     |
| **Timestamp**         | `{YYYY-MM-DD HH:MM:SS UTC}`                             |
| **Duration**          | `{Xm Ys}`                                               |
| **Subscription**      | `{subscription-name} ({subscription-id})`               |
| **Resource Group**    | `{rg-name}`                                             |
| **Region**            | `{location}`                                            |
| **Environment**       | `{environment}`                                         |
| **Deployment Method** | `azd up`                                                |
| **Status**            | ✅ Succeeded / ⚠️ Partial / ❌ Failed / 🔍 Dry Run Only |

### What-If Summary

| Change Type | Count   |
| ----------- | ------- |
| Create      | {count} |
| Modify      | {count} |
| Delete      | {count} |
| No Change   | {count} |

## 🏗️ Deployed Resources

| Resource Name     | Type              | SKU/Tier | Provisioning State |
| ----------------- | ----------------- | -------- | ------------------ |
| `{resource-name}` | `{resource-type}` | `{sku}`  | ✅ Succeeded       |

### Resource Health Checks

| Resource          | Check              | Status  |
| ----------------- | ------------------ | ------- |
| `{resource-name}` | Provisioning state | ✅ PASS |
| `{resource-name}` | Endpoint reachable | ✅ PASS |

## 📤 Outputs (Expected)

| Output Name     | Value            | Description     |
| --------------- | ---------------- | --------------- |
| `{output-name}` | `{output-value}` | `{description}` |

### Cleanup Instructions

```bash
# Remove all deployed resources
azd down --force --purge
```

> [!TIP]
> Use `azd down --force --purge` to tear down all deployed resources when the demo is complete.

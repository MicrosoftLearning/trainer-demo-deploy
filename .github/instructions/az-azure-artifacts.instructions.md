---
applyTo: "**/generated-scenarios/**/*.md"
description: "MANDATORY template compliance rules for artifact generation"
---

# Artifact Generation Rules - MANDATORY

> **CRITICAL**: This file is the ENFORCEMENT TRIGGER for artifact H2 headings.
> All agents MUST use these EXACT headings when generating artifacts.
> Violations block commits (pre-commit) and PRs (CI validation).

> [!NOTE]
> This instruction file and the `azure-artifacts` skill (`SKILL.md`) intentionally
> contain the same H2 heading lists. The `SKILL.md` is the authoritative source;
> this instruction file is the enforcement trigger via `applyTo` scope.
> For template mapping, generation workflow, styling, and standard components,
> read the SKILL.md directly.

## Complete H2 Heading Reference

> **IMPORTANT**: Copy-paste these headings. Do not paraphrase or abbreviate.

### 01-requirements.md

```text
## 🎯 Project Overview
## 🚀 Functional Requirements
## ⚡ Non-Functional Requirements (NFRs)
## 📋 Summary for Architecture Assessment
```

### 02-architecture-assessment.md

```text
## ✅ Requirements Validation
## 📦 Resource SKU Recommendations
## 🎯 Architecture Decision Summary
```

### 05-implementation-reference.md

```text
## 📁 IaC Templates Location
## 🗂️ File Structure
## ✅ Validation Status
## 🏗️ Resources Created
## 🚀 Deployment Instructions
## 📝 Key Implementation Notes
```

### 06-deployment-summary.md

```text
## 📋 Deployment Details
## 🏗️ Deployed Resources
## 📤 Outputs (Expected)
```

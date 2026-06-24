# 📋 Step 1: Requirements - {project-name}

📑 Requirements Overview

- [🎯 Project Overview](#-project-overview)
- [🚀 Functional Requirements](#-functional-requirements)
- [🔧 Operational Requirements](#-operational-requirements)
- [📋 Summary for Architecture Assessment](#-summary-for-architecture-assessment)
- [References](#references)

## 🎯 Project Overview

| Field                   | Value          |
| ----------------------- | -------------- |
| **Project Name**        | {project-name} |
| **Primary Stakeholder** | {name / role}  |

## 🚀 Functional Requirements

### Core Capabilities

| #   | Capability   | Priority                       | Acceptance Criteria    |
| --- | ------------ | ------------------------------ | ---------------------- |
| 1   | {capability} | 🔴 Must / 🟡 Should / 🟢 Could | {measurable criterion} |
| 2   | {capability} | 🔴 Must / 🟡 Should / 🟢 Could | {measurable criterion} |

### Network Security

| Control                     | Required | Notes     |
| --------------------------- | -------- | --------- |
| Private endpoints           | ✅ / ❌  | {details} |
| VNet integration            | ✅ / ❌  | {details} |
| Public endpoints acceptable | ✅ / ❌  | {details} |
| WAF required                | ✅ / ❌  | {details} |

### Recommended Security Controls

Table of recommended controls based on workload pattern and compliance requirements:

| Control               | Recommended | User Confirmed | Notes                   |
| --------------------- | ----------- | -------------- | ----------------------- |
| Managed Identity      | {yes/no}    | {yes/no}       | {Prefer over keys}      |
| Private Endpoints     | {yes/no}    | {yes/no}       | {For data services}     |
| WAF                   | {yes/no}    | {yes/no}       | {For public endpoints}  |
| Key Vault for Secrets | {yes/no}    | {yes/no}       | {Centralized secrets}   |
| Diagnostic Settings   | {yes/no}    | {yes/no}       | {Audit logging}         |
| TLS 1.2 Minimum       | {yes/no}    | {yes/no}       | {Always recommended}    |
| Encryption at Rest    | {yes/no}    | {yes/no}       | {Platform default}      |
| Network Isolation     | {yes/no}    | {yes/no}       | {VNet/NSG/Private Link} |

## 📋 Summary for Architecture Assessment

### Handoff Summary

| Aspect               | Key Points                                                    |
| -------------------- | ------------------------------------------------------------- |
| Critical Constraints | {top 3 constraints driving architecture}                      |
| Key Decisions        | {decisions made during requirements that affect architecture} |
| Open Risks           | {unresolved items that architect must address}                |
| Recommended Pattern  | {workload pattern from Functional Requirements}               |

### Requirements Completeness

| Section                  | Status       | Notes   |
| ------------------------ | ------------ | ------- |
| Project Overview         | ✅ / ⚠️ / ❌ | {notes} |
| Functional Requirements  | ✅ / ⚠️ / ❌ | {notes} |
| Operational Requirements | ✅ / ⚠️ / ❌ | {notes} |

---

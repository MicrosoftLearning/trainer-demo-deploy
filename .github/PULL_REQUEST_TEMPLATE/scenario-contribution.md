---
name: Scenario Contribution
about: Submit a new demo scenario to the project
labels: new-scenario
---

## Scenario Overview

<!-- Provide a brief description of the demo scenario and its target audience -->

**Project folder**: `generated-scenarios/{project-name}/`
**Industry**: <!-- e.g., Healthcare, Retail, Finance, Education -->

## Architecture

<!-- List the Azure services used in this scenario -->

| Service | SKU | Purpose |
| ------- | --- | ------- |
|         |     |         |

## Artifact Checklist (included in PR)

### Required

- [ ] `infra/main.bicep` + modules — Bicep templates
- [ ] `azure.yaml` — Azure Developer CLI project definition (name: `tdd-azd-{project}`)
- [ ] `README.md` — Quick-start guide for scenario users
- [ ] `demoguide/demoguide.md` — Demo runbook with talking points
- [ ] `demoguide/images/*.png` — Screenshots of deployed resources
- [ ] `infra/main.bicepparam` — Bicep parameter file

> **Note:** Other scenario artifacts (requirements, architecture assessment, diagrams, implementation plans, src/) remain in the contributor's fork for reference and are not included in the PR.

## Deployment Status

<!-- Choose one -->

- [ ] **Verified** — Successfully deployed and validated via `azd up`
- [ ] **Not deployed** — Templates are ready but not tested in a live subscription

## Sensitive Data Confirmation

- [ ] No `.azure/` deployment state files included
- [ ] No `.env` or secret files included
- [ ] No `bin/`, `obj/`, or `publish/` build outputs included
- [ ] No `applogs/` or `*.zip` archives included

## Reviewer Guidance

1. Verify Bicep templates lint cleanly: `az bicep build -f generated-scenarios/{project}/infra/main.bicep`
2. Check `azure.yaml` follows the naming convention: `name: tdd-azd-{project}`
3. Run `azd up` in a test subscription to validate end-to-end deployment
4. Review the demo guide for completeness and accuracy
5. Confirm no sensitive data or deployment state is included

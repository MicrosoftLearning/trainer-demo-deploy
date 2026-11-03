# Project README Template

> **Template for project-level README files in `generated-scenarios/{project}/`**

---

## Template Instructions

When generating a project README, agents MUST:

1. Replace all `{placeholder}` values with actual project data
2. Include ALL H2 sections in the following order:

- (H2) Installation:
- (H2) Deploying the scenario in 4 steps:
- What the demo scenario is about
- Feedback and Contributing

Include architecture preview if diagram exists, in the "what the demo scenario is about" section

---

## Required Structure

<!-- markdownlint-disable MD033 MD041 -->

<div>
# 🏗️ {project-name}

**{project-description in max 5 lines}**

\*\*{include the following section}:
💪 This template scenario is part of the larger [Microsoft Trainer Demo Deploy Catalog](https://aka.ms/trainer-demo-deploy).

</div>

---

## ⬇️ Installation

[Azure Developer CLI - AZD](https://learn.microsoft.com/en-us/azure/developer/azure-developer-cli/install-azd)
When installing AZD, the above the following tools will be installed on your machine as well, if not already installed:

- [GitHub CLI](https://cli.github.com/)
- [Bicep CLI](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)
  You need Owner or Contributor access permissions to an Azure Subscription to deploy the scenario.

## 🚀 Deploying the scenario in 4 steps:

1. Create a new folder on your machine.

```shell
mkdir <your repo link> e.g. petender/azd-hubspoke
```

1. Next, navigate to the new folder.

```shell
cd <your repo link> e.g. petender/azd-hubspoke
```

1. Next, run azd init to initialize the deployment.

```shell
azd init -t <your repo link> e.g. petender/azd-hubspoke
```

1. Last, run azd up to trigger an actual deployment.

```shell
azd up
```

⏩ Note: you can delete the deployed scenario from the Azure Portal, or by running azd down from within the initiated folder.

## What is the demo scenario about?

**{project-description in max 10 lines}**

## 📋 Project Summary

| Property         | Value          |
| ---------------- | -------------- |
| **Created**      | {created-date} |
| **Last Updated** | {updated-date} |
| **Region**       | {azure-region} |

---

## 🏛️ Architecture

<!-- Include diagram preview if available -->
<!-- If diagram exists, include the following block -->
<div align="center">

![Architecture Diagram](./{diagram-filename})

_Generated with [az-azure-diagrams](../../.github/skills/az-consolidated/SKILL.md) skill_

</div>
<!-- End diagram block -->

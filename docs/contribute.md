---
sidebar_position: 1
title: "Contributor Guide"
---

## We ♥️ Contributions!

The `trainer-demo-deploy` catalog is built by trainers, for trainers. Your demo scenarios help the entire Microsoft training community deliver better technical instruction.

**Have a great demo scenario?** We'd love to see it in the catalog! Contributing is easier than you think.

---

## Quick Start: Contribute in 4 Steps

### 1. 🚀 Create Your Template

Start with our starter template—it has everything you need:

```bash
azd init -t petender/tdd-azd-starter
```

You'll get:
- Complete file structure with helpful placeholders
- Example Bicep infrastructure patterns
- README and demo guide templates
- GitHub Copilot instruction files for guidance

**Customize for your scenario:**
- Update `azure.yaml` with your template name
- Add your Azure resources to `infra/main.bicep` and `infra/resources.bicep`
- Fill in the README, prerequisites, and demo guide

The starter includes detailed guidance in `CONTRIBUTING.md` and `.github/instructions/`.

### 2. ✅ Test Your Template

Deploy it a few times to make sure everything works:

```bash
azd up
```

Confirm that:
- Deployment completes successfully 
- Resources are tagged correctly
- Your demo steps work as documented
- Cost is reasonable for training scenarios 
- Cleanup works: `azd down`

### 3. 📤 Publish to GitHub

Create a **public** GitHub repository and push your template. The repository name should match your template name in `azure.yaml` (e.g., `tdd-my-scenario`).

See the publishing instructions in the starter's `CONTRIBUTING.md` for the exact git commands.

### 4. 🎯 Submit to the Catalog

Ready to share with the community? You'll need to:

**Fork and update the catalog repo:**
1. Fork [trainer-demo-deploy](https://github.com/MicrosoftLearning/trainer-demo-deploy)
2. Add your template entry to `/static/templates.json`:

```json
{
  "title": "Your Template Title",
  "description": "Brief description of what gets deployed and why",
  "image": "images/your-architecture.png",
  "author": "Your Name",
  "authorLink": "https://github.com/yourusername",
  "repo": "https://github.com/yourusername/tdd-your-scenario",
  "tags": ["AZ-104", "storage", "networking"],
  "demoGuide": "https://github.com/yourusername/tdd-your-scenario/blob/main/demoguide/demoguide.md",
  "deployTime": "15 minutes",
  "cost": "$8-12/day"
}
```

**Add your architecture diagram:**
- Add a PNG image to `/static/templates/images/` showing your Azure resources
- Example: [AIFoundrywithSora.png](https://raw.githubusercontent.com/MicrosoftLearning/trainer-demo-deploy/refs/heads/main/static/templates/images/AIFoundrywithSora.png)

**Open a pull request:**
- Include a link to your template repo in the PR description
- We'll review and provide feedback

**Tags:** Use at least one [course tag](https://github.com/MicrosoftLearning/trainer-demo-deploy/blob/main/src/data/tags.tsx) (e.g., AZ-104) and one or more Azure service tags (e.g., storage, networking). Missing a tag you need? Feel free to add it!

---

## Already Have an Azure Template?

If you have an existing Bicep template or ARM template, you can adapt it! The key steps are:
1. Add an `azure.yaml` file with your template metadata
2. Organize your infrastructure files in an `infra/` folder
3. Add a README and demo guide following our format

The [starter template](https://github.com/petender/tdd-azd-starter) shows the expected structure.
---

## Other Ways to Contribute

Not ready to create a template? You can still help:

- 🤔 [**Request a template**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=petender&labels=requested-contribution&template=%F0%9F%A4%94-submit-a-template-request.md&title=%5BIdea%5D+%3Cyour-template-name%3E) - Suggest scenarios you'd like to see
- 🐛 [**Report bugs**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=&labels=&template=bug_report.md&title=) - Help us fix issues
- ✨ [**Request features**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=&labels=&template=feature_request.md&title=) - Suggest catalog improvements
- 💬 [**Share feedback**](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues/new?assignees=petender&labels=feedback&projects=&template=feedback_template.md&title=%5BFeedback%5D) - Let us know how we're doing

We also welcome contributions to improve [requested templates](https://github.com/MicrosoftLearning/trainer-demo-deploy/issues?q=is%3Aopen+is%3Aissue+label%3Arequested-contribution) from the community.

---

## Resources

- 📚 [Starter Template](https://github.com/petender/tdd-azd-starter) - Everything you need to get started
- 🤝 [Contribution FAQ](https://microsoftlearning.github.io/trainer-demo-deploy/docs/faq/contribute-template) - Common questions
- 🔍 [Browse Templates](https://aka.ms/trainer-demo-deploy) - Get inspired by existing templates
- 💡 [General FAQ](./1-faq/1-what-is-azd.md) - Learn about azd templates

---

**Questions?** Open a [discussion](https://github.com/MicrosoftLearning/trainer-demo-deploy/discussions) or check the FAQ. We're here to help!

**Thank you for contributing to the training community!** 🎉

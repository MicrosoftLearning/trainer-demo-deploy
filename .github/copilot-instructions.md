# Azure Demo Builder - Copilot Instructions

> VS Code Copilot-specific orchestration instructions.
> For general project conventions, build commands, and code style, see the root `AGENTS.md`.

## Quick Start

1. Enable subagents: `"github.copilot.chat": { "customAgentInSubagent": { "enabled": true } }`
2. Open Chat (`Ctrl+Shift+I`) → Select **conductor** → Describe your project
3. The Conductor guides you through all 7 steps with automatic handoffs

## Workflow

| Step | Agent        | Output                                                    | Progression |
| ---- | ------------ | --------------------------------------------------------- | ----------- |
| 1    | Requirements | `01-requirements.md`                                      | Automatic   |
| 2    | Architect    | `02-architecture-assessment.md`                           | Automatic   |
| 3    | Diagrammer   | `03-architect-*.{py,png,md}`                              | Automatic   |
| 4    | Bicep        | `04-implementation-plan.md` + `generated-scenarios/{project}/infra/` | Automatic   |
| 4b   | Development  | `07-webapp-summary.md` + `generated-scenarios/{project}/src/`        | Conditional |
| 5    | Deploy       | `06-deployment-summary.md`                                | Automatic   |
| 6    | DemoGuide    | `/demoguide/demoguide.md` + `/demoguide/*.png`            | Automatic   |
| 7    | Contribute   | Standalone repo + `scenarios/registry.json` PR    | User-invoked |

All outputs → `generated-scenarios/{project}/`. Context flows via artifact files + handoffs.

## Skills (Auto-Invoked by Agents)

| Skill                         | Purpose                                                               |
| ----------------------------- | --------------------------------------------------------------------- |
| **`SKILL.md`** (consolidated) | Defaults, AVM, Bicep patterns, diagrams, artifacts, demo guide        |
| `webapp-development`          | .NET 10 sample webapp scaffolding, industry seed data, azd wiring     |
| `azure-adr`                   | Architecture Decision Records                                         |
| `github-operations`           | GitHub issues, PRs, CLI, Actions, releases                            |
| `git-commit`                  | Commit message conventions                                            |
| `microsoft-docs`              | Query official Microsoft/Azure docs (requires Learn MCP)              |
| `microsoft-code-reference`    | Verify SDK methods and find working code samples (requires Learn MCP) |
| `golden-principles`           | Core operating principles for agent behavior                          |

Agents read the consolidated skill via: **"Read `.github/skills/az-consolidated/SKILL.md`"** in their body.

## Chat Triggers

- If a user message starts with `gh`, treat it as a GitHub operation.
  Examples: `gh pr create ...`, `gh workflow run ...`, `gh api ...`.
- Automatically follow the `github-operations` skill guidance (MCP-first, `gh` CLI fallback) from `.github/skills/github-operations/SKILL.md`.

### GitHub MCP Priority (Mandatory)

- For issues and pull requests, always prefer GitHub MCP tools over `gh` CLI.
- Only use `gh` for operations that have no equivalent MCP write tool in the current environment.
- In devcontainers, do not run `gh auth` commands unless the user explicitly asks for CLI authentication troubleshooting.

## Key Conventions

See the root `AGENTS.md` for full conventions. Summary of VS Code-specific overrides:

- **AVM-first**: Always prefer Azure Verified Modules over raw Bicep

Full details in `.github/skills/az-consolidated/SKILL.md`.

## Key Files

| Path                              | Purpose                                      |
| --------------------------------- | -------------------------------------------- |
| `AGENTS.md`                       | Cross-agent project conventions and commands |
| `.github/agents/*.agent.md`       | Agent definitions                            |
| `.github/skills/*/SKILL.md`       | Reusable skill knowledge                     |
| `.github/instructions/`           | File-type rules (Bicep, Markdown, etc.)      |
| `generated-scenarios/{project}/`             | Agent-generated artifacts                    |
| `generated-scenarios/{project}/infra/`       | Bicep templates                              |
| `generated-scenarios/{project}/src/`         | Sample webapp source (when generated)        |
| `.vscode/mcp.json`                | MCP server configuration                     |
| `.vscode/infraops.toolsets.jsonc` | Workspace tool groups for interactive chat   |

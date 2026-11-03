# Local MCP Server for trainer-demo-deploy

## Overview

This folder contains a local Python-based MCP (Model Context Protocol) server for the `trainer-demo-deploy` repository.

The server allows MCP-compatible clients, such as VS Code Agent Mode, GitHub Copilot MCP, Claude Desktop, Continue.dev, or other MCP-enabled tools, to interact with the local catalog using natural language.

It supports:

* Browsing catalog templates
* Searching the catalog
* Viewing template details
* Getting deployment guidance
* Reading demo guide information
* Checking prerequisites
* Validating catalog metadata

---

## Project Structure

```text
local-mcp-server/
├── server.py
├── requirements.txt
├── tools/
│   ├── __init__.py
│   ├── templates.py
│   ├── catalog.py
│   └── demo.py
```

---

## Setup

From the repository root:

```bash
cd local-mcp-server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

---

## Run Manually

```bash
python3 server.py
```

The server uses MCP stdio transport and waits silently for an MCP client connection.

---

## Available Tools

### Template Validation

* `validate_templates_json()`
  Validates all templates in `static/templates.json` for required metadata fields.

* `review_template(template_name)`
  Reviews a single template and reports missing metadata fields.

### Catalog Interaction

* `list_catalog_templates(limit=20)`
  Lists catalog template titles.

* `search_catalog(query)`
  Searches templates by title or description.

* `get_template_details(template_name)`
  Returns full metadata for one template.

* `get_deployment_guidance(template_name)`
  Returns source, demo guide, deploy time, and prerequisites.

### Demo Guidance

* `get_demo_guide(template_name)`
  Returns demo-guide-related information for a template.

* `get_prerequisites(template_name)`
  Returns prerequisites and estimated deploy time.

* `recommend_templates(use_case, limit=5)`
  Recommends catalog templates based on a use-case keyword.

---

## Example Natural-Language Queries

An MCP-compatible VS Code agent can use these tools for requests like:

* List catalog templates
* Search the catalog for AI templates
* Show deployment guidance for Azure Routing Demo
* What are the prerequisites for Azure AI Foundry Healthcare Agents?
* Recommend templates related to networking
* Review metadata for a specific template
* Show demo guide information for a catalog item

---

## VS Code MCP Configuration

Create or update:

```text
.vscode/mcp.json
```

Portable example:

```json
{
  "servers": {
    "trainer-demo-local": {
      "command": "${workspaceFolder}/local-mcp-server/.venv/bin/python",
      "args": [
        "${workspaceFolder}/local-mcp-server/server.py"
      ]
    }
  }
}
```

If your MCP client does not resolve `${workspaceFolder}`, use absolute paths instead.

Example for a Codespaces workspace:

```json
{
  "servers": {
    "trainer-demo-local": {
      "command": "/workspaces/trainer-demo-deploy/local-mcp-server/.venv/bin/python",
      "args": [
        "/workspaces/trainer-demo-deploy/local-mcp-server/server.py"
      ]
    }
  }
}
```

---

## VS Code Verification

After adding the MCP configuration:

1. Reload VS Code.
2. Open the Command Palette.
3. Run `MCP: List Servers`.
4. Select `trainer-demo-local`.
5. Start or restart the server if needed.
6. Confirm the MCP output shows the server running.

Verified output:

```text
Connection state: Running
Processing request of type ListToolsRequest
Discovered 9 tools
```

This confirms:

* The local MCP server starts successfully.
* VS Code connects to the server.
* The MCP handshake completes.
* All registered tools are discovered.

---

## Notes

The server currently exposes tools only. It does not yet expose MCP resources or prompts.

Full natural-language invocation depends on an MCP-compatible agent/client being available and enabled in the user's VS Code environment.

---

## Future Improvements

Potential improvements include:

* Reading demo guide markdown files directly
* Adding MCP resources for catalog entries
* Adding MCP prompts for common catalog workflows
* Adding semantic template recommendations
* Surfacing deployment steps from linked demo guides
* Integrating more closely with existing `.github/agents` workflows

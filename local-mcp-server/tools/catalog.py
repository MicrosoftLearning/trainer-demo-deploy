from tools.templates import load_templates


def register_catalog_tools(mcp):

    @mcp.tool()
    def list_catalog_templates(limit: int = 20) -> str:
        """List template titles from the catalog."""

        data = load_templates()
        titles = [template.get("title", "Untitled template") for template in data]

        return "\n".join(titles[:limit])

    @mcp.tool()
    def search_catalog(query: str) -> str:
        """Search catalog templates by title or description."""

        data = load_templates()
        matches = []

        for template in data:
            title = template.get("title", "")
            description = template.get("description", "")

            if query.lower() in title.lower() or query.lower() in description.lower():
                matches.append(f"{title}\n{description}")

        if not matches:
            return f"No catalog templates found for query: {query}"

        return "\n\n".join(matches)

    @mcp.tool()
    def get_template_details(template_name: str) -> str:
        """Get catalog details for one template."""

        data = load_templates()

        for template in data:
            title = str(template.get("title", "")).strip()

            if title.casefold() == template_name.strip().casefold():
                return (
                    f"Title: {template.get('title', '')}\n"
                    f"Description: {template.get('description', '')}\n"
                    f"Website: {template.get('website', '')}\n"
                    f"Source: {template.get('source', '')}\n"
                    f"Demo guide: {template.get('demoguide', '')}\n"
                    f"Deploy time: {template.get('deploytime', '')}\n"
                    f"Prerequisites: {template.get('prereqs', '')}"
                )

        return f"No template found with title: {template_name}"

    @mcp.tool()
    def get_deployment_guidance(template_name: str) -> str:
        """Return deployment guidance fields for one catalog template."""

        data = load_templates()

        for template in data:
            title = str(template.get("title", "")).strip()

            if title.casefold() == template_name.strip().casefold():
                return (
                    f"Deployment guidance for: {title}\n"
                    f"Demo guide: {template.get('demoguide', '')}\n"
                    f"Source repository: {template.get('source', '')}\n"
                    f"Estimated deploy time: {template.get('deploytime', '')}\n"
                    f"Prerequisites: {template.get('prereqs', '')}"
                )

        return f"No template found with title: {template_name}"
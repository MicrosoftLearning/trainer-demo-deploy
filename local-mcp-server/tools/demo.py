from tools.templates import load_templates


def find_template_by_name(template_name: str):
    data = load_templates()

    for template in data:
        title = str(template.get("title", "")).strip()

        if title.casefold() == template_name.strip().casefold():
            return template

    return None


def register_demo_tools(mcp):

    @mcp.tool()
    def get_demo_guide(template_name: str) -> str:
        """Return demo guide information for a catalog template."""

        template = find_template_by_name(template_name)

        if template is None:
            return f"No template found with title: {template_name}"

        return (
            f"Demo guide for: {template.get('title', '')}\n"
            f"Description: {template.get('description', '')}\n"
            f"Demo guide: {template.get('demoguide', '')}\n"
            f"Deploy time: {template.get('deploytime', '')}\n"
            f"Prerequisites: {template.get('prereqs', '')}"
        )

    @mcp.tool()
    def get_prerequisites(template_name: str) -> str:
        """Return prerequisites and deploy time for a catalog template."""

        template = find_template_by_name(template_name)

        if template is None:
            return f"No template found with title: {template_name}"

        return (
            f"Prerequisites for: {template.get('title', '')}\n"
            f"Deploy time: {template.get('deploytime', '')}\n"
            f"Prerequisites: {template.get('prereqs', '')}"
        )

    @mcp.tool()
    def recommend_templates(use_case: str, limit: int = 5) -> str:
        """Recommend catalog templates based on a use case keyword."""

        data = load_templates()
        matches = []

        for template in data:
            title = template.get("title", "")
            description = template.get("description", "")

            searchable_text = f"{title} {description}".lower()

            if use_case.lower() in searchable_text:
                matches.append(
                    f"{title}\n"
                    f"Description: {description}\n"
                    f"Deploy time: {template.get('deploytime', '')}\n"
                    f"Demo guide: {template.get('demoguide', '')}"
                )

        if not matches:
            return f"No templates found for use case: {use_case}"

        return "\n\n".join(matches[:limit])
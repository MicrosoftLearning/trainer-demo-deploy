import json
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
TEMPLATES_PATH = REPO_ROOT / "static" / "templates.json"

REQUIRED_FIELDS = [
    "title",
    "description",
    "preview",
    "website",
    "source",
    "demoguide",
    "deploytime",
    "prereqs",
]


def load_templates():
    if not TEMPLATES_PATH.exists():
        raise FileNotFoundError(
            f"templates.json not found at: {TEMPLATES_PATH}"
        )

    with open(TEMPLATES_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def register_template_tools(mcp):

    @mcp.tool()
    def validate_templates_json() -> str:
        """Validate all templates."""

        try:
            data = load_templates()
        except FileNotFoundError as error:
            return str(error)

        issues = []

        for index, template in enumerate(data):
            title = template.get("title", f"Template #{index + 1}")

            for field in REQUIRED_FIELDS:
                if field not in template or template[field] in ["", None, []]:
                    issues.append(
                        f"{title}: missing or empty '{field}'"
                    )

        if not issues:
            return "All templates have required metadata fields."

        return "Metadata issues found:\n" + "\n".join(issues)

    @mcp.tool()
    def review_template(template_name: str) -> str:
        """Review one template."""

        try:
            data = load_templates()
        except FileNotFoundError as error:
            return str(error)

        matched_template = None

        for template in data:
            title = str(template.get("title", "")).strip()

            if title.casefold() == template_name.strip().casefold():
                matched_template = template
                break

        if matched_template is None:
            return f"No template found with title: {template_name}"

        issues = []

        for field in REQUIRED_FIELDS:
            if (
                field not in matched_template
                or matched_template[field] in ["", None, []]
            ):
                issues.append(
                    f"Missing or empty field: {field}"
                )

        if not issues:
            return (
                f"Template '{matched_template.get('title')}' "
                f"has all required metadata fields."
            )

        return (
            f"Review for template: "
            f"{matched_template.get('title')}\n"
            + "Issues found:\n"
            + "\n".join(issues)
        )
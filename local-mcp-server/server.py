from mcp.server.fastmcp import FastMCP
from tools.templates import register_template_tools
from tools.catalog import register_catalog_tools
from tools.demo import register_demo_tools

mcp = FastMCP("trainer-demo-local-mcp")

register_template_tools(mcp)
register_catalog_tools(mcp)
register_demo_tools(mcp)

if __name__ == "__main__":
    mcp.run()
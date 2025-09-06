import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { searchFiles } from "../tools/baloosearch-tool.js"

const server = new McpServer({
  name: "Baloosearch MCP Server",
  version: "1.0.0",
})

// Tool to search for terms in files using baloosearch
server.tool(
  "search_files",
  "Search for terms in files using KDE baloosearch",
  {
    query: z.string().describe("The search query terms"),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
    offset: z.number().optional().describe("Offset from which to start the search (default: 0)"),
    directory: z.string().optional().describe("Limit search to specified directory"),
    type: z.string().optional().describe("Type of data to be searched")
  },
  async ({ query, limit, offset, directory, type }) => {
    try {
      const results = await searchFiles({ query, limit, offset, directory, type })
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching files: ${error.message}` }]
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
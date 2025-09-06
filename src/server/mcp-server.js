import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { searchFiles, showFileWords } from "../tools/baloosearch-tool.js"

const server = new McpServer({
  name: "Baloosearch MCP Server",
  version: "1.0.0",
})

// Tool to search for terms in files using baloosearch
server.tool(
  "search_files",
  `Search for terms in files using KDE baloosearch.
  
Query Syntax Examples:
- Simple search: "project plan"
- Multiple terms: "budget AND marketing" (finds files with both terms)
- OR search: "report OR presentation" (finds files with either term)
- Phrase search: "\\"strategic plan\\"" (finds exact phrase)
- Exclusion: "financial -tax" (finds files with "financial" but not "tax")
- Wildcard: "report*" (finds files with words starting with "report")`,
  {
    query: z.string().describe(`The search query terms. Supports advanced search syntax:
- AND: Requires both terms (e.g., "budget AND marketing")
- OR: Requires either term (e.g., "report OR presentation")
- NOT or -: Excludes terms (e.g., "financial -tax" or "financial NOT tax")
- Phrase search: Use quotes for exact phrases (e.g., "\\"project plan\\"")
- Wildcards: Use * for partial matching (e.g., "report*")
- Grouping: Use parentheses to group terms (e.g., "(budget OR finance) AND 2024")`),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
    offset: z.number().optional().describe("Offset from which to start the search (default: 0)"),
    directory: z.string().optional().describe("Limit search to specified directory (absolute path)"),
    type: z.string().optional().describe(`Type of data to be searched. Common types include:
- "Document" (text documents, PDFs, etc.)
- "Audio" (audio files)
- "Image" (image files)
- "Video" (video files)
- "Folder" (directories)
- "Unknown" (files with unknown type)`)
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

// Tool to show indexed words in a file using balooshow
server.tool(
  "show_file_words",
  `Show indexed content & meta-data in a file using KDE balooshow.
  
This tool retrieves all the indexed words & meta-data from a specific file that has been indexed by KDE's Baloo search system.`,
  {
    path: z.string().describe("The absolute path to the file to show indexed words & meta-data for")
  },
  async ({ path }) => {
    try {
      const results = await showFileWords({ path })
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error showing file words: ${error.message}` }]
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)

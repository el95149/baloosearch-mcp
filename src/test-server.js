import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"

console.log("Creating MCP server...")

const server = new McpServer({
  name: "Baloosearch MCP Server",
  version: "1.0.0",
})

console.log("Server created successfully")

// Simple test tool
server.tool(
  "test_tool",
  "A simple test tool",
  {},
  async () => ({
    content: [{ type: "text", text: "Test tool executed successfully" }]
  })
)

console.log("Tool registered")

const transport = new StdioServerTransport()
console.log("Transport created")

// Add some logging to see what happens
transport.onmessage = (message) => {
  console.log("Received message:", message)
}

transport.onerror = (error) => {
  console.error("Transport error:", error)
}

transport.onclose = () => {
  console.log("Transport closed")
}

console.log("Connecting server...")
await server.connect(transport)
console.log("Server connected")
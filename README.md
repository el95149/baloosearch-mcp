# Baloosearch MCP Server

A Model Context Protocol (MCP) server that provides file search functionality using KDE's baloosearch tool.

## Description

This MCP server exposes a tool that allows AI assistants to search for terms in files using the KDE baloosearch utility. It enables semantic search across your file system to find relevant documents and content.

The server implements the Model Context Protocol specification and can be used with any MCP-compatible client, such as Claude Desktop or other AI assistants that support the protocol.

## Features

- Search for terms in files using KDE baloosearch
- Configurable search parameters (limit, offset, directory, file type)
- JSON output of search results
- Full MCP compliance for integration with AI assistants

## Prerequisites

- Node.js (v18 or higher)
- KDE baloosearch tool (typically installed with KDE desktop environment)

## Installation

```bash
npm install
```

## Usage

### Starting the Server

```bash
npm start
```

The server will start and listen for MCP requests via stdio.

### Testing the Baloosearch Tool

```bash
npm run test-tool
```

This runs a direct test of the baloosearch functionality.

## Tools

### search_files

Search for terms in files using KDE baloosearch.

**Parameters:**
- `query` (string, required): The search query terms
- `limit` (number, optional): Maximum number of results to return (default: 10)
- `offset` (number, optional): Offset from which to start the search (default: 0)
- `directory` (string, optional): Limit search to specified directory
- `type` (string, optional): Type of data to be searched (e.g., "Document", "Audio", "Image")

**Returns:**
- JSON array of objects containing file paths that match the search criteria

## Testing with Command Line

You can test the server directly from the command line using echo and pipes:

### List Available Tools
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node src/server/mcp-server.js
```

### Search for Files
```bash
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_files","arguments":{"query":"test","limit":3}}}' | node src/server/mcp-server.js
```

## Integration with Claude Desktop

To use this server with Claude Desktop:

1. Add the following to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "baloosearch": {
      "command": "node",
      "args": ["/path/to/baloosearch-mcp/src/server/mcp-server.js"],
      "env": {}
    }
  }
}
```

2. Restart Claude Desktop
3. The baloosearch tool will be available in the tools list

## Project Structure

```
baloosearch-mcp/
├── src/
│   ├── server/
│   │   └── mcp-server.js      # Main MCP server implementation
│   ├── tools/
│   │   └── baloosearch-tool.js # Baloosearch tool implementation
│   ├── test-tool.js            # Test script for the tool
│   └── test-server.js          # Test script for the server
├── test/
│   ├── integration.js          # Integration test script
│   └── server-test.sh          # Server test script
├── package.json                # Project configuration
└── README.md                   # This file
```

## Development

### Running Tests

```bash
# Test the baloosearch tool directly
npm run test-tool

# Test the MCP server startup
npm run test-server
```

### Modifying the Server

The main server implementation is in `src/server/mcp-server.js`. You can add additional tools or modify existing ones by following the same pattern as the `search_files` tool.

### Modifying the Baloosearch Tool

The baloosearch tool implementation is in `src/tools/baloosearch-tool.js`. You can modify the search parameters or add additional functionality as needed.

## Troubleshooting

### "baloosearch: command not found"

Make sure you have KDE desktop environment installed with baloosearch available. You can test this by running:

```bash
which baloosearch
```

### Server exits immediately

This is normal behavior for MCP servers using stdio transport. The server waits for JSON-RPC messages via stdin/stdout.

### No search results

Make sure your baloosearch index is up to date. You can update it by running:

```bash
balooctl monitor
```

## License

This project is licensed under the MIT License.
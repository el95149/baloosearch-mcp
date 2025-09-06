# QWEN.md - Baloosearch MCP Server Project Context

## Project Overview

This directory contains a Node.js implementation of a Model Context Protocol (MCP) server that provides file search functionality using KDE's baloosearch tool. The server exposes tools that allow AI assistants to search for terms in files and retrieve indexed content from specific files using KDE's semantic desktop search capabilities.

### Key Features

- **File Search**: Search for terms in files using KDE baloosearch with advanced query syntax support
- **File Content Inspection**: Show indexed words and metadata from specific files using KDE balooshow
- **Advanced Query Support**: AND, OR, NOT queries, phrase searches, wildcards, property searches, and file type filtering
- **MCP Compliance**: Full implementation of the Model Context Protocol for integration with AI assistants like Claude Desktop

## Project Structure

```
.
├── src/
│   ├── server/
│   │   └── mcp-server.js      # Main MCP server implementation
│   ├── tools/
│   │   └── baloosearch-tool.js # Baloosearch and balooshow tool implementations
│   ├── test-tool.js            # Test script for the tools
│   └── test-server.js          # Test script for the server
├── test/
│   ├── integration.js          # Integration test script
│   └── server-test.sh          # Server test script
├── package.json                # Project configuration and dependencies
├── README.md                   # Project documentation
├── .gitignore                  # Git ignore patterns
├── curl-examples.sh            # Example commands for testing
├── demo.sh                     # Demo script
└── example-claude-config.json  # Example Claude Desktop configuration
```

## Technology Stack

- **Node.js**: Runtime environment (ES Modules)
- **@modelcontextprotocol/sdk**: Official MCP SDK for implementing the protocol
- **zod**: Schema validation library
- **KDE Baloo**: Semantic desktop search framework (baloosearch and balooshow commands)

## Building and Running

### Prerequisites

1. Node.js (v18 or higher)
2. KDE desktop environment with baloosearch and balooshow utilities installed

### Installation

```bash
npm install
```

### Running the Server

```bash
npm start
```

The server will start and listen for MCP requests via stdio.

### Testing

```bash
# Test the baloosearch tool directly
npm run test-tool

# Test the MCP server startup
npm run test-server
```

## Development Guide

### Main Components

1. **MCP Server** (`src/server/mcp-server.js`):
   - Implements the Model Context Protocol using the official SDK
   - Registers two tools: `search_files` and `show_file_words`
   - Uses stdio transport for communication

2. **Baloosearch Tool** (`src/tools/baloosearch-tool.js`):
   - `searchFiles()`: Executes `baloosearch` command with query parameters
   - `showFileWords()`: Executes `balooshow` command to retrieve indexed content from a file
   - Handles command execution and output parsing

### Available Tools

#### search_files

Search for terms in files using KDE baloosearch.

**Parameters:**
- `query` (string, required): Search query with support for advanced syntax
- `limit` (number, optional): Maximum results (default: 10)
- `offset` (number, optional): Search offset (default: 0)
- `directory` (string, optional): Limit search to directory
- `type` (string, optional): File type filter

**Query Syntax Examples:**
- Simple: `"project plan"`
- AND: `"budget AND marketing"`
- OR: `"report OR presentation"`
- Phrase: `"\"exact phrase\""`
- NOT: `"financial -tax"`
- Wildcard: `"report*"`
- Property: `"Artist:\"Coldplay\""`
- File type: `"type:Audio"`
- Comparison: `"rating>3"`

#### show_file_words

Show indexed content and metadata from a specific file using KDE balooshow.

**Parameters:**
- `path` (string, required): Absolute path to the file

### Testing the Server

The server communicates via stdio using JSON-RPC. Test with:

```bash
# List available tools
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node src/server/mcp-server.js

# Search for files
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_files","arguments":{"query":"test","limit":3}}}' | node src/server/mcp-server.js

# Show file content
echo '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"show_file_words","arguments":{"path":"/path/to/file"}}}' | node src/server/mcp-server.js
```

## Integration with Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "baloosearch": {
      "command": "node",
      "args": ["./src/server/mcp-server.js"]
    }
  }
}
```

## Troubleshooting

1. **"baloosearch: command not found"**: Ensure KDE desktop environment is installed
2. **No search results**: Update baloosearch index with `balooctl monitor`
3. **Server exits immediately**: Normal behavior; server waits for JSON-RPC messages via stdin/stdout

## Development Workflow

1. Modify `src/server/mcp-server.js` to add new tools or modify existing ones
2. Update `src/tools/baloosearch-tool.js` to enhance command execution logic
3. Test changes with `npm run test-tool` or direct command line testing
4. Update documentation in README.md as needed
```
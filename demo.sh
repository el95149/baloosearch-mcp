#!/bin/bash

# Demo script for using the baloosearch MCP server
echo "Baloosearch MCP Server Demo"
echo "=========================="
echo ""
echo "This script demonstrates how to use the baloosearch MCP server."
echo ""
echo "1. Make sure you have Node.js installed (v18 or higher)"
echo "2. Make sure you have KDE baloosearch installed"
echo "3. Install dependencies:"
echo "   cd baloosearch-mcp && npm install"
echo ""
echo "To start the server:"
echo "   npm start"
echo ""
echo "To test the baloosearch tool directly:"
echo "   npm run test-tool"
echo ""
echo "To use with Claude Desktop, add this to your claude_desktop_config.json:"
echo ""
cat example-claude-config.json
echo ""
echo "Then restart Claude Desktop to access the baloosearch tool."
#!/bin/bash

# Example of how to test the MCP server with manual JSON-RPC requests
echo "Example MCP requests for the baloosearch server:"
echo ""
echo "1. List available tools:"
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
echo ""
echo "2. Call the search_files tool:"
echo '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_files","arguments":{"query":"test","limit":3}}}'
echo ""
echo "To test with a running server:"
echo "1. Start the server: npm start"
echo "2. In another terminal, send requests using echo and pipe:"
echo ""
echo 'echo '\''{"jsonrpc":"2.0","id":1,"method":"tools/list"}'\'' | node src/server/mcp-server.js'
echo ""
echo 'echo '\''{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_files","arguments":{"query":"test","limit":3}}}'\'' | node src/server/mcp-server.js'
echo ""
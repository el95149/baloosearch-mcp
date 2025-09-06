#!/bin/bash

# Test script for the baloosearch MCP server using stdio
echo "Testing Baloosearch MCP Server"
echo "=============================="
echo ""

# Start the server in the background
echo "Starting server..."
node src/server/mcp-server.js &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server is running (PID: $SERVER_PID)"
    
    # Create a test request
    echo "Sending test request..."
    echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node src/server/mcp-server.js
    
    # Kill the server
    kill $SERVER_PID 2>/dev/null
    echo "Server stopped"
else
    echo "Server failed to start"
fi
#!/bin/bash

# Test script for the baloosearch MCP server
echo "Testing baloosearch MCP server..."

# Start the server in the background
npm start &
SERVER_PID=$!

# Give the server a moment to start
sleep 2

# Check if the server is running
if kill -0 $SERVER_PID 2>/dev/null; then
  echo "Server is running with PID $SERVER_PID"
  # Kill the server
  kill $SERVER_PID
  echo "Server test completed successfully"
else
  echo "Server failed to start"
  exit 1
fi
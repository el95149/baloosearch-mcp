#!/usr/bin/env node

/**
 * Integration test for the baloosearch MCP server
 * This script demonstrates how to communicate with the MCP server
 */

import { spawn } from 'child_process'

console.log('Starting baloosearch MCP server integration test...')

// Start the MCP server
const server = spawn('node', ['src/server/mcp-server.js'], {
  cwd: '.'
})

console.log('MCP server started')

// Handle server output
server.stdout.on('data', (data) => {
  console.log('Server stdout:', data.toString())
})

server.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString())
})

// Handle server exit
server.on('close', (code) => {
  console.log(`Server exited with code ${code}`)
})

// Handle server errors
server.on('error', (error) => {
  console.error('Failed to start server:', error)
})

// Give the server a moment to start
setTimeout(() => {
  console.log('Server is ready to receive MCP messages')
  console.log('You can now send MCP requests to the server via stdin')
  
  // Example MCP request (tools/list)
  const listToolsRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
  }
  
  console.log('Example request to send:')
  console.log(JSON.stringify(listToolsRequest, null, 2))
  
  // Send the request to the server
  // server.stdin.write(JSON.stringify(listToolsRequest) + '\n')
  
  // Kill the server after a few seconds for demonstration purposes
  setTimeout(() => {
    console.log('Stopping server...')
    server.kill()
  }, 3000)
}, 2000)
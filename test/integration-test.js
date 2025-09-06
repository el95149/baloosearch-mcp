#!/usr/bin/env node

// Simple integration test for the baloosearch MCP server
import { spawn } from 'child_process'
import { createInterface } from 'readline'

// Start the MCP server
const server = spawn('node', ['src/server/mcp-server.js'], {
  cwd: process.cwd()
})

// Set up readline interface to capture server output
const rl = createInterface({
  input: server.stdout,
  terminal: false
})

console.log('Starting MCP server test...')

// Listen for server output
rl.on('line', (line) => {
  console.log('Server output:', line)
})

// Handle server errors
server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString())
})

// Handle server exit
server.on('close', (code) => {
  console.log(`Server exited with code ${code}`)
})

// Send a test request after a short delay
setTimeout(() => {
  console.log('Sending test request...')
  process.stdout.write(JSON.stringify({
    "method": "tools/list"
  }) + '\n')
}, 2000)

// Exit after 5 seconds
setTimeout(() => {
  server.kill()
  process.exit(0)
}, 5000)
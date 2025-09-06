import { searchFiles } from './tools/baloosearch-tool.js'

// Test the searchFiles function
async function testSearch() {
  try {
    console.log('Testing baloosearch tool...')
    const results = await searchFiles({ query: 'test', limit: 3 })
    console.log('Search results:', results)
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSearch()
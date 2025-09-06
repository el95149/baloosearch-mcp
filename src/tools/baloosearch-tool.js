import { exec } from 'child_process'
import { promisify } from 'util'

const execPromise = promisify(exec)

/**
 * Search for terms in files using KDE baloosearch
 * @param {Object} options - Search options
 * @param {string} options.query - The search query terms
 * @param {number} [options.limit=10] - Maximum number of results to return
 * @param {number} [options.offset=0] - Offset from which to start the search
 * @param {string} [options.directory] - Limit search to specified directory
 * @param {string} [options.type] - Type of data to be searched
 * @returns {Promise<Array>} - Array of search results
 */
export async function searchFiles({ query, limit = 10, offset = 0, directory, type }) {
  // Validate inputs
  if (!query || typeof query !== 'string') {
    throw new Error('Query is required and must be a string')
  }
  
  if (limit && (typeof limit !== 'number' || limit <= 0)) {
    throw new Error('Limit must be a positive number')
  }
  
  if (offset && (typeof offset !== 'number' || offset < 0)) {
    throw new Error('Offset must be a non-negative number')
  }
  
  // Build the baloosearch command
  let command = `baloosearch`
  
  // Add options
  command += ` --limit ${limit}`
  command += ` --offset ${offset}`
  
  if (directory) {
    command += ` --directory "${directory}"`
  }
  
  if (type) {
    command += ` --type "${type}"`
  }
  
  // Add the query
  command += ` "${query}"`
  
  try {
    // Execute the command
    const { stdout, stderr } = await execPromise(command)
    
    // Parse the output
    const lines = stdout.trim().split('\n').filter(line => line.length > 0)
    
    // Filter out the "Elapsed" line that baloosearch adds at the end
    const filePaths = lines.filter(line => !line.startsWith('Elapsed:'))
    
    const results = []
    for (const filePath of filePaths) {
      // Each line represents a search result
      results.push({
        path: filePath,
        query: query
      })
    }
    
    return results
  } catch (error) {
    throw new Error(`Failed to execute baloosearch: ${error.message}`)
  }
}

/**
 * Show indexed words in a file using KDE balooshow
 * @param {Object} options - Show options
 * @param {string} options.path - The absolute path to the file
 * @returns {Promise<Array>} - Array of indexed words from the file
 */
export async function showFileWords({ path }) {
  // Validate inputs
  if (!path || typeof path !== 'string') {
    throw new Error('Path is required and must be a string')
  }

  // Build the balooshow command
  let command = `balooshow -x "${path}"`

  try {
    // Execute the command
    const { stdout, stderr } = await execPromise(command)

    // Parse the output
    const lines = stdout.trim().split('\n').filter(line => line.length > 0)

    // Filter out any empty lines or error messages
    const words = lines.filter(line => !line.startsWith('Elapsed:') && line.trim() !== '')

    return {
      path: path,
      words: words
    }
  } catch (error) {
    throw new Error(`Failed to execute balooshow: ${error.message}`)
  }
}

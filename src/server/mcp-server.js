import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import { searchFiles, showFileWords } from "../tools/baloosearch-tool.js"

const server = new McpServer({
  name: "Baloosearch MCP Server",
  version: "1.0.0",
})

// Tool to search for terms in files using baloosearch
server.tool(
  "search_files",
  `Search for terms in files using KDE baloosearch.
  
Query Syntax Examples:
- Simple search: "project plan"
- Multiple terms: "budget AND marketing" (finds files with both terms)
- OR search: "report OR presentation" (finds files with either term)
- Phrase search: "\\"strategic plan\\"" (finds exact phrase)
- Exclusion: "financial -tax" (finds files with "financial" but not "tax")
- Wildcard: "report*" (finds files with words starting with "report")
- Property search: "Artist:\\"Coldplay\\"" (finds audio files by artist)
- File type search: "type:Audio" (finds audio files)
- Combined expressions: "(type:Audio AND Artist:\\"Coldplay\\") OR (type:Document AND subject:\\"music\\")"`,
  {
    query: z.string().describe(`The search query terms. Supports advanced search syntax:
- Basic search: Simple terms like "project plan"
- AND queries: "budget AND marketing" (requires both terms)
- OR queries: "report OR presentation" (requires either term)
- NOT queries: "financial -tax" or "financial NOT tax" (excludes terms)
- Phrase searches: "\\"exact phrase\\"" (matches exact phrases)
- Wildcards: "report*" (matches partial words)
- Property searches: "Artist:\\"Coldplay\\"" or "Author:\\"Smith\\""
- File type filters: "type:Audio", "type:Document", "type:Image", etc.
- Grouping: Use parentheses "(term1 AND term2) OR term3"
- Property comparisons: "rating>3", "modified>2024-01-01"

Supported file types:
- "Archive" (zip, tar, etc.)
- "Folder" (directories)
- "Audio" (mp3, wav, etc.)
- "Video" (mp4, avi, etc.)
- "Image" (jpg, png, etc.)
- "Document" (pdf, doc, etc.)
  - "Spreadsheet" (xls, xlsx, etc.)
  - "Presentation" (ppt, pptx, etc.)
- "Text" (txt, etc.)

Common properties for all files:
- filename (name of the file)
- modified (last modification date)
- mimetype (MIME type of file)
- tags (user-defined tags)
- rating (numeric rating 0-10)
- userComment (user comments)

Audio-specific properties:
- Artist, Album, AlbumArtist, Composer, Lyricist
- Genre, Duration, BitRate, Channels, SampleRate
- TrackNumber, ReleaseYear, Comment

Document-specific properties:
- Author, Title, Subject, Keywords
- PageCount, WordCount, LineCount
- Language, Copyright, Publisher
- CreationDate, Generator

Media-specific properties (Video/Images):
- Width, Height, AspectRatio, FrameRate

Image-specific properties:
- ImageMake, ImageModel, ImageDateTime
- PhotoFlash, PhotoFNumber, PhotoISOSpeedRatings
- PhotoGpsLatitude, PhotoGpsLongitude, PhotoGpsAltitude`),
    limit: z.number().optional().describe("Maximum number of results to return (default: 10)"),
    offset: z.number().optional().describe("Offset from which to start the search (default: 0)"),
    directory: z.string().optional().describe("Limit search to specified directory (absolute path)"),
    type: z.string().optional().describe(`Type of data to be searched. Common types include:
- "Archive" (zip, tar, etc.)
- "Folder" (directories)
- "Audio" (mp3, wav, etc.)
- "Video" (mp4, avi, etc.)
- "Image" (jpg, png, etc.)
- "Document" (pdf, doc, etc.)
  - "Spreadsheet" (xls, xlsx, etc.)
  - "Presentation" (ppt, pptx, etc.)
- "Text" (txt, etc.)
Note: This parameter is an alternative to using "type:" in the query.`)
  },
  async ({ query, limit, offset, directory, type }) => {
    try {
      const results = await searchFiles({ query, limit, offset, directory, type })
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error searching files: ${error.message}` }]
      }
    }
  }
)

// Tool to show indexed words in a file using balooshow
server.tool(
  "show_file_words",
  `Show indexed content & meta-data in a file using KDE balooshow.
  
This tool retrieves all the indexed words & meta-data from a specific file that has been indexed by KDE's Baloo search system.`,
  {
    path: z.string().describe("The absolute path to the file to show indexed words & meta-data for")
  },
  async ({ path }) => {
    try {
      const results = await showFileWords({ path })
      return {
        content: [{ type: "text", text: JSON.stringify(results, null, 2) }]
      }
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error showing file words: ${error.message}` }]
      }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)

# n8n-nodes-exa-unofficial

This unofficial n8n community node provides Exa search, content extraction, answers, Agent runs, and Websets.

[Exa](https://exa.ai) is an AI-powered search engine that provides embeddings-based semantic search, deep web research, and structured content extraction.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  
[Compatibility](#compatibility)  
[Usage](#usage)  
[Resources](#resources)  

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

This node supports the following Exa API operations:

### Search
- **Search**: Intelligently search the web
  - Supports multiple search types: auto, fast, instant
  - Filter by domain, date, category, and text content
  - Extract page contents (text, highlights, summaries)
  - Configure livecrawl and subpage crawling

### Contents
- **Get Contents**: Retrieve cleaned text, highlights, and summaries from a list of URLs

### Answer
- **Get Answer**: Get an AI-generated web-grounded answer to a query

### Agent
- **Create, Get, List, Cancel, Delete Run**: Run Exa Agent tasks and manage lifecycle.
- **List Run Events**: Fetch JSON event history with cursor pagination. SSE not exposed because standard n8n node execution expects completed JSON response.

### Websets
- **Websets**: Create, preview, get, list, update, cancel, and delete Websets.
- **Searches**: Create, get, and cancel Webset searches.
- **Items**: List, get, and delete Webset items.
- **Enrichments**: Create, get, update, cancel, and delete enrichments.
- **Exports**: Create CSV or JSON exports and poll export status.

## Credentials

To use this node, you need an Exa API key. You can obtain one by:

1. Signing up at [dashboard.exa.ai](https://dashboard.exa.ai)
2. Navigating to the API Keys section
3. Creating a new API key

Add the API key to your n8n credentials as "Exa (Unofficial) API".

## Compatibility

- Minimum n8n version: 1.0.0
- Tested against n8n version: 1.60.0

## Usage

### Basic Search Example

1. Add the Exa (Unofficial) node to your workflow
2. Select "Search" as the resource
3. Enter your search query (e.g., "Latest AI research papers")
4. Configure search type (auto, fast, or instant)
5. Optionally add filters:
   - Category (research paper, news, company, etc.)
   - Date range (published date)
   - Domain filters (include/exclude specific domains)
   - Text filters (include/exclude specific text)

### Content Extraction

Enable content extraction options:
- **Text**: Get cleaned page text
- **Highlights**: Get relevant excerpts
- **Summary**: Get AI-generated summaries
- **Livecrawl**: Crawl pages in real-time
- **Subpages**: Crawl linked subpages

### Advanced Features

**Date Filtering**: Filter results by publication date
```
Start Published Date: 2024-01-01
End Published Date: 2024-12-31
```

**Domain Control**: Focus on or exclude specific domains
```
Include Domains: arxiv.org, github.com
Exclude Domains: reddit.com
```

**Category Filtering**: Focus on specific content types
- Company profiles
- Research papers
- News articles
- PDFs
- GitHub repositories
- Twitter/LinkedIn profiles
- Financial reports

### Agent Workflow Example

1. Set **Resource** to `Agent`, then select **Create Run**.
2. Enter query, optional system prompt, JSON input/output schema, metadata, and data sources.
3. Store returned run `id`, then use **Get Run** with `{{$json.id}}` to poll until complete. No automatic polling occurs.

### Websets Example

1. Set **Resource** to `Websets`, then select **Create Webset**.
2. Enter query and count; optionally provide entity, criteria JSON, enrichment JSON, title, external ID, and metadata.
3. Use returned Webset ID in **Get Webset**, **List Items**, **Create Enrichment**, or **Create Export** through n8n expressions.

For bulk monitoring, use **List Research Tasks** and apply parameters for pagination, status filtering, or creation date ranges.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Exa API documentation](https://docs.exa.ai)
* [Exa API reference](https://docs.exa.ai/reference/search)

## Development

To work on this node locally:

```bash
# Install dependencies
npm install

# Build the node
npm run build

# Link for local testing
npm link

# In your n8n installation directory
cd ~/.n8n/custom
npm link n8n-nodes-exa-unofficial

# Start n8n
n8n start
```

## License

[MIT](https://github.com/SanderSpiegelaar/n8n-nodes-exa-unofficial/blob/main/LICENSE)

# Decodo MCP Server

[![smithery badge](https://smithery.ai/badge/@Decodo/decodo-mcp-server)](https://smithery.ai/server/@Decodo/decodo-mcp-server)

<p align="center">
<a href="https://dashboard.decodo.com/?page=residential-proxies&utm_source=socialorganic&utm_medium=social&utm_campaign=resi_trial_GITHUB"><img src="https://github.com/user-attachments/assets/60bb48bd-8dcc-48b2-82c9-a218e1e4449c"></a>
</p>

[![](https://dcbadge.vercel.app/api/server/Ja8dqKgvbZ)](https://discord.gg/Ja8dqKgvbZ)

This repository provides a Model Context Protocol (MCP) server that connects LLMs and applications
to Decodo's platform. The server facilitates integration between MCP-compatible clients and Decodo's
services, streamlining access to our tools and capabilities.

## Features

- Easy web data access. Simplified retrieval of information from websites and online sources.
- Geographic flexibility. Access content regardless of regional restrictions.
- Enhanced privacy. Browse and collect data while maintaining anonymity.
- Reliable scraping. Advanced techniques to avoid detection and blocks.
- Simple integration. Seamless setup with popular MCP clients like Claude Desktop, Cursor, and
  Windsurf.

## Quick start via Smithery (Recommended)

Visit the `decodo-mcp-server` page on
[Smithery](https://smithery.ai/server/@Decodo/decodo-mcp-server), select your preferred MCP client
and generate installation instructions.

![Smithery interface](img/smithery.png 'Smithery UI')

## Obtain Web Scraping API credentials

You'll need the Decodo Advanced Web Scraping API credentials, which you can get by starting a free
trial on the [dashboard](https://dashboard.decodo.com/). Once you have a plan activated, take a note
of your generated username and password:

![Decodo dashboard](img/auth.png 'Decodo dashboard')

## Running the MCP server locally (manual)

### Prerequisites

- Node.js 18.0+
- An MCP client - popular choices are [Claude Desktop](https://claude.ai/download) and
  [Cursor](https://www.cursor.com/)

### Step-by-step guide

1. Clone this repository:

```
git clone https://github.com/Decodo/decodo-mcp-server
```

2. Run the following commands in the terminal:

```
npm install
npm run build
```

3. Take note of your build location:

```
cd build/
pwd
```

Adding `index.js` to the end of this directory, your build file location should look something like
this:

```
/Users/your.user/projects/decodo-mcp/build/index.js
```

4. Update your MCP client with the server information:

### Claude Desktop

[Follow the guide here](https://modelcontextprotocol.io/quickstart/user) to find the setup file,
then update `claude_desktop_config.json` to look like this:

```
{
  "mcpServers": {
    "decodo-mcp": {
      "command": "node",
      "args": ["/Users/your.user/projects/decodo-mcp/build/index.js"],
      "env": {
        "SCRAPER_API_USERNAME": "your_username",
        "SCRAPER_API_PASSWORD": "your_password"
      }
    }
  }
}

```

### Cursor

For installation instructions, see the
[Cursor documentation](https://docs.cursor.com/context/model-context-protocol#installing-mcp-servers).

## Tools

The server exposes the following tools:

| Tool                   | Description                                                                                | Example prompt                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| `scrape_as_markdown`   | Scrapes any target URL, expects a URL to be given via prompt. Returns results in Markdown. | Scrape peacock.com from a US IP address and tell me the pricing. |
| `google_search_parsed` | Scrapes Google Search for a given query, and returns parsed results.                       | Scrape Google Search for shoes and tell me the top position.     |
| `amazon_search_parsed` | Scrapes Amazon Search for a given query, and returns parsed results.                       | Scrape Amazon Search for toothbrushes                            |

## Parameters

The following parameters are inferred from user prompts:

| Parameter      | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| `jsRender`     | Renders target URL in a headless browser.                                                            |
| `geo`          | Sets the country from which the request will originate.                                              |
| `locale`       | Sets the locale of the request.                                                                      |
| `tokenLimit`   | Truncates the response content up to this limit. Useful if the context window is small.              |
| `fullResponse` | Skips automatic truncation and returns full content. If context window is small, may throw warnings. |

## Examples

### Scraping geo-restricted content

Query your AI agent with the following prompt:

```
Scrape peacock.com from a German IP address and tell me the pricing.
```

This prompt will say that peacock.com is geo-restricted. To bypass the geo-restriction:

```
Scrape peacock.com from a US IP address and tell me the pricing.
```

### Limiting number of response tokens

If your agent has a small context window, the content returned from scraping will be automatically
truncated, in order to avoid context-overflow. You can increase the number of tokens returned within
your prompt:

```
Scrape hacker news, return 50k tokens.
```

If your agent has a big context window, tell it to return `full content`:

```
Scrape hacker news, return full content.
```

## Related repositories

[Web Scraping API](https://github.com/Decodo/Web-Scraping-API)

[Google Maps scraper](https://github.com/Decodo/google-maps-scraper)

[Amazon scraper](https://github.com/Decodo/Amazon-scraper)

## License

All code is released under the [MIT License](https://github.com/Decodo/Decodo/blob/master/LICENSE).

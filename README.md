# Decodo MCP Server

[![smithery badge](https://smithery.ai/badge/@Decodo/decodo-mcp-server)](https://smithery.ai/server/@Decodo/decodo-mcp-server)

This repo contains Decodo MCP server which enables MCP clients to interface with services offered by
Decodo.

## Quick start via Smithery (Recommended)

Visit `decodo-mcp-server` on [Smithery](https://smithery.ai/server/@Decodo/decodo-mcp-server),
select your favourite MCP client and generate installation instructions.

![Smithery interface](img/smithery.png 'Smithery UI')

## Obtain Scraper API credentials

A Decodo Scraper API Web Advanced user is required - trial available on
[dashboard](https://dashboard.decodo.com/).

Once you have a Web Advanced plan activated, take a note of your generated username and password:

![Decodo dashboard](img/auth.png 'Decodo dashboard')

## Running MCP server locally (manual)

<details>

<summary>Running MCP server locally</summary>

### Prerequisites:

- Node.js >= `18.0`
- An MCP client - popular choices are [Claude Desktop](https://claude.ai/download) and
  [Cursor](https://www.cursor.com/)

2. Clone this repo and run:

```
npm install
npm run build
```

3. Take a note of your build location:

```
cd build/
pwd
```

Adding `index.js` to the end of this directory, your build file location will look something like
this:

```
/Users/your.user/projects/decodo-mcp/build/index.js
```

4. Update your MCP client with server information:

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

See
[Cursor documentation](https://docs.cursor.com/context/model-context-protocol#installing-mcp-servers)
for how to install.

</details>

## Tools

The server exposes the following tools:

| Tool                   | Description                                                          | Example prompt                                                  |
| ---------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------- |
| `scrape`               | Scrapes any target URL, expects a URL to be given via prompt.        | Scrape peacock.com from a US ip address and tell me the pricing |
| `google_search_parsed` | Scrapes Google Search for a given query, and returns parsed results. | Scrape google search for shoes and tell me the top position     |

## Parameters

The following parameters are inferred from user prompts:

| Parameter  | Description                                        |
| ---------- | -------------------------------------------------- |
| `jsRender` | Renders target URL in a headless browser.          |
| `geo`      | Sets the country from which request will originate |
| `locale`   | Sets the locale of the request.                    |

## Examples

### Scraping geo-restricted content

Query your AI agent with the following prompt:

```
Scrape peacock.com from a German ip address and tell me the pricing
```

This prompt will say that peacock.com is geo-restricted. To come around the geo-restriction:

```
Scrape peacock.com from a US ip address and tell me the pricing
```

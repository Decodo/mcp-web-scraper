# Decodo MCP Server

<b> Work In Progress - expect new features soon! </b><br>

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/install-mcp?name=decodo-mcp&config=eyJjb21tYW5kIjoibm9kZSAvVXNlcnMveW91ci51c2VyL3Byb2plY3RzL2RlY29kby1tY3AvYnVpbGQvaW5kZXguanMiLCJlbnYiOnsiU0NSQVBFUl9BUElfVVNFUk5BTUUiOiJ5b3VyX3VzZXJuYW1lIiwiU0NSQVBFUl9BUElfUEFTU1dPUkQiOiJ5b3VyX3Bhc3N3b3JkIn19)

This repo contains Decodo MCP server which enables MCP clients to interface with Decodo.

## Setup (running MCP server locally)

Prerequisites:

- `node` >= `18.0`
- A Decodo Scraper API Web Advanced user - trial available on
  [dashboard](https://dashboard.decodo.com/).

1. Once you have a Web Advanced plan activated, take a note of your generated username and password:

![alt text](img/auth.png 'Title')

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

## Tools

The server exposes the following tools:

| Tool     | Description                                                       |
| -------- | ----------------------------------------------------------------- |
| `scrape` | Scrapes any target URL. Infers the following para parameters:<br> |

## Parameters

The following parameters are inferred from queries:

| Parameter  | Description                               |
| ---------- | ----------------------------------------- |
| `jsRender` | Renders target URL in a headless browser. |
| `geo`      | Sets geolocation of request.              |
| `locale`   | Sets locale of request.                   |

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

import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ScraperAPIMCPServer } from './sapi-mcp-server';

const app = express();

const server = new ScraperAPIMCPServer({
  sapiUsername: process.env.SCRAPER_API_USERNAME as string,
  sapiPassword: process.env.SCRAPER_API_PASSWORD as string,
});

app.use(express.json());

app.post('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

const port = parseInt(process.env.PORT || '3000');

app
  .listen(port, () => {
    console.log(`Demo MCP Server running on http://localhost:${port}/mcp`);
  })
  .on('error', error => {
    console.error('Server error:', error);
    process.exit(1);
  });

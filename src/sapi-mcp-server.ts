import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ScraperApiClient } from './clients/scraper-api-client';
import { registerScrapeTool } from './tools/scrape-tool';
import { registerGetAlertsTool } from './tools/get-alerts-tool';
import { registerGetForecastTool } from './tools/get-forecast-tool';

export class ScraperAPIMCPServer {
  server: McpServer;

  sapiClient: ScraperApiClient;

  constructor({ sapiUsername, sapiPassword }: { sapiUsername: string; sapiPassword: string }) {
    this.server = new McpServer({
      name: 'decodo',
      version: '0.1.0',
      capabilities: {
        resources: {},
        tools: {},
      },
    });

    const auth = Buffer.from(`${sapiUsername}:${sapiPassword}`).toString('base64');

    this.sapiClient = new ScraperApiClient({ auth });

    this.registerTools();
    this.registerResources();
  }

  connect(transport: StdioServerTransport) {
    this.server.connect(transport);
  }

  registerTools() {
    this.registerScrapeTool();
  }

  registerResources() {
    // todo: expose info about all targets available
  }

  registerScrapeTool() {
    registerScrapeTool({ server: this.server, sapiClient: this.sapiClient });
  }
}

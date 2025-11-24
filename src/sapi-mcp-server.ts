import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ScraperApiClient } from './clients/scraper-api-client';
import {
  AmazonSearchParsedTool,
  GoogleSearchParsedTool,
  RedditPostTool,
  RedditSubredditTool,
  ScrapeAsMarkdownTool,
} from './tools';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

export class ScraperAPIMCPServer {
  server: McpServer;

  sapiClient: ScraperApiClient;

  constructor({ sapiUsername, sapiPassword }: { sapiUsername: string; sapiPassword: string }) {
    this.server = new McpServer({
      name: 'decodo',
      version: '0.1.0',
      capabilities: {
        logging: {},
        resources: {},
        tools: {},
      },
    });

    const auth = Buffer.from(`${sapiUsername}:${sapiPassword}`).toString('base64');

    this.sapiClient = new ScraperApiClient({ auth });

    this.registerTools();
    this.registerResources();
  }

  connect(transport: StdioServerTransport | StreamableHTTPServerTransport) {
    this.server.connect(transport);
  }

  registerTools() {
    // scrape
    ScrapeAsMarkdownTool.register({ server: this.server, sapiClient: this.sapiClient });

    // targets
    GoogleSearchParsedTool.register({ server: this.server, sapiClient: this.sapiClient });
    AmazonSearchParsedTool.register({ server: this.server, sapiClient: this.sapiClient });
    RedditPostTool.register({ server: this.server, sapiClient: this.sapiClient });
    RedditSubredditTool.register({ server: this.server, sapiClient: this.sapiClient });
  }

  registerResources() {
    // todo: expose info about all targets available
  }
}

import 'dotenv/config';

import { exit } from 'process';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ScraperAPIMCPServer } from './sapi-mcp-server';

const parseEnvsOrExit = (): Record<string, string> => {
  const envs = ['SCRAPER_API_USERNAME', 'SCRAPER_API_PASSWORD'];

  for (const envKey of envs) {
    if (!process.env[envKey]) {
      exit(`env ${envKey} missing`);
    }
  }

  return {
    sapiUsername: process.env['SCRAPER_API_USERNAME'] as string,
    sapiPassword: process.env['SCRAPER_API_PASSWORD'] as string,
  };
};

async function main() {
  const transport = new StdioServerTransport();

  // if there are no envs, some MCP clients will fail silently
  const { sapiUsername, sapiPassword } = parseEnvsOrExit();

  const sapiMcpServer = new ScraperAPIMCPServer({
    sapiUsername,
    sapiPassword,
  });
  await sapiMcpServer.connect(transport);

  console.error('MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

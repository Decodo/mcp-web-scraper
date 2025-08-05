import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ScraperAPIParams, ScrapingMCPParams } from 'types';
import { ScraperApiClient } from 'clients/scraper-api-client';
import { SCRAPER_API_TARGETS } from '../constants';

export class RedditPostTool {
  static register = ({
    server,
    sapiClient,
  }: {
    server: McpServer;
    sapiClient: ScraperApiClient;
  }) => {
    server.registerTool(
      'reddit_post',
      {
        description: 'Scrape a specific Reddit post',
        inputSchema: {
          url: z.string().describe('reddit post URL'),
        },
      },
      async (scrapingParams: ScrapingMCPParams) => {
        const params = {
          ...scrapingParams,
          target: SCRAPER_API_TARGETS.REDDIT_POST,
        } satisfies ScraperAPIParams;

        const { data } = await sapiClient.scrape<object>({ scrapingParams: params });

        const text = JSON.stringify(data, null, 2);

        return {
          content: [
            {
              type: 'text',
              text,
            },
          ],
        };
      }
    );
  };
}

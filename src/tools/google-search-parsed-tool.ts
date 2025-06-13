import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { ScraperAPIParams, ScrapingMCPParams } from 'types';
import { ScraperApiClient } from 'clients/scraper-api-client';
import { SCRAPER_API_TARGETS } from '../constants';
import { removeKeyFromNestedObject } from '../utils';

export class GoogleSearchParsedTool {
  static transformResponse = ({ obj }: { obj: object }) => {
    removeKeyFromNestedObject({ obj, keyToRemove: 'images' });
  };

  static register = ({
    server,
    sapiClient,
  }: {
    server: McpServer;
    sapiClient: ScraperApiClient;
  }) => {
    server.tool(
      'google_search_parsed',
      'Scrape Google Search results with automatic parsing',
      {
        query: z.string().describe('search query'),
        geo: z
          .string()
          .describe('Geolocation of the desired request, expressed as a country name')
          .optional(),
        locale: z.string().describe('Locale of the desired request').optional(),
        jsRender: z
          .boolean()
          .describe('Should the request be opened in a headless browser, false by default')
          .optional(),
      },
      async (scrapingParams: ScrapingMCPParams) => {
        const params = {
          ...scrapingParams,
          target: SCRAPER_API_TARGETS.GOOGLE_SEARCH,
          parse: true,
        } satisfies ScraperAPIParams;

        const { data } = await sapiClient.scrape<object>({ scrapingParams: params });

        const object = this.transformResponse({ obj: data });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(object),
            },
          ],
        };
      }
    );
  };
}

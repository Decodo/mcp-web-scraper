import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ScraperAPIParams, ScrapingMCPParams } from 'types';
import { ScraperApiClient } from 'clients/scraper-api-client';
import { SCRAPER_API_TARGETS } from '../constants';
import { removeKeyFromNestedObject } from '../utils';

export class GoogleSearchParsedTool {
  static FIELDS_WITH_HIGH_CHAR_COUNT = [
    'images',
    'image_data',
    'related_searches_urls',
    'factoids',
    'people_also_buy_from',
    'what_people_are_saying',
  ];

  static transformAutoParsedResponse = ({ obj }: { obj: object }): string => {
    for (const fieldToRemove of GoogleSearchParsedTool.FIELDS_WITH_HIGH_CHAR_COUNT) {
      obj = removeKeyFromNestedObject({ obj, keyToRemove: fieldToRemove });
    }

    const text = JSON.stringify(obj);

    return text;
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

        const text = this.transformAutoParsedResponse({ obj: data });

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

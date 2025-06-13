import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { ScrapingMCPParams } from 'types';
import { ScraperApiClient } from '../clients/scraper-api-client';
import { NodeHtmlMarkdown } from 'node-html-markdown';

export class ScrapeTool {
  static transformResponse = ({ html }: { html: string }) => {
    const markdown = NodeHtmlMarkdown.translate(html, {});

    return markdown;
  };

  static register = ({
    server,
    sapiClient,
  }: {
    server: McpServer;
    sapiClient: ScraperApiClient;
  }) => {
    server.tool(
      'scrape',
      'Scrape the contents of a website',
      {
        url: z.string().describe('URL to scrape'),
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
        const { data } = await sapiClient.scrape({ scrapingParams });

        const markdown = this.transformResponse({ html: data });

        return {
          content: [
            {
              type: 'text',
              text: markdown,
            },
          ],
        };
      }
    );
  };
}

import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { ScrapingMCPParams } from 'types';
import { ScraperApiClient } from '../clients/scraper-api-client';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { zodFullResponse, zodGeo, zodJsRender, zodLocale, zodTokenLimit } from '../zod/zod-types';

export class ScrapeTool {
  static LARGE_CONTENT_SYMBOL_COUNT = 10_000;

  static isResponseOverLimit = (content: string) => {
    return content.length > this.LARGE_CONTENT_SYMBOL_COUNT;
  };

  static shouldTruncateResponse = ({
    content,
    shouldShowFullResponse,
  }: {
    content: string;
    shouldShowFullResponse?: boolean;
  }) => {
    if (shouldShowFullResponse) {
      return false;
    }

    return this.isResponseOverLimit(content);
  };

  static truncateResponse = ({ content, limit }: { content: string; limit: number }) => {
    return content.substring(0, limit);
  };

  static transformResponse = ({
    html,
    tokenLimit,
    shouldShowFullResponse,
  }: {
    html: string;
    tokenLimit?: number;
    shouldShowFullResponse?: boolean;
  }) => {
    const markdown = NodeHtmlMarkdown.translate(html, {});

    if (this.shouldTruncateResponse({ content: markdown, shouldShowFullResponse })) {
      const truncated = this.truncateResponse({
        content: markdown,
        limit: tokenLimit || this.LARGE_CONTENT_SYMBOL_COUNT,
      });

      return { markdown: truncated, isTruncated: true };
    }

    return { markdown, isTruncated: false };
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
        geo: zodGeo,
        locale: zodLocale,
        jsRender: zodJsRender,
        tokenLimit: zodTokenLimit,
        fullResponse: zodFullResponse,
      },
      async (scrapingParams: ScrapingMCPParams) => {
        const { data } = await sapiClient.scrape({ scrapingParams });

        const { markdown, isTruncated } = this.transformResponse({
          html: data,
          tokenLimit: scrapingParams.tokenLimit,
          shouldShowFullResponse: scrapingParams.fullResponse,
        });

        return {
          content: [
            {
              type: 'text',
              text: isTruncated
                ? `The website content is over ${this.LARGE_CONTENT_SYMBOL_COUNT} symbols, therefore, I have truncated the content. If you wish to obtain the full response, just say "full response". Alternatively, you can tell me a specific token limit.`
                : 'Full website content retrieved.',
            },
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

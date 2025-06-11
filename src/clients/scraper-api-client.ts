import axios from 'axios';
import { NodeHtmlMarkdown } from 'node-html-markdown';
import { ScraperApiResponseData } from './types';
import { ScrapingMCPParams } from 'types';

export class ScraperApiClient {
  auth: string;

  constructor({ auth }: { auth: string }) {
    this.auth = auth;
  }

  transformScrapingParams = ({ scrapingParams }: { scrapingParams: ScrapingMCPParams }) => {
    const { jsRender, ...rest } = scrapingParams;
    const transformed = { ...(jsRender && { headless: 'html' }), ...rest };

    return transformed;
  };

  transformResponse = ({ data }: { data: ScraperApiResponseData }) => {
    const content = data.results[0].content;

    if (typeof content !== 'string') {
      return JSON.stringify(content);
    }

    return content;
  };

  scrape = async ({ scrapingParams }: { scrapingParams: ScrapingMCPParams }) => {
    const transformedParams = this.transformScrapingParams({ scrapingParams });

    const { data: rawData } = await axios.request<ScraperApiResponseData>({
      url: 'https://scraper-api.decodo.com/v2/scrape',
      method: 'POST',
      headers: { authorization: `Basic ${this.auth}` },
      data: {
        ...transformedParams,
      },
    });

    const html = this.transformResponse({ data: rawData });

    const markdown = NodeHtmlMarkdown.translate(html, {});

    return { content: markdown };
  };
}

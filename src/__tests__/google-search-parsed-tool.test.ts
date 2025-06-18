import { GoogleSearchParsedTool } from '../tools/google-search-parsed-tool';
import * as MockGoogleSearchParsedResult from './mocks/google-search-parsed.json';

describe('google-search-parsed-tool', () => {
  describe('transformAutoParsedResponse', () => {
    it('reduces result symbol count significantly', () => {
      const original = JSON.stringify(MockGoogleSearchParsedResult);

      const stripped = GoogleSearchParsedTool.transformAutoParsedResponse({
        obj: MockGoogleSearchParsedResult,
      });

      expect(original.length).toBeGreaterThan(100_000);
      expect(stripped.length).toBeLessThan(10_000);
    });
  });
});

import cors from 'cors';
import express from 'express';
import { corsOptions, isAllowedOrigin } from '../cors';

describe('CORS origin allowlist', () => {
  it('allows requests with no origin', () => {
    expect(isAllowedOrigin(undefined)).toBe(true);
  });

  it('allows claude.ai and subdomains', () => {
    expect(isAllowedOrigin('https://claude.ai')).toBe(true);
    expect(isAllowedOrigin('https://www.claude.ai')).toBe(true);
  });

  it('allows anthropic.com and subdomains', () => {
    expect(isAllowedOrigin('https://anthropic.com')).toBe(true);
    expect(isAllowedOrigin('https://api.anthropic.com')).toBe(true);
  });

  it('allows local development origins', () => {
    expect(isAllowedOrigin('http://localhost:3000')).toBe(true);
    expect(isAllowedOrigin('http://127.0.0.1:6274')).toBe(true);
  });

  it('rejects unknown origins', () => {
    expect(isAllowedOrigin('https://evil.com')).toBe(false);
    expect(isAllowedOrigin('https://claude.ai.evil.com')).toBe(false);
  });
});

describe('CORS middleware behavior', () => {
  const withTestServer = async (
    run: (port: number) => Promise<void>
  ): Promise<void> => {
    const app = express();
    app.use(cors(corsOptions));
    app.get('/mcp', (_req, res) => {
      res.status(200).send('ok');
    });

    const server = app.listen(0);
    const port = (server.address() as { port: number }).port;

    try {
      await run(port);
    } finally {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }
  };

  it('does not return 500 for disallowed origins', async () => {
    await withTestServer(async (port) => {
      const response = await fetch(`http://127.0.0.1:${port}/mcp`, {
        headers: { Origin: 'https://evil.com' },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBeNull();
    });
  });

  it('returns CORS headers for allowed origins', async () => {
    await withTestServer(async (port) => {
      const response = await fetch(`http://127.0.0.1:${port}/mcp`, {
        headers: { Origin: 'https://claude.ai' },
      });

      expect(response.status).toBe(200);
      expect(response.headers.get('access-control-allow-origin')).toBe(
        'https://claude.ai'
      );
    });
  });
});

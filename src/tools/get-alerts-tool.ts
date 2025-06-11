import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { makeNWSRequest } from '../services/make-nws-request';
import { AlertsResponse } from '../types';
import { formatAlert } from '../services/format-alert';

export const registerGetAlertsTool = ({ server }: { server: McpServer }) => {
  server.tool(
    'get-alerts',
    'Get weather alerts for a state',
    {
      state: z.string().length(2).describe('Two-letter state code (e.g. CA, NY)'),
    },
    async ({ state }) => {
      const stateCode = state.toUpperCase();
      const alertsUrl = `https://api.weather.gov/alerts?area=${stateCode}`;
      const alertsData = await makeNWSRequest<AlertsResponse>(alertsUrl);

      if (!alertsData) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve alerts data',
            },
          ],
        };
      }

      const features = alertsData.features || [];
      if (features.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: `No active alerts for ${stateCode}`,
            },
          ],
        };
      }

      const formattedAlerts = features.map(formatAlert);
      const alertsText = `Active alerts for ${stateCode}:\n\n${formattedAlerts.join('\n')}`;

      return {
        content: [
          {
            type: 'text',
            text: alertsText,
          },
        ],
      };
    }
  );
};

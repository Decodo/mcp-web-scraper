import z from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp';
import { makeNWSRequest } from '../services/make-nws-request';
import { ForecastPeriod, ForecastResponse, PointsResponse } from '../types';

export const registerGetForecastTool = ({ server }: { server: McpServer }) => {
  server.tool(
    'get-forecast',
    'Get weather forecast for a location',
    {
      latitude: z.number().min(-90).max(90).describe('Latitude of the location'),
      longitude: z.number().min(-180).max(180).describe('Longitude of the location'),
    },
    async ({ latitude, longitude }) => {
      const pointsUrl = `https://api.weather.gov/points/${latitude.toFixed(4)},${longitude.toFixed(
        4
      )}`;
      const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

      if (!pointsData) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`,
            },
          ],
        };
      }

      const forecastUrl = pointsData.properties?.forecast;
      if (!forecastUrl) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to get forecast URL from grid point data',
            },
          ],
        };
      }

      const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
      if (!forecastData) {
        return {
          content: [
            {
              type: 'text',
              text: 'Failed to retrieve forecast data',
            },
          ],
        };
      }

      const periods = forecastData.properties?.periods || [];
      if (periods.length === 0) {
        return {
          content: [
            {
              type: 'text',
              text: 'No forecast periods available',
            },
          ],
        };
      }

      const formattedForecast = periods.map((period: ForecastPeriod) =>
        [
          `${period.name || 'Unknown'}:`,
          `Temperature: ${period.temperature || 'Unknown'}°${period.temperatureUnit || 'F'}`,
          `Wind: ${period.windSpeed || 'Unknown'} ${period.windDirection || ''}`,
          `${period.shortForecast || 'No forecast available'}`,
          '---',
        ].join('\n')
      );

      const forecastText = `Forecast for ${latitude}, ${longitude}:\n\n${formattedForecast.join(
        '\n'
      )}`;

      return {
        content: [
          {
            type: 'text',
            text: forecastText,
          },
        ],
      };
    }
  );
};

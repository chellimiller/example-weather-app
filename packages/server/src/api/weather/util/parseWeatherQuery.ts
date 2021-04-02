import { Request } from 'express';
import { Result, WeatherQuery, ServerError, ServerErrorCode } from '../../../types';

export default function parseWeatherQuery(request: Request): Result<WeatherQuery, ServerError> {
  const latQuery = request.query.lat;
  const lonQuery = request.query.lon;

  const lat = typeof latQuery === 'string' ? Number.parseFloat(latQuery) : Number.NaN;
  const lon = typeof lonQuery === 'string' ? Number.parseFloat(lonQuery) : Number.NaN;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return {
      error: {
        code: ServerErrorCode.API_WEATHER_QUERY_000,
        data: { query: request.query, lat, lon },
      }
    }
  }

  return {
    data: { lat, lon },
  };
}

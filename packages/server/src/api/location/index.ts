import https from 'https';
import path from 'path';
import { Request, Response } from 'express';
import { Asset, HttpResponseCode, Result, ServerError, ServerErrorCode, CityLocationQuery, WeatherApiConfig, LocationQueryType, City } from '../../types';
import { readAsset } from '../../util';
import validateWeatherApiConfig from '../../util/validateWeatherApiConfig';

function extractCityLocationQuery(request: Request): Result<CityLocationQuery, ServerError> {
  const qQuery = request.query.q;

  if (typeof qQuery !== 'string' && !Array.isArray(qQuery)) {
    return {
      error: {
        code: ServerErrorCode.API_LOCATION_QUERY_000,
        data: { q: qQuery },
      }
    }
  }

  if (typeof qQuery === 'string') {
    return {
      data: {
        type: LocationQueryType.CITY,
        city: qQuery,
      }
    }
  }

  // Technically, state might be the country code
  // Doesn't matter, we'll just put it pack into an array anyway.
  const [city, state, country] = qQuery;

  if (!state) {
    return {
      data: {
        type: LocationQueryType.CITY,
        // @todo #6 This is bad
        city: `${city}`,
      }
    }
  }

  if (!country) {
    return {
      data: {
        type: LocationQueryType.CITY,
        // @todo #6 This is bad
        city: `${city}`,
        state: `${state}`,
      }
    }
  }

  return {
    data: {
      type: LocationQueryType.CITY,
      // @todo #6 This is bad
      city: `${city}`,
      state: `${state}`,
      country: `${country}`,
    }
  }
}

function buildCityLocationUrl(query: CityLocationQuery, api: WeatherApiConfig): string {
  const q = [query.city, query.state, query.country].filter(value => !!value).join(',');
  const limit = 25;

  return `http://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${api.key}`;
}

function readWeatherApiConfig(): Promise<Asset<WeatherApiConfig>> {
  return readAsset(path.join('config', 'weather-api.json'), validateWeatherApiConfig);
}

function requestCities(query: CityLocationQuery): Promise<Result<City[], ServerError>> {
  return new Promise(async resolve => {
    const asset = await readWeatherApiConfig();

    if (asset.error) {
      resolve(asset);
      return;
    }

    const url = buildCityLocationUrl(query, asset.data);

    https.request(url, httpsResponse => {

      httpsResponse.on('data', (data) => {
        resolve({ data: JSON.parse(data) });
      })

      httpsResponse.on('error', (error) => {
        resolve({ error: { code: ServerErrorCode.API_LOCATION_EXTERNAL_000, data: error } });
      })
    })
  })
}

export function locationApiProxy(request: Request, response: Response<any, any>): Promise<void> {
  return new Promise(async resolve => {
    const query = extractCityLocationQuery(request);

    if (query.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(query.error.code);
      resolve();
      return;
    }

    const cities = await requestCities(query.data);

    if (cities.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(cities.error.code);
      resolve();
      return;
    }

    response.send(cities.data);
    resolve();
  })
}

import https from 'https';
import path from 'path';
import { Request, Response } from 'express';
import { Asset, HttpResponseCode, Result, ServerError, ServerErrorCode, Weather, WeatherApiConfig, WeatherQuery } from '../../types';
import { readAsset } from '../../util';
import validateWeatherApiConfig from '../../util/validateWeatherApiConfig';

function extractWeatherQuery(request: Request): Result<WeatherQuery, ServerError> {
  const latQuery = request.query.lat;
  const lonQuery = request.query.lon;

  const lat = typeof latQuery === 'string' ? Number.parseFloat(latQuery) : Number.NaN;
  const lon = typeof lonQuery === 'string' ? Number.parseFloat(lonQuery) : Number.NaN;

  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return {
      error: {
        code: ServerErrorCode.API_WEATHER_QUERY_000,
        data: { latQuery, lonQuery, lat, lon },
      }
    }
  }

  return {
    data: { lat, lon },
  };
}

function buildWeatherUrl({ lat, lon }: WeatherQuery, api: WeatherApiConfig): string {
  return `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${api.key}`;
}

function readWeatherApiConfig(): Promise<Asset<WeatherApiConfig>> {
  return readAsset(path.join('config', 'weather-api.json'), validateWeatherApiConfig);
}

function requestWeather(query: WeatherQuery): Promise<Result<Weather, ServerError>> {
  return new Promise(async resolve => {
    const asset = await readWeatherApiConfig();

    if (asset.error) {
      resolve(asset);
      return;
    }

    const url = buildWeatherUrl(query, asset.data);

    https.request(url, httpsResponse => {

      httpsResponse.on('data', (data) => {
        resolve({ data: JSON.parse(data) });
      })

      httpsResponse.on('error', (error) => {
        resolve({ error: { code: ServerErrorCode.API_WEATHER_EXTERNAL_000, data: error } });
      })
    })
  })
}

export function weatherApiProxy(request: Request, response: Response<any, any>): Promise<void> {
  return new Promise(async resolve => {
    const query = extractWeatherQuery(request);

    if (query.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(query.error.code);
      console.error(`ERROR ${query.error.code}: Bad request to '${request.url}'`, query.error);
      resolve();
      return;
    }

    const weather = await requestWeather(query.data);

    if (weather.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(weather.error.code);
      console.error(`ERROR ${weather.error.code}: Bad request to '${request.url}'`, weather.error);
      resolve();
      return;
    }

    response.send(weather.data);
    resolve();
  })
}

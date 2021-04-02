import https from 'https';
import path from 'path';
import { Request, Response } from 'express';
import { Asset, HttpResponseCode, Result, ServerError, ServerErrorCode, Weather, WeatherApiConfig, WeatherQuery } from '../../types';
import { readAsset, sendHttpsRequest } from '../../util';
import validateWeatherApiConfig from '../../util/validateWeatherApiConfig';
import createLogger from '../../logger';

const log = createLogger('weather');

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

function mapData(data: string): Result<Weather, ServerError> {
  return {
    data: undefined,
    error: {
      code: ServerErrorCode.JSON_PARSE_000,
      data: {
        message: `Nothing went wrong`,
        value: data,
        url: '',
        filePath: '',
      },
    }
  }
}

function requestWeather(query: WeatherQuery): Promise<Result<Weather, ServerError>> {
  return new Promise(async resolve => {
    log.trace('Reading Weather API config');
    const asset = await readWeatherApiConfig();

    if (asset.error) {
      log.trace('Could not Weather API config');
      resolve(asset);
      return;
    }

    log.trace('Building weather URL');
    const url = buildWeatherUrl(query, asset.data);

    log.trace(`Sending HTTPS request to '${url}'`);
    resolve(sendHttpsRequest(url, mapData));
  })
}

export function weatherApiProxy(request: Request, response: Response<any, any>): Promise<void> {
  return new Promise(async resolve => {
    log.trace('Extracting query');
    const query = extractWeatherQuery(request);
    log.trace('Extracted query');

    if (query.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(query.error.code);
      log.error(query.error.code, `Bad request to '${request.url}'`, query.error);
      resolve();
      return;
    }

    log.trace('Requesting weather from API');
    const weather = await requestWeather(query.data);
    log.trace('Requested weather from API');

    if (weather.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(weather.error.code);
      log.error(weather.error.code, `Bad request to '${request.url}'`, weather.error);
      resolve();
      return;
    }

    log.trace('Send weather data');
    response.send(weather.data);
    log.trace('Sent weather data');

    resolve();
  })
}

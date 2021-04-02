import https from 'https';
import path from 'path';
import { Request, Response } from 'express';
import { Asset, HttpResponseCode, ObjectValidationError, Result, ServerError, ServerErrorCode, Weather, WeatherApiConfig, WeatherQuery } from '../../types';
import { readAsset, sendHttpsRequest } from '../../util';
import validateWeatherApiConfig from '../../util/validateWeatherApiConfig';
import createLogger from '../../logger';
import { parseWeatherQuery, requestWeatherData } from './util';

const log = createLogger('handleWeatherApiRequest');

function readWeatherApiConfig(): Promise<Asset<WeatherApiConfig>> {
  return readAsset(path.join('config', 'weather-api.json'), validateWeatherApiConfig);
}

export default function handleWeatherApiRequest(request: Request, response: Response<any, any>): Promise<void> {
  return new Promise(async resolve => {

    const query = parseWeatherQuery(request);
    log.debug('Parsed query');

    if (query.error) {
      response.status(HttpResponseCode.BAD_REQUEST).send(query.error.code);
      log.error(query.error.code, `Bad request to '${request.url}'`, query.error);
      resolve();
      return;
    }

    log.debug('Reading Weather API config');
    const config = await readWeatherApiConfig();

    if (config.error) {
      response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(config.error.code);
      log.error(config.error.code, config.error.data.message, config.error);
      resolve();
      return;
    }

    log.debug('Requesting weather from API');
    const weather = await requestWeatherData(query.data, config.data);
    log.debug('Requested weather from API');

    if (weather.error) {
      if (weather.error.code === ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000) {
        response.status(weather.error.data.httpCode).send(weather.error.code);
        log.error(weather.error.code, `Cannot make request to '${request.url}'`, weather.error);
      } else {
        response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(weather.error.code);
        log.error(weather.error.code, `Unknown error making request to '${request.url}'`, weather.error);
      }

      resolve();
      return;
    }

    response.send(weather.data);
    log.debug('Sent weather data');

    resolve();
  })
}

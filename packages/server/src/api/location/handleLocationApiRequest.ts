import path from 'path';
import { Request, Response } from 'express';
import { Asset, HttpResponseCode, LocationQueryType, ServerErrorCode, WeatherApiConfig } from '../../types';
import { readAsset } from '../../util';
import validateWeatherApiConfig from '../../util/validateWeatherApiConfig';
import createLogger from '../../logger';
import { parseLocationQuery, requestCitiesByName, requestCityByZipcode } from './util';

const log = createLogger('handleLocationApiRequest');

function readWeatherApiConfig(): Promise<Asset<WeatherApiConfig>> {
  return readAsset(path.join('config', 'weather-api.json'), validateWeatherApiConfig);
}

export default function handleLocationApiRequest(request: Request, response: Response<any, any>): Promise<void> {
  return new Promise(async resolve => {

    const query = parseLocationQuery(request);
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

    if (query.data.type === LocationQueryType.ZIP_CODE) {
      log.debug('Requesting city by zipcode');
      const city = await requestCityByZipcode(query.data, config.data);

      if (city.error) {
        if (city.error.code === ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000) {
          response.status(city.error.data.httpCode).send(city.error.code);
          log.error(city.error.code, `Cannot make request to '${request.url}'`, city.error);
        } else {
          response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(city.error.code);
          log.error(city.error.code, `Unknown error making request to '${request.url}'`, city.error);
        }

        resolve();
        return;
      }

      response.send(city.data);
      resolve();
      return;
    }


    if (query.data.type === LocationQueryType.CITY) {
      log.debug('Requesting cities by name');
      const cities = await requestCitiesByName(query.data, config.data);

      if (cities.error) {
        if (cities.error.code === ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000) {
          response.status(cities.error.data.httpCode).send(cities.error.code);
          log.error(cities.error.code, `Cannot make request to '${request.url}'`, cities.error);
        } else {
          response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(cities.error.code);
          log.error(cities.error.code, `Unknown error making request to '${request.url}'`, cities.error);
        }

        resolve();
        return;
      }

      response.send(cities.data);
      resolve();
      return;
    }

    log.error(ServerErrorCode.API_LOCATION_QUERY_000, `Unsupported query type`, query);
    response.status(HttpResponseCode.BAD_REQUEST).send(ServerErrorCode.API_LOCATION_QUERY_000);

    resolve();
  })
}

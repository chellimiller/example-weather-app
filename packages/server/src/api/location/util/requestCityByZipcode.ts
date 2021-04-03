import createLogger from '../../../logger';
import { ZipcodeLocationQuery, WeatherApiConfig, Result, ServerError, WeatherApiConfigType, ServerErrorCode, City } from '../../../types';
import { sendHttpsRequest } from '../../../util';
import mapCity from './mapCity';

const log = createLogger('requestCityByZipcode');

function buildZipcodeUrl({ zipcode, country }: ZipcodeLocationQuery, api: WeatherApiConfig): Result<string, ServerError> {
  switch (api.type) {
    case WeatherApiConfigType.OPEN_WEATHER_MAP:
      const zipValue = [zipcode, country].filter(value => !!value).join(',');
      return {
        data: `https://api.openweathermap.org/geo/1.0/zip?zip=${zipValue}&appid=${api.key}`,
      }
    default:
      return {
        error: {
          code: ServerErrorCode.VALIDATION_000,
          data: {
            message: `Unsupported Weather API config type: '${api.type}'`,
            value: { zipcode, country, type: api.type },
          }
        }
      }
  }
}

export default function requestCityByZipcode(query: ZipcodeLocationQuery, config: WeatherApiConfig): Promise<Result<City, ServerError>> {
  return new Promise(async resolve => {
    const url = buildZipcodeUrl(query, config);

    if (url.error) {
      log.debug('Could not build URL');
      resolve(url);
      return;
    }

    const mapData = (data: string) => mapCity(data, config);

    resolve(sendHttpsRequest(url.data, mapData));
  })
}

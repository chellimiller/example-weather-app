import createLogger from '../../../logger';
import { WeatherApiConfig, Result, ServerError, WeatherApiConfigType, ServerErrorCode, City, CityLocationQuery } from '../../../types';
import { sendHttpsRequest } from '../../../util';
import mapCityList from './mapCityList';

const log = createLogger('requestCityByZipcode');

function buildCityUrl({ city, state, country }: CityLocationQuery, api: WeatherApiConfig): Result<string, ServerError> {
  switch (api.type) {
    case WeatherApiConfigType.OPEN_WEATHER_MAP:
      const q = [city, state, country].filter(value => !!value).join(',');
      const limit = 25;

      return {
        data: `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=${limit}&appid=${api.key}`,
      }
    default:
      return {
        error: {
          code: ServerErrorCode.VALIDATION_000,
          data: {
            message: `Unsupported Weather API config type: '${api.type}'`,
            value: { city, state, country, type: api.type },
          }
        }
      }
  }
}

export default function requestCitiesByName(query: CityLocationQuery, config: WeatherApiConfig): Promise<Result<City[], ServerError>> {
  return new Promise(async resolve => {
    const url = buildCityUrl(query, config);

    if (url.error) {
      log.debug('Could not build URL');
      resolve(url);
      return;
    }

    const mapData = (data: string) => mapCityList(data, config);

    resolve(sendHttpsRequest(url.data, mapData));
  })
}

import createLogger from '../../../logger';
import { Result, WeatherQuery, ServerError, ServerErrorCode, WeatherApiConfig, Weather, WeatherApiConfigType } from '../../../types';
import { sendHttpsRequest } from '../../../util';
import mapWeatherData from './mapWeatherData';

const log = createLogger('requestWeather');

function buildWeatherUrl({ lat, lon }: WeatherQuery, api: WeatherApiConfig): Result<string, ServerError> {

  switch (api.type) {
    case WeatherApiConfigType.OPEN_WEATHER_MAP:
      return {
        data: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${api.key}`,
      }
    default:
      return {
        error: {
          code: ServerErrorCode.VALIDATION_000,
          data: {
            message: `Unsupported Weather API config type: '${api.type}'`,
            value: { lat, lon, type: api.type },
          }
        }
      }
  }
}

export default function requestWeather(query: WeatherQuery, config: WeatherApiConfig): Promise<Result<Weather, ServerError>> {
  return new Promise(async resolve => {
    log.debug('Building weather URL');
    const url = buildWeatherUrl(query, config);

    if (url.error) {
      log.debug('Could not build Weather URL');
      resolve(url);
      return;
    }

    const mapData = (data: string) => mapWeatherData(data, config);

    log.debug(`Sending HTTPS request to '${url.data}'`);
    resolve(sendHttpsRequest(url.data, mapData));
  })
}
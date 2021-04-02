import { Result, Weather, ObjectValidationError, WeatherApiConfig, ServerErrorCode, WeatherApiConfigType } from '../../../types';
import { mapOneCallWeather } from '../open-weather-map';

export default function mapWeatherData(data: string, config: WeatherApiConfig): Result<Weather, ObjectValidationError> {
  let dataObject: object;

  try {
    dataObject = JSON.parse(data);
  } catch {
    return {
      error: {
        code: ServerErrorCode.JSON_PARSE_000,
        data: {
          message: `Cannot parse JSON object`,
          value: data,
        }
      }
    }
  }

  switch (config.type) {
    case WeatherApiConfigType.OPEN_WEATHER_MAP:
      return mapOneCallWeather(dataObject);
    default:
      return {
        error: {
          code: ServerErrorCode.VALIDATION_000,
          data: {
            message: `Unsupported Weather API config type: '${config.type}'`,
            value: data,
          }
        }
      }
  }
}
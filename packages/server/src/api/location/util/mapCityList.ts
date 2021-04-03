import { Result, ObjectValidationError, WeatherApiConfig, ServerErrorCode, WeatherApiConfigType, City } from '../../../types';
import { mapDirectGeocodingCityList } from '../open-weather-map';

export default function mapCityList(data: string, config: WeatherApiConfig): Result<City[], ObjectValidationError> {
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
      return mapDirectGeocodingCityList(dataObject);
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
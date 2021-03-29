import { Result } from '../types';
import { readAsset } from '../util';

export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

export type WeatherApiConfig = {
  type: WeatherApiConfigType;
  key: string;
}

function validateWeatherApiConfig(config: any): Result<WeatherApiConfig, string> {
  if (typeof config !== 'object') {
    return {
      data: undefined,
      error: `Weather API Config: Type of 'config' should be 'object' but is '${typeof config}'`,
    };
  }

  if (typeof config.type !== 'string') {
    return {
      data: undefined,
      error: `Weather API Config: Type of 'config.type' should be 'string' but is '${typeof config.type}'`,
    };
  }

  if (typeof config.key !== 'string') {
    return {
      data: undefined,
      error: `Weather API Config: Type of 'config.key' should be 'string' but is '${typeof config.key}'`,
    };
  }

  if (!Object.values(WeatherApiConfigType).includes(config.type)) {
    return {
      data: undefined,
      error: `Weather API Config: 'config.type' should be one of [${Object.values(WeatherApiConfigType)}] but is '${config.key}'`,
    };
  }

  return {
    data: config,
    error: undefined,
  };
}

export default function readWeatherApiConfig(): Promise<Result<WeatherApiConfig, string>> {
  return readAsset('config/weather-api.json').then(
    (asset) => {
      if (asset.error) {
        return {
          data: undefined,
          error: `Weather API Config: Cannot read config '${asset.error.message}'`,
        };
      }

      try {
        return validateWeatherApiConfig(JSON.parse(asset.content));
      } catch (error) {
        console.error('Weather API Config: Cannot parse config', error);
        return {
          data: undefined,
          error: `Weather API Config: Cannot parse config '${error}'`,
        };
      }
    },
    (error) => {
      console.error('Weather API Config: Unknown error reading config', error);
      return {
        data: undefined,
        error: `Weather API Config: Unknown error reading config '${error}'`,
      };
    }
  )
}
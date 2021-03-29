import { AssetValidator, ReadAssetErrorType } from './readAsset';

export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

export type WeatherApiConfig = {
  type: WeatherApiConfigType;
  key: string;
}

const validateWeatherApiConfig: AssetValidator<WeatherApiConfig> = (config: any) => {
  if (typeof config !== 'object') {
    const message = `Invalid Weather API Config: Type of 'config' should be 'object' but is '${typeof config}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (typeof config.type !== 'string') {
    const message = `Invalid Weather API Config: Type of 'config.type' should be 'string' but is '${typeof config.type}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (typeof config.key !== 'string') {
    const message = `Invalid Weather API Config: Type of 'config.key' should be 'string' but is '${typeof config.key}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  if (!Object.values(WeatherApiConfigType).includes(config.type)) {
    const message = `Invalid Weather API Config: 'config.type' should be one of [${Object.values(WeatherApiConfigType)}] but is '${config.key}'`;
    return {
      data: undefined,
      error: {
        type: ReadAssetErrorType.VALIDATION,
        message,
        details: message,
      },
    };
  }

  return {
    data: config,
    error: undefined,
  };
}

export default validateWeatherApiConfig;

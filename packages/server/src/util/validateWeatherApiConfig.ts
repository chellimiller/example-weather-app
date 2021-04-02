import { AssetValidator, ReadAssetValidationError, ServerErrorCode, WeatherApiConfig, WeatherApiConfigType } from '../types';

type CreateErrorResultOptions = {
  code: ReadAssetValidationError['code'];
  message: string;
}

/**
 * Validate that the `config` provided matches the `WeatherApiConfig` type definition.
 *
 * @param config Unvalidated Weather API configuration
 * @returns Result from validating the Weather API configuration
 */
const validateWeatherApiConfig: AssetValidator<WeatherApiConfig> = (config: any) => {

  const createErrorResult = ({ code, message }: CreateErrorResultOptions) => ({
    data: undefined,
    error: {
      code,
      data: {
        message: `Invalid Weather API Config: ${message}`,
        value: config,
      },
    }
  })

  if (typeof config === 'string') {
    let configObject;
    try {
      configObject = JSON.parse(config);
    } catch {
      return createErrorResult({
        code: ServerErrorCode.READ_ASSET_VALIDATE_004,
        message: `Cannot parse JSON object`,
      })
    }

    if (typeof configObject === 'object') {
      return validateWeatherApiConfig(configObject);
    }

    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_004,
      message: `Result from JSON.parse is not an object`,
    })
  }

  if (!config) {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_002,
      message: `Falsy config value`,
    })
  }

  if (typeof config !== 'object') {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_001,
      message: `Type of 'config' should be 'object' but is '${typeof config}'`,
    })
  }

  if (!config.type) {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_002,
      message: `Missing config.type`,
    })
  }

  if (!config.key) {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_002,
      message: `Missing config.key`,
    })
  }

  if (typeof config.type !== 'string') {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_002,
      message: `Type of 'config.type' should be 'string' but is '${typeof config.type}'`,
    })
  }

  if (typeof config.key !== 'string') {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_002,
      message: `Type of 'config.key' should be 'string' but is '${typeof config.key}'`,
    })
  }

  if (!Object.values(WeatherApiConfigType).includes(config.type)) {
    return createErrorResult({
      code: ServerErrorCode.READ_ASSET_VALIDATE_003,
      message: `'config.type' should be one of [${Object.values(WeatherApiConfigType)}] but is '${config.key}'`,
    })
  }

  return {
    data: config,
    error: undefined,
  };
}

export default validateWeatherApiConfig;

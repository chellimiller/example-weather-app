import React, { createContext, useEffect, useState } from 'react'
import { getWeatherApiConfig } from '../api';
import { DataLoadResult, ErrorResult, InitRequiredResult, LoadingResult, ResultStatus, UnexpectedErrorResult, WeatherApiConfig } from '../types';

/**
 * Result from requesting the `WeatherApiConfig` from the server.
 */
type WeatherApiConfigResult = DataLoadResult<WeatherApiConfig> | ErrorResult | LoadingResult | InitRequiredResult | UnexpectedErrorResult;

/**
 * Initial result for requesting the `WeatherApiConfig` from the server.
 * This result is used when the request hasn't been made yet.
 */
const DEFAULT_RESULT: InitRequiredResult = {
  status: ResultStatus.INIT_REQUIRED,
  message: `Weather API configuration must be loaded from server.`,
};

/**
 * Result returned when the `WeatherApiConfig` has been requested from the server
 * but the client hasn't yet recieved the response.
 */
const LOADING_RESULT: LoadingResult = {
  status: ResultStatus.LOADING,
  message: 'Loading Weather API configuration',
};

/**
 * Context that holds the result from requesting the `WeatherApiConfig` from the server.
 */
const WeatherApiConfigContext = createContext<WeatherApiConfigResult>(DEFAULT_RESULT);

/**
 * Wrap the `Component` in a provider that supplies the `WeatherApiConfigResult` to it's children.
 * @param Component Component that is wrapped with the `WeatherApiConfigContext`
 * @returns Component that provides the `WeatherApiConfigResult` to it's children.
 */
export function withWeatherApiConfig<P>(Component: React.FC<P>): React.FC<P> {
  return (props: P) => {
    const [value, setValue] = useState<WeatherApiConfigResult>(DEFAULT_RESULT);

    useEffect(() => {
      getWeatherApiConfig().then(setValue);
      setValue(LOADING_RESULT);
    }, [])

    return (
      <WeatherApiConfigContext.Provider value={value}>
        <Component {...props} />
      </WeatherApiConfigContext.Provider>
    );
  }
}

/**
 * Use the result from requesting the `WeatherApiConfig` from the server.
 *
 * @returns WeatherApiConfigResult from the `WeatherApiConfigContext`.
 */
export function useWeatherApiConfig(): WeatherApiConfigResult {
  return React.useContext(WeatherApiConfigContext);
}
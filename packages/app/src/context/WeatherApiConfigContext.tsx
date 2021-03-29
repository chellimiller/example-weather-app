import React, { createContext, useEffect, useState } from 'react'
import { DataLoadResult, ErrorResult, InitRequiredResult, LoadingResult, ResultStatus, UnexpectedErrorResult } from '../types';

export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

export type WeatherApiConfig = {
  type: WeatherApiConfigType;
  key: string;
}

type WeatherApiConfigResult = DataLoadResult<WeatherApiConfig> | ErrorResult | LoadingResult | InitRequiredResult | UnexpectedErrorResult;

const DEFAULT_RESULT: InitRequiredResult = {
  status: ResultStatus.INIT_REQUIRED,
  message: `Weather API configuration must be loaded from server. Send a GET request to '/api/weather'.`,
};

const LOADING_RESULT: LoadingResult = {
  status: ResultStatus.LOADING,
  message: 'Loading Weather API configuration',
};

const WeatherApiConfigContext = createContext<WeatherApiConfigResult>(DEFAULT_RESULT);

const fetchWeatherApiConfig = (): Promise<DataLoadResult<WeatherApiConfig> | ErrorResult | UnexpectedErrorResult> => fetch('/api/weather')
  .then(
    (response) => {
      if (response.ok) {
        return response.json().then(
          (data) => ({
            status: ResultStatus.DATA_LOAD,
            message: 'Successfully accessed Weather API configuration',
            data,
            // @todo Figure out why this needs to be casted as any.
          }) as any,
          (error) => ({
            status: ResultStatus.ERROR,
            message: 'Cannot parse Weather API configuration',
            error,
          }),
        );
      }

      const message = response.text().then(text => text, error => `${error}`);

      return ({
        status: ResultStatus.ERROR,
        message: `Cannot access Weather API configuration: '${message}'`,
        error: response,
      })
    },
    (error) => ({
      status: ResultStatus.ERROR,
      message: 'Cannot access Weather API configuration due to unknown error during request',
      error,
    }),
  )
  .catch(
    (error) => ({
      status: ResultStatus.UNEXPECTED_ERROR,
      message: 'Cannot access Weather API configuration due to unexpected and uncaught error during request',
      error,
    }),
  );

export function withWeatherApiConfig<P>(Component: React.FC<P>): React.FC<P> {
  return (props: P) => {
    const [value, setValue] = useState<WeatherApiConfigResult>(DEFAULT_RESULT);

    useEffect(() => {
      setValue(LOADING_RESULT);
      fetchWeatherApiConfig().then(
        setValue,
        (error) => setValue({
          status: ResultStatus.UNEXPECTED_ERROR,
          message: 'Cannot access Weather API config due to unknown error',
          error,
        }),
      );
    }, [])

    return (
      <WeatherApiConfigContext.Provider value={value}>
        <Component {...props} />
      </WeatherApiConfigContext.Provider>
    );
  }
}

export function useWeatherApiConfig(): WeatherApiConfigResult {
  return React.useContext(WeatherApiConfigContext);
}
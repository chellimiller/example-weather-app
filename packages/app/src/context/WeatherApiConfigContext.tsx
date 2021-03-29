import React, { createContext, useEffect, useState } from 'react'
import { getWeatherApiConfig } from '../api';
import { DataLoadResult, ErrorResult, InitRequiredResult, LoadingResult, ResultStatus, UnexpectedErrorResult, WeatherApiConfig } from '../types';

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

export function useWeatherApiConfig(): WeatherApiConfigResult {
  return React.useContext(WeatherApiConfigContext);
}
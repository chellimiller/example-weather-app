import { useEffect, useState } from 'react';
import { getCurrentWeather } from '../api';
import { FetchResult } from '../api/sendFetchRequest';
import { useWeatherApiConfig } from '../context/WeatherApiConfigContext';
import { LoadingResult, Location, ResultStatus, Weather } from '../types';

type CurrentWeatherResult = FetchResult<Weather> | LoadingResult;

const LOADING_RESULT: LoadingResult = {
  status: ResultStatus.LOADING,
  message: 'Loading Current Weather...',
};

export default function useCurrentWeather(location: Location): CurrentWeatherResult {
  const [result, setResult] = useState<CurrentWeatherResult>(LOADING_RESULT);
  const apiConfig = useWeatherApiConfig();

  useEffect(() => {
    if (apiConfig.status === ResultStatus.DATA_LOAD) {
      setResult(LOADING_RESULT);
      getCurrentWeather(location, apiConfig.data).then(setResult);
    } else {
      setResult(apiConfig as CurrentWeatherResult);
    }

  }, [apiConfig, location]);

  return result;
}
import React, { useEffect } from 'react';
import { getCurrentWeather } from './api';
import { useWeatherApiConfig } from './context/WeatherApiConfigContext';
import { LocationType, ResultStatus } from './types';

/**
 * @todo #6 Remove this component.
 */
const About: React.FC = () => {

  const weatherApiConfig = useWeatherApiConfig();

  // @todo #6 Move this into a `useWeatherByCity` hook.
  useEffect(() => {
    if (weatherApiConfig.status === ResultStatus.DATA_LOAD) {
      getCurrentWeather({ city: 'London', type: LocationType.CITY_NAME }, weatherApiConfig.data).then(result => {
        if (result.status === ResultStatus.DATA_LOAD) {
          if (result.data) {
            console.log('London', result.data);
          } else {
            console.error(result.data, result.data);
          }
        } else {
          console.error(result);
        }
      })
    }
  }, [weatherApiConfig])

  switch (weatherApiConfig.status) {
    case ResultStatus.DATA_LOAD:
      return (
        <h1>This is an app that accesses the Weather API: {weatherApiConfig.data.type}</h1>
      );
    default:
      return (
        <h1>{weatherApiConfig.message}</h1>
      );
  }
}

export default About;

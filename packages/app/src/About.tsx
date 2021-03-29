import React, { useEffect } from 'react';
import { getWeatherByCity } from './api';
import { useWeatherApiConfig } from './context/WeatherApiConfigContext';
import { ResultStatus } from './types';

/**
 * @todo #6 Remove this component.
 */
const About: React.FC = () => {

  const weatherApiConfig = useWeatherApiConfig();

  // @todo #6 Move this into a `useWeatherByCity` hook.
  useEffect(() => {
    if (weatherApiConfig.status === ResultStatus.DATA_LOAD) {
      getWeatherByCity('London', weatherApiConfig.data).then(result => {
        if (result.status === ResultStatus.DATA_LOAD) {
          if (result.data.ok) {
            console.log('London', result.data.json());
          } else {
            console.error(result.data.text(), result.data);
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

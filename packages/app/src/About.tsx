import React from 'react';
import { useWeatherApiConfig } from './context/WeatherApiConfigContext';
import { ResultStatus } from './types';

const About: React.FC = () => {

  const weatherApiConfig = useWeatherApiConfig();

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

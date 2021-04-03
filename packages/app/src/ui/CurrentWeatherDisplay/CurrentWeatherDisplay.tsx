import React from 'react';
import { ResultStatus, Weather } from '../../types';

type CurrentWeatherDisplayProps = {
  weather: Weather;
}

const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = (props) => {
  return (
    <div>
      Temp: {props.weather.current.temperature}
    </div>
  );
}

export default CurrentWeatherDisplay;

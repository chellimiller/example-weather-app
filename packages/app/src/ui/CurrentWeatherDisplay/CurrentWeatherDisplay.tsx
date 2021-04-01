import React from 'react';
import useCurrentWeather from '../../hooks/useCurrentWeather';
import { Location, ResultStatus } from '../../types';

type CurrentWeatherDisplayProps = {
  location: Location;
}

const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = (props) => {

  const weather = useCurrentWeather(props.location);

  if (weather.status === ResultStatus.DATA_LOAD) {
    return (
      <div>
        Temp: {weather.data.temperature.main}
      </div>
    );
  }

  return (
    <div>
      {weather.message}
    </div>
  )
}

export default CurrentWeatherDisplay;

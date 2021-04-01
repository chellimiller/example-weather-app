import React, { useState } from 'react';
import { withWeatherApiConfig } from './context/WeatherApiConfigContext';
import useCurrentWeather from './hooks/useCurrentWeather';
import { Location, LocationType, ResultStatus, Weather } from './types';
import LocationSearch from './ui/LocationSearch';
import './App.css';

const calculateBackgroundTemperature = (weather?: Weather) => {
  if (!weather) return '';
  // These are inexact and based on personal preference
  // Freezing is pretty close to 0°C or 32°F
  if (weather.temperature.feelsLike <= 274) return 'bg-freezing';
  if (weather.temperature.feelsLike <= 284) return 'bg-cold';
  if (weather.temperature.feelsLike <= 293) return 'bg-cool';
  if (weather.temperature.feelsLike <= 300) return 'bg-moderate';
  if (weather.temperature.feelsLike <= 307) return 'bg-warm';
  return 'bg-hot';
}
const toCelsius = (kelvin: number) => kelvin - 273.15;
const toFahrenheit = (kelvin: number) => (toCelsius(kelvin) * 9 / 5) + 32;

const DEFAULT_LOCATION: Location = {
  type: LocationType.CITY_NAME,
  city: 'Scottsdale',
}

const App: React.FC = withWeatherApiConfig(() => {
  const [location, setLocation] = useState<Location>();

  const doUpdateLocation = (_e: unknown, value?: Location) => setLocation(value);
  const weatherResult = useCurrentWeather(location || DEFAULT_LOCATION);
  const weather = weatherResult.status === ResultStatus.DATA_LOAD ? weatherResult.data : undefined;

  const bgClass = calculateBackgroundTemperature(weather);

  return (
    <div className={['app', 'flex-center-content', bgClass].join(' ')}>
      <LocationSearch onSubmit={doUpdateLocation} />
      <div>
        {weather && Math.round(toFahrenheit(weather.temperature.main))}
      </div>
    </div>
  );
});

export default App;

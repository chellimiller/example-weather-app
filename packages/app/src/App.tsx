import React from 'react';
import { LocationQuery, ResultStatus, Weather } from './types';
import LocationSearch from './ui/LocationSearch';
import './App.css';
import { setLocation, withStore } from './store';
import { useSelectedCity, useSelectedCityWeather } from './store/hooks';
import { useDispatch } from 'react-redux';

const calculateBackgroundTemperature = (weather?: Weather) => {
  if (!weather) return 'bg-default';
  // These are inexact and based on personal preference
  // Freezing is pretty close to 0°C or 32°F
  if (weather.current.feelsLike <= 274) return 'bg-freezing';
  if (weather.current.feelsLike <= 284) return 'bg-cold';
  if (weather.current.feelsLike <= 293) return 'bg-cool';
  if (weather.current.feelsLike <= 300) return 'bg-moderate';
  if (weather.current.feelsLike <= 307) return 'bg-warm';
  return 'bg-hot';
}
const toCelsius = (kelvin: number) => kelvin - 273.15;
const toFahrenheit = (kelvin: number) => (toCelsius(kelvin) * 9 / 5) + 32;

const App: React.FC = withStore(() => {
  const dispatch = useDispatch();

  const doUpdateLocation = (_e: unknown, value?: LocationQuery) => {
    if (value) dispatch(setLocation(value));
  }

  const city = useSelectedCity();
  const weatherResult = useSelectedCityWeather();
  const weather = weatherResult && weatherResult.status === ResultStatus.DATA_LOAD ? weatherResult.data : undefined;

  const bgClass = calculateBackgroundTemperature(weather);

  return (
    <div className={['app', 'flex-center-content', bgClass].join(' ')}>
      <LocationSearch onSubmit={doUpdateLocation} />
      <div>
        {weather && Math.round(toFahrenheit(weather.current.temperature))}
        {weatherResult && weatherResult.message}
        {city ? `${city.name}, ${city.country}` : 'none'}
      </div>
    </div>
  );
});

export default App;

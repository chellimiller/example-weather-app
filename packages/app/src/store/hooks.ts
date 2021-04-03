import { useSelector } from 'react-redux';
import { City } from '../types';
import { selectSelectedCity, selectSelectedCityWeatherQueryResult } from './selectors';
import { WeatherQueryResult } from './types';

export function useSelectedCity(): City | undefined {
  return useSelector(
    selectSelectedCity,
    (a: City | undefined, b: City | undefined) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      if (a === b) return true;
      return a.lat === b.lat && a.lon === b.lon && a.name === b.name && a.country === b.country && a.state === b.state;
    },
  )
}

export function useSelectedCityWeather(): WeatherQueryResult | undefined {
  return useSelector(selectSelectedCityWeatherQueryResult)
}
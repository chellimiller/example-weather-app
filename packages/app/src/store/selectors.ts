import { Selector } from 'react-redux';
import { City, LocationQuery, WeatherQuery } from '../types';
import { AppState, CityId, LocationQueryResult, WeatherQueryResult } from './types';
import { createCityId, createLocationQueryId } from './util';

export const selectSelectedCityId: Selector<AppState, CityId | undefined> = state => state.location.selectedCityId;

export const selectCity = (state: AppState, cityId: CityId): City => state.location.cities[cityId];

export const selectSelectedCity: Selector<AppState, City | undefined> = state => {
  const cityId = selectSelectedCityId(state);
  return cityId ? selectCity(state, cityId) : undefined;
}

export const selectWeatherQueryResult = (state: AppState, query: CityId | City | WeatherQuery): WeatherQueryResult | undefined => {
  const cityId = typeof query === 'string' ? query : createCityId(query);
  return state.weather.queries[cityId];
}

export const selectSelectedCityWeatherQueryResult: Selector<AppState, WeatherQueryResult | undefined> = state => {
  const cityId = selectSelectedCityId(state);
  return cityId ? selectWeatherQueryResult(state, cityId) : undefined;
}

export const selectLocationQueryResult = (state: AppState, query: LocationQuery): LocationQueryResult | undefined => {
  const queryId = createLocationQueryId(query);
  return state.location.queries[queryId];
}

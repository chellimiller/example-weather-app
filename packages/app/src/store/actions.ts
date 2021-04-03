import { Action } from 'redux';
import { City, DataLoadResult, ErrorResult, InitRequiredResult, LoadingResult, LocationQuery, UnexpectedErrorResult, Weather, WeatherQuery } from '../types';

export enum AppActionType {
  SET_SELECTED_CITY = 'SET_SELECTED_CITY',
  SET_LOCATION_QUERY_RESULT = 'SET_LOCATION_QUERY_RESULT',
  SET_WEATHER_RESULT = 'SET_WEATHER_RESULT',
  SET_LOCATION = 'SET_LOCATION',
}

type SetSelectedCityAction = Action<AppActionType.SET_SELECTED_CITY> & {
  city: City;
}

export const setSelectedCity = (city: City): SetSelectedCityAction => ({
  type: AppActionType.SET_SELECTED_CITY,
  city,
})

type SetLocationQueryAction = Action<AppActionType.SET_LOCATION_QUERY_RESULT> & {
  query: LocationQuery;
  result: LocationQueryResult
}

type LocationQueryResult = InitRequiredResult | LoadingResult | DataLoadResult<City | City[]> | ErrorResult | UnexpectedErrorResult;
export const setLocationQuery = ({ query, result }: Omit<SetLocationQueryAction, 'type'>): SetLocationQueryAction => ({
  type: AppActionType.SET_LOCATION_QUERY_RESULT,
  query,
  result,
})

type SetWeatherResultAction = Action<AppActionType.SET_WEATHER_RESULT> & {
  query: WeatherQuery;
  result: WeatherResult
}

type WeatherResult = InitRequiredResult | LoadingResult | DataLoadResult<Weather> | ErrorResult | UnexpectedErrorResult;
export const setWeatherResult = ({ query, result }: Omit<SetWeatherResultAction, 'type'>): SetWeatherResultAction => ({
  type: AppActionType.SET_WEATHER_RESULT,
  query,
  result,
})


type SetLocationAction = Action<AppActionType.SET_LOCATION> & {
  query: LocationQuery;
}

export const setLocation = (query: LocationQuery): SetLocationAction => ({
  type: AppActionType.SET_LOCATION,
  query,
})


export type AppAction = SetSelectedCityAction | SetLocationQueryAction | SetLocationAction | SetWeatherResultAction;
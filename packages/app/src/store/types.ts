import { Weather, City, DataLoadResult, ErrorResult, InitRequiredResult, LoadingResult, UnexpectedErrorResult } from '../types';

export type CityId = string;

export type LocationQueryId = string;

export type LocationQueryResult = InitRequiredResult | LoadingResult | DataLoadResult<CityId | CityId[]> | ErrorResult | UnexpectedErrorResult;

export type LocationState = {
  cities: Record<CityId, City>;
  selectedCityId?: CityId;
  latestQuery?: LocationQueryId;
  queries: Record<LocationQueryId, LocationQueryResult>;
}

type WeatherResult = InitRequiredResult | LoadingResult | DataLoadResult<Weather> | ErrorResult | UnexpectedErrorResult;

export type WeatherQueryResult = WeatherResult & {
  updated: number;
};

export type WeatherState = {
  queries: Record<CityId, WeatherQueryResult>;
};

export type AppState = {
  location: LocationState;
  weather: WeatherState;
}

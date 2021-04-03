import { City, LocationQuery, WeatherQuery } from '../types';
import { CityId, LocationQueryId } from './types';


export const createCityId = ({ lat, lon }: WeatherQuery | City): CityId => `{lat:${lat};lon:${lon}}` as CityId;

export const createLocationQueryId = (query: LocationQuery): LocationQueryId => {
  if (query.zipcode) {
    return (query.country ? `{zip:${query.zipcode};country:${query.country}}` : `{zip:${query.zipcode}}`) as LocationQueryId;
  }

  if (query.state && query.country) {
    return `{city:${query.city};state:${query.state};country:${query.country}}` as LocationQueryId;
  }

  if (query.state) {
    return `{city:${query.city};state:${query.state}}` as LocationQueryId;
  }

  if (query.country) {
    return `{city:${query.city};country:${query.country}}` as LocationQueryId;
  }

  return `{city:${query.city}}` as LocationQueryId;
};
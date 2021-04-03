
import { City, LocationQuery, ResultStatus } from '../types';
import requestCitiesByName from './requestCitiesByName';
import requestCityByZipcode from './requestCityByZipcode';
import { FetchResult } from './sendFetchRequest';

export default function requestCities(query: LocationQuery): Promise<FetchResult<City | City[]>> {
  if (query.zipcode) {
    return requestCityByZipcode(query);
  }

  if (query.city) {
    return requestCitiesByName(query);
  }

  return Promise.resolve({
    status: ResultStatus.ERROR,
    message: 'Invalid query',
    error: query,
  })
}
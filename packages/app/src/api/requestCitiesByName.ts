import { City, CityLocationQuery, ResultStatus } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

export default function requestCitiesByName(query: CityLocationQuery): Promise<FetchResult<City[]>> {
  const url = `/api/location?q=${[query.city, query.state, query.country].filter(value => !!value).join(',')}`;

  return sendFetchRequest(url).then(
    (result: FetchResult<Response>) => {
      if (result.status === ResultStatus.DATA_LOAD) {
        return result.data.json().then(
          (data) => ({
            status: ResultStatus.DATA_LOAD,
            message: 'Success',
            data,
          }),

          // @todo #5 Figure out why this needs to be casted as any.
          (error) => ({
            status: ResultStatus.ERROR,
            message: 'Cannot parse cities',
            error,
          } as any),
        )
      }

      return result;
    }
  );
}
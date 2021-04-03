import { City, ResultStatus, ZipcodeLocationQuery } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

export default function requestCityByZipcode(query: ZipcodeLocationQuery): Promise<FetchResult<City>> {
  const url = `/api/location?zip=${[query.zipcode, query.country].filter(value => !!value).join(',')}`;

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
            message: 'Cannot parse city',
            error,
          } as any),
        )
      }

      return result;
    }
  );
}
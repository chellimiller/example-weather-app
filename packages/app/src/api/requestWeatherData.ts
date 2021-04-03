import { ResultStatus, Weather, WeatherQuery } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

export default function requestWeatherData(query: WeatherQuery): Promise<FetchResult<Weather>> {
  const url = `/api/weather?lat=${query.lat}&lon=${query.lon}`;

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
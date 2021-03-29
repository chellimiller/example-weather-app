import { ResultStatus, WeatherApiConfig, WeatherApiConfigType } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

export default function getWeatherApiConfig(): Promise<FetchResult<WeatherApiConfig>> {
  return sendFetchRequest('http://localhost:3000/api/weather').then(
    (result: FetchResult<Response>) => {
      if (result.status === ResultStatus.DATA_LOAD) {
        return result.data.json().then(
          (data) => ({
            status: ResultStatus.DATA_LOAD,
            message: 'Successfully accessed Weather API configuration',
            data,
          }),

          // @todo Figure out why this needs to be casted as any.
          (error) => ({
            status: ResultStatus.ERROR,
            message: 'Cannot parse Weather API configuration',
            error,
          } as any),
        )
      }

      return result;
    }
  );
}
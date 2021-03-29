import { ResultStatus, WeatherApiConfig } from '../types';
import sendFetchRequest, { FetchResult } from './sendFetchRequest';

/**
 * Request the `WeatherApiConfig` from the server.
 *
 * @returns Promise with result from accessing the `WeatherApiConfig` from the server.
 */
export default function getWeatherApiConfig(): Promise<FetchResult<WeatherApiConfig>> {
  return sendFetchRequest('/api/weather').then(
    (result: FetchResult<Response>) => {
      if (result.status === ResultStatus.DATA_LOAD) {
        return result.data.json().then(
          (data) => ({
            status: ResultStatus.DATA_LOAD,
            message: 'Successfully accessed Weather API configuration',
            data,
          }),

          // @todo #5 Figure out why this needs to be casted as any.
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
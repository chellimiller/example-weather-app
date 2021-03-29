import { DataLoadResult, ErrorResult, ResultStatus, UnexpectedErrorResult } from '../types';

/** Result from sending a `fetch` request. */
export type FetchResult<T = Response> = DataLoadResult<T> | ErrorResult | UnexpectedErrorResult;

/**
 * Sends a request using the `fetch` API and returns a `FetchResult`.
 *
 * @param url URL to send the request to
 * @param init Additional parameters
 * @returns Promise with result from the fetch request.
 */
export default function sendFetchRequest(url: string, init?: RequestInit | undefined): Promise<FetchResult> {
  return fetch(url, init).then(
    (response) => {
      if (response.ok) {
        // @todo #5 Figure out why this needs to be casted as any.
        return {
          status: ResultStatus.DATA_LOAD,
          data: response,
          message: `Received response from '${url}'`,
        } as any;
      }

      return {
        status: ResultStatus.ERROR,
        message: `Cannot access '${url}' due to unknown request error`,
        error: response,
      };
    },
    (error) => ({
      status: ResultStatus.ERROR,
      message: `Cannot access '${url}' due to unknown request error`,
      error,
    }),
  ).catch(
    (error) => ({
      status: ResultStatus.UNEXPECTED_ERROR,
      message: `Cannot access '${url}' due to unexpected and uncaught request error`,
      error,
    }),
  );
}
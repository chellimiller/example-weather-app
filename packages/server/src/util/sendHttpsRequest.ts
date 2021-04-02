import https, { RequestOptions } from 'https';
import { URL } from 'url';
import createLogger from '../logger';
import { HttpResponseCode, ObjectValidationError, Result, ServerError, ServerErrorCode } from '../types';

type Options = RequestOptions | string | URL;

export type DataMapper<T = string> = (data: string) => Result<T, ObjectValidationError>;

const log = createLogger('sendHttpsRequest');

function sendHttpsRequest<T>(options: Options, mapData: DataMapper<T>): Promise<Result<T, ServerError>> {
  return new Promise(async resolve => {
    log.debug('Creating request', options);

    let httpCode: number = HttpResponseCode.INTERNAL_SERVER_ERROR;

    const request = https.request(options, httpsResponse => {
      const data: string[] = [];

      httpCode = httpsResponse.statusCode || HttpResponseCode.INTERNAL_SERVER_ERROR;

      httpsResponse.on('data', (chunk) => {
        log.debug(`Received data chunk`);
        data.push(chunk)
      })

      httpsResponse.on('end', () => {
        log.debug(`Response ended`);

        try {
          const mappedDataResult: Result<T, ServerError> = mapData(data.join(''));
          log.debug(`Mapped data`);
          resolve(mappedDataResult)
        } catch (error) {
          log.error(ServerErrorCode.UNKNOWN_ERROR, 'Could not map data', error);
          resolve({
            error: {
              code: ServerErrorCode.UNKNOWN_ERROR,
              data: {
                error,
              }
            }
          });
        }
      })
    })

    request.on('error', (error) => {
      log.debug(`Request error`);
      resolve({
        error: {
          code: ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000,
          data: {
            httpCode,
            error,
          }
        }
      });
    });

    request.end();
  })
}

export default sendHttpsRequest;
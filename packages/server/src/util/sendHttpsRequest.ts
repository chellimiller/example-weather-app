import https, { RequestOptions } from 'https';
import { URL } from 'url';
import createLogger from '../logger';
import { ObjectValidationError, Result, ServerError, ServerErrorCode } from '../types';

type Options = RequestOptions | string | URL;

export type DataMapper<T = string> = (data: string) => Result<T, ServerError>;

const log = createLogger('sendHttpsRequest');

function sendHttpsRequest<T>(options: Options, mapData: DataMapper<T>): Promise<Result<T, ServerError>> {
  return new Promise(async resolve => {
    log.trace('Creating request', options);

    const request = https.request(options, httpsResponse => {
      const data: string[] = [];

      httpsResponse.on('data', (chunk) => {
        log.trace(`Response received data chunk`, chunk);
        data.push(chunk)
      })

      httpsResponse.on('end', () => {
        log.trace(`Response ended`, data);
        resolve(mapData(data.join('')));
      })
    })

    request.on('error', (error) => {
      log.trace(`Request error`, error);
      resolve({ error: { code: ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000, data: error } });
    });

    request.end();
  })
}

export default sendHttpsRequest;
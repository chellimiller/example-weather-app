import express from 'express';
import { handleWeatherApiRequest } from './api/weather';
import createLogger from './logger';
import { HttpResponseCode, ServerErrorCode } from './types';
import { getRequestType, RequestType, sendAsset } from './util';

const app = express();

const port = 4000;

const log = createLogger('root');

// There is a better way to do this so it can be broken up.
app.get('/*', (request, response) => {
  try {
    const requestType = getRequestType(request.url);

    switch (requestType) {
      case RequestType.API:
        response.status(HttpResponseCode.NOT_FOUND).send(`Call to Unknown API: '${request.url}'`);
        break;
      case RequestType.API_LOCATION:
        handleWeatherApiRequest(request, response);
        response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(ServerErrorCode.NOT_IMPLEMENTED);
        break;
      case RequestType.API_WEATHER:
        handleWeatherApiRequest(request, response);
        break;
      case RequestType.BANNED:
        response.status(HttpResponseCode.FORBIDDEN).send(`Access to '${request.url}' is not allowed.`);
        break;
      case RequestType.ASSET:
        sendAsset(request.url, response);
        break;
      case RequestType.ROUTE:
      default:
        sendAsset('index.html', response);
    }
  } catch (error) {
    response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(ServerErrorCode.UNKNOWN_ERROR);
    log.error(ServerErrorCode.UNKNOWN_ERROR, `Unhandled error during request to '${request.url}'`, error);
  }
});

app.listen(port, () => {
  console.log(`App is being hosted at http://localhost:${port}`);
});
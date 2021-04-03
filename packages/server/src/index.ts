import express from 'express';
import { HttpResponseCode } from './types';
import { getRequestType, RequestType, sendAsset, sendPrivateAsset } from './util';

const app = express();

const port = 3000;

app.get('/*', (request, response) => {
  const requestType = getRequestType(request.url);

  // @todo #2 Determine if this is the hostname of the server, not the hostname of the request origin.
  const hostname = request.hostname;
  const serverSettings = { hostname, port };

  switch (requestType) {
    case RequestType.API:
      response.status(HttpResponseCode.NOT_FOUND).send(`Call to Unknown API: '${request.url}'`);
      break;
    case RequestType.API_WEATHER:
      sendPrivateAsset('weather-api.json', request, response, serverSettings);
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
});

app.listen(port, () => {
  console.log(`App is being hosted at http://localhost:${port}`);
});
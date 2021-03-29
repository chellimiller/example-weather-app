import express from 'express';
import { getRequestType, RequestType, sendAsset, sendPrivateAsset } from './util';

const app = express();

const serverSettings = {
  origin: {
    port: 3000,
    hostname: 'localhost',
  },
};

app.get('/*', (request, response) => {
  const requestType = getRequestType(request.url);

  switch (requestType) {
    case RequestType.API:
      response.status(404).send(`Call to Unknown API: '${request.url}'`);
      break;
    case RequestType.API_WEATHER:
      sendPrivateAsset('weather-api.json', request, response, serverSettings);
      break;
    case RequestType.BANNED:
      response.status(403).send(`Access to '${request.url}' is not allowed.`);
      break;
    case RequestType.ASSET:
      sendAsset(request.url, response);
      break;
    case RequestType.ROUTE:
    default:
      sendAsset('index.html', response);
  }
});

app.listen(serverSettings.origin.port, () => {
  console.log(`App is being hosted at http://${serverSettings.origin.hostname}:${serverSettings.origin.port}`);
});
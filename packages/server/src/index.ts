import express from 'express';
import { getRequestType, RequestType, sendAsset } from './util';

const app = express();
const port = 3000;

app.get('/*', (request, response) => {
  const requestType = getRequestType(request.url);

  switch (requestType) {
    case RequestType.API:
      response.send(`API call to '${request.url}'`);
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

app.listen(port, () => {
  console.log(`App is being hosted at http://localhost:${port}`);
});
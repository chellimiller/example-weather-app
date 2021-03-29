import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { getRequestType, RequestType } from './util';

const app = express();
const port = 3000;

function getResource(resourcePath: string, response: Response<any, any>): void {
  try {
    const resource = fs.readFileSync(path.join(__dirname, resourcePath), { encoding: 'utf-8' });
    response.send(resource);
  } catch (error) {
    // Not a great way to handle this, as the error could be something other than 'not found'.
    // This should be improved.
    console.error(`ERROR ACCESSING RESOURCE '${resourcePath}'`, error);
    response.status(404).send(`ERROR 404: '${resourcePath}' not found`);
  }
}

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
      getResource(request.url, response);
      break;
    case RequestType.ROUTE:
    default:
      getResource('index.html', response);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
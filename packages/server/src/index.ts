import express, { Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

const FILENAME_REGEX = /\.\w+$/;

function isFileResource(resourcePath: string) {
  return !!resourcePath.match(FILENAME_REGEX);
}

function getResource(resourcePath: string, response: Response<any, any>): void {
  try {
    const resource = fs.readFileSync(path.join(__dirname, resourcePath), {encoding: 'utf-8'});
    response.send(resource);
  } catch (error) {
    // Not a great way to handle this, as the error could be something other than 'not found'.
    // This should be improved.
    console.error(`ERROR ACCESSING RESOURCE '${resourcePath}'`, error);
    response.status(404).send(`ERROR 404: '${resourcePath}' not found`);
  }
}

app.get('/*', (req, res) => {
  if (req.url.startsWith('/api/')) {
    res.send(`API call to ${req.url}`);
  } else if (isFileResource(req.url)) {
    getResource(req.url, res);
  } else {
    getResource('index.html', res);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
import { Request, Response } from 'express';
import readAsset, { Asset, ReadAssetErrorType } from './readAsset';

/**
 * Send the requested asset back to the client. Also includes error handling if the file cannot be accessed.
 *
 * @param url URL requested by the client.
 * @param response Response sent back to client.
 */
export default function sendAsset(url: string, response: Response<any, any>): void {
  readAsset(url).then(
    (asset: Asset) => {
      if (!asset.error) {
        response.send(asset.data);
        return;
      }

      if (asset.error.type === ReadAssetErrorType.READ_FILE && asset.error.details.code === 'ENOENT') {
        response.status(404).send(`Cannot find resource '${url}'`);
        return;
      }

      response.status(500).send(`Cannot access resource '${url}'\nError Message: '${asset.error.message}'`);
    },

    // readAsset should never throw/reject, so this implies that some unknown error occurred.
    (error) => {
      console.log(error);
      response.status(500).send('Unknown internal server error');
    },
  );
}

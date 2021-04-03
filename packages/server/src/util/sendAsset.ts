import { Response } from 'express';
import { Asset, HttpResponseCode, ServerErrorCode } from '../types';
import readAsset from './readAsset';

/**
 * Send the requested asset back to the client. Also includes error handling if the file cannot be accessed.
 *
 * @param url URL requested by the client.
 * @param response Response sent back to client.
 */
export default function sendAsset(url: string, response: Response<any, any>): Promise<void> {
  return readAsset(url).then(
    (asset: Asset) => {
      if (!asset.error) {
        response.send(asset.data);
        return;
      }

      if (asset.error.code === ServerErrorCode.READ_FILE_001) {
        response.status(HttpResponseCode.NOT_FOUND).send(`Cannot find resource '${url}'`);
        return;
      }

      response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(asset.error.code);
    },

    // readAsset should never throw/reject, so this implies that some unknown error occurred.
    (error) => {
      console.log(error);
      response.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send('Unknown internal server error');
    },
  );
}

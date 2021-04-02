import { Response } from 'express';
import { Asset, ServerErrorCode } from '../types';
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

      if (asset.error.code === ServerErrorCode.READ_ASSET_FILE_001) {
        response.status(404).send(`Cannot find resource '${url}'`);
        return;
      }

      response.status(500).send(asset.error.code);
    },

    // readAsset should never throw/reject, so this implies that some unknown error occurred.
    (error) => {
      console.log(error);
      response.status(500).send('Unknown internal server error');
    },
  );
}

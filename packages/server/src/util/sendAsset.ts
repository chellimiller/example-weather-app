import { Response } from "express";
import readAsset, { Asset } from "./readAsset";

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
        response.send(asset.content);
        return;
      }

      switch (asset.error.code) {
        case 'ENOENT':
          response.status(404).send(`Cannot find resource '${url}'`);
          break;
        default:
          // Probably don't want to send all of these details to the user.
          // For now, this is acceptable.
          response.status(500)
            .send(`Cannot access resource '${url}'.\nError Code: '${asset.error.code}'\nMessage: '${asset.error.message}'`);
      }
    },

    // getAsset should never throw/reject, so this implies that some unknown error occurred.
    (error) => response.status(500).send(error),
  );
}

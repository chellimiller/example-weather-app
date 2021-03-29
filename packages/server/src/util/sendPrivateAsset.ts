import path from 'path';
import { Request, Response } from 'express';
import isSameOrigin from './isSameOrigin';
import sendAsset from './sendAsset';
import { ServerSettings } from './validateServerSettings';

/**
 * Send the requested asset back to the client if the request is coming from the same origin.
 * Also includes error handling if the file cannot be accessed.
 *
 * @param url Asset to send
 * @param request Request by the client.
 * @param response Response sent back to client.
 */
export default function sendPrivateAsset(url: string, request: Request, response: Response<any, any>, settings: ServerSettings): void {
  if (!isSameOrigin(request, settings)) {
    response.status(403).send(`Access to '${request.url}' is not allowed.`);
    return;
  }

  sendAsset(path.join('config', url), response);
}

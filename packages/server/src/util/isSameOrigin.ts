import { Request } from 'express';
import { ServerSettings } from '../types';

/**
 * Determine if the request was referred by the same origin as the server.
 *
 * @param request Request made by client
 * @param settings Settings for the server
 * @returns Whether or not the request was referred by the same origin.
 */
export default function isSameOrigin(request: Request<any, any>, settings: ServerSettings): boolean {
  const referer = request.headers.referer;

  if (!referer) return false;

  const serverOrigin = `/${settings.hostname}:${settings.port}/`;

  return referer.includes(serverOrigin);
}
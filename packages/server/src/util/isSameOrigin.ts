import { Request } from 'express';
import { ServerSettings } from './validateServerSettings';

export default function isSameOrigin(request: Request<any, any>, settings: ServerSettings): boolean {
  const referer = request.headers.referer;

  if (!referer) return false;

  const serverOrigin = `/${settings.origin.hostname}:${settings.origin.port}/`;

  return referer.includes(serverOrigin);
}
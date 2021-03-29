import { Request } from "express";

export enum RequestType {

  /**
   * This is an API request.
   */
  API = 'API',

  /**
   * This is a request for a file.
   */
  ASSET = 'ASSET',

  /**
   * This is a request that is not allowed.
   */
  BANNED = 'BANNED',

  /**
   * This is a request that is likely to a route off the app.
   * Therefore, the app's index file should be returned.
   */
  ROUTE = 'ROUTE',
}

/**
 * Regular expression that matches a string ending with `.anyword`.
 */
const FILENAME_REGEX = /\.\w+$/;

/**
 * Determine the type of request that was made.
 * This will help us determine what should be sent back.
 *
 * @param url URL from the request.
 * @returns Type of request made by the client.
 */
export default function getRequestType(url: string): RequestType {
  // Determine if the request is to the API.
  if (url.startsWith('/api/') || url === '/api') return RequestType.API;

  // Determine if the file ends with `.someword`.
  if (!!url.match(FILENAME_REGEX)) {
    // Configuration files are not allowed to be accessed by the client.
    if (url.startsWith('/config/')) return RequestType.BANNED;

    // All other files are permitted.
    return RequestType.ASSET;
  }

  // If no other request types apply, we will assume that this is a route type.
  return RequestType.ROUTE;
}
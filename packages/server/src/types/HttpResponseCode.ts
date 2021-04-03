/**
 * Enum with HTTP Response Codes
 */
export enum HttpResponseCode {

  /** Send when the client makes an invalid request. */
  BAD_REQUEST = 400,

  /** Send when the client makes a request to something they're not allowed to use. */
  FORBIDDEN = 403,

  /** Send when the client makes a request for an asset that doesn't exist. */
  NOT_FOUND = 404,

  /** Send when something goes wrong on the server side. */
  INTERNAL_SERVER_ERROR = 500,
}
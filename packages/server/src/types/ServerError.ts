export enum ServerErrorCode {
  EXTERNAL_HTTPS_REQUEST_000 = 'EHR000',

  /** Invalid query parameters to weather API. Unknown reason. */
  API_WEATHER_QUERY_000 = 'AWQ000',

  API_LOCATION_QUERY_000 = 'ALQ000',

  /** Unknown error reading file */
  READ_ASSET_FILE_000 = 'RAF000',

  /** Missing file */
  READ_ASSET_FILE_001 = 'RAF001',

  /** Cannot validate for unknown reasons. */
  VALIDATION_000 = 'V000',
  /** Invalid typeof on object or property */
  VALIDATION_001 = 'V001',
  /** Missing property on object */
  VALIDATION_002 = 'V002',
  /** Invalid value for object or property */
  VALIDATION_003 = 'V003',

  /** JSON Parse error */
  JSON_PARSE_000 = 'JP000',

  /** Function is not yet implemented */
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',

  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

type BaseServerError<C extends ServerErrorCode, T> = {
  code: C;
  data: T;
}

type ApiWeatherInvalidQueryParam = BaseServerError<ServerErrorCode.API_WEATHER_QUERY_000, {
  latQuery: any,
  lonQuery: any,
  lat: number,
  lon: number,
}>;

type ApiLocationQueryParam = BaseServerError<ServerErrorCode.API_LOCATION_QUERY_000, { q: any }>;

type ExternalHttpsRequestError = BaseServerError<ServerErrorCode.EXTERNAL_HTTPS_REQUEST_000, any>;

type ReadAssetFileError = BaseServerError<ServerErrorCode.READ_ASSET_FILE_000 | ServerErrorCode.READ_ASSET_FILE_001, {

  /** File path to the asset. */
  filePath: string;

  /** URL requested. */
  url: string;

  /** User-friendly error message that can be send to the client. */
  message: string;

  /** Error from reading the file. */
  details: NodeJS.ErrnoException;
}>;


type ValidationErrorCode =
  ServerErrorCode.VALIDATION_000 |
  ServerErrorCode.VALIDATION_001 |
  ServerErrorCode.VALIDATION_002 |
  ServerErrorCode.VALIDATION_003 |
  ServerErrorCode.JSON_PARSE_000;

export type ReadAssetValidationError = BaseServerError<ValidationErrorCode, {

  /** File path to the asset. */
  filePath: string;

  /** URL requested. */
  url: string;

  /** User-friendly error message that can be send to the client. */
  message: string;

  /** Object that failed validation. */
  value: any;
}>;

export type ObjectValidationError = BaseServerError<ValidationErrorCode, {

  /** User-friendly error message that can be send to the client. */
  message: string;

  /** Object that failed validation. */
  value: any;
}>;

/**
 * Error that can occur when attempting to read an asset.
 */
export type ReadAssetError = ReadAssetFileError | ReadAssetValidationError;

export type ServerError =
  ObjectValidationError |
  ApiLocationQueryParam |
  ExternalHttpsRequestError |
  ApiWeatherInvalidQueryParam |
  ReadAssetFileError |
  ReadAssetValidationError;
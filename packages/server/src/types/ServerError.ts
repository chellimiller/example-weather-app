export enum ServerErrorCode {
  /** Invalid query parameters to weather API. Unknown reason. */
  API_WEATHER_QUERY_000 = 'AWQ000',
  API_WEATHER_EXTERNAL_000 = 'AWE000',

  API_LOCATION_QUERY_000 = 'ALQ000',
  API_LOCATION_EXTERNAL_000 = 'AEQ000',

  /** Unknown error reading file */
  READ_ASSET_FILE_000 = 'RAF000',

  /** Missing file */
  READ_ASSET_FILE_001 = 'RAF001',


  READ_ASSET_VALIDATE_000 = 'RAV000',
  /** Invalid typeof on object or property */
  READ_ASSET_VALIDATE_001 = 'RAV001',
  /** Missing property on object */
  READ_ASSET_VALIDATE_002 = 'RAV002',
  /** Invalid value for object or property */
  READ_ASSET_VALIDATE_003 = 'RAV003',

  /** JSON Parse error */
  JSON_PARSE_000 = 'JP000',
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

type ApiWeatherExternalRequestError = BaseServerError<ServerErrorCode.API_WEATHER_EXTERNAL_000, unknown>;
type ApiLocationExternalRequestError = BaseServerError<ServerErrorCode.API_LOCATION_EXTERNAL_000, unknown>;

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

type ReadAssetValidationErrorCode =
  ServerErrorCode.READ_ASSET_VALIDATE_000 |
  ServerErrorCode.READ_ASSET_VALIDATE_001 |
  ServerErrorCode.READ_ASSET_VALIDATE_002 |
  ServerErrorCode.READ_ASSET_VALIDATE_003 |
  ServerErrorCode.JSON_PARSE_000;

export type ReadAssetValidationError = BaseServerError<ReadAssetValidationErrorCode, {

  /** File path to the asset. */
  filePath: string;

  /** URL requested. */
  url: string;

  /** User-friendly error message that can be send to the client. */
  message: string;

  /** Object that failed validation. */
  value: any;
}>;

export type ObjectValidationError = BaseServerError<ReadAssetValidationErrorCode, {

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
  ApiLocationQueryParam |
  ApiWeatherExternalRequestError |
  ApiWeatherInvalidQueryParam |
  ApiLocationExternalRequestError |
  ReadAssetFileError |
  ReadAssetValidationError;
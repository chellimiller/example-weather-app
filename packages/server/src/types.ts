/**
 * Result from an operation or request.
 */
export type Result<T, ERROR = any> = ({
  data: T;
  error: undefined;
}) | ({
  data: undefined;
  error: ERROR;
});

/**
 * Settings for a server.
 */
export type ServerSettings = {

  /** Port that the server is listening on. */
  port: number;

  /** Hostname of the server. */
  hostname: string;
}

/**
 * Type of Weather API that is supported.
 */
export enum WeatherApiConfigType {
  OPEN_WEATHER_MAP = 'openweathermap.org',
}

/**
 * Weather API configuration that includes the API being accessed and the API key.
 */
export type WeatherApiConfig = {

  /** API being accessed. */
  type: WeatherApiConfigType;

  /** Unique key used to access the API. */
  key: string;
}

/**
 * Type of error that can occur when reading an asset.
 */
export enum ReadAssetErrorType {

  /** Error that occurs when attempting to read the file contents. */
  READ_FILE = 'READ_FILE',

  /** Error that occurs when validating the file contents. */
  VALIDATION = 'VALIDATION',
}

/**
 * Common properties for errors that can occur when reading an asset.
 */
type BaseReadAssetError<T extends ReadAssetErrorType> = {

  /** Type of error that occurred. */
  type: T;

  /** File path to the asset. */
  filePath: string;

  /** URL requested. */
  url: string;

  /** User-friendly error message that can be send to the client. */
  message: string;
}

type ReadFileError = {

  /** Error from reading the file. */
  details: NodeJS.ErrnoException;
};

type ValidateAssetError = {

  /** Detailed message that should be included in a log. */
  details: string;

  /** Message that will be shown to user. */
  message: string;
}

/**
 * Error that can occur when attempting to read an asset.
 */
export type ReadAssetError =
  (BaseReadAssetError<ReadAssetErrorType.READ_FILE> & ReadFileError) |
  (BaseReadAssetError<ReadAssetErrorType.VALIDATION> & ValidateAssetError);

/**
 * Function that validates that an asset's structure/type is correct.
 */
export type AssetValidator<T = string> = (data: any) => Result<T, ValidateAssetError>;

/**
 * Result from attempting to read an asset.
 */
export type Asset<T = string> = Result<T, ReadAssetError>;
import { ServerErrorCode } from './ServerErrorCode';

type BaseServerError<C extends ServerErrorCode, T> = {
  code: C;
  data: T;
}

export type ReadFileError = BaseServerError<ServerErrorCode.READ_FILE_000 | ServerErrorCode.READ_FILE_001, {

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

export type ObjectValidationError = BaseServerError<ValidationErrorCode, {

  /** User-friendly error message that can be send to the client. */
  message: string;

  /** Object that failed validation. */
  value: any;
}>;

/**
 * Error that can occur when attempting to read an asset.
 */
export type ReadAssetError = ReadFileError | ObjectValidationError;

type NotImplementedError = BaseServerError<ServerErrorCode.NOT_IMPLEMENTED, any>;
type UnknownServerError = BaseServerError<ServerErrorCode.UNKNOWN_ERROR, any>;

export type ServerError = ObjectValidationError | ReadFileError | NotImplementedError | UnknownServerError;
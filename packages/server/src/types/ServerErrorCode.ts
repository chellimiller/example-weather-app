/**
 * Enum of all error codes that can be passed to client.
 * This makes it easier to localize error messages in the future.
 * 
 * @todo #11 Use these in the error code message endpoint.
 */
export enum ServerErrorCode {

  /** Unknown error reading file */
  READ_FILE_000 = 'RF000',

  /** Missing file */
  READ_FILE_001 = 'RF001',

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

  /** Functionality is not yet implemented. */
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',

  /** An unknown error has occurred.  */
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

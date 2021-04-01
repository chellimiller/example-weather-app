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
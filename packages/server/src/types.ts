
export type Result<T, ERROR = any> = ({
  data: T;
  error: undefined;
}) | ({
  data: undefined;
  error: ERROR;
});
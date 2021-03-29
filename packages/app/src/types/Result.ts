/**
 * Status of the result.
 */
export enum ResultStatus {

  /** Data has been loaded. */
  DATA_LOAD = 'DATA_LOAD',

  /** An error occurred. */
  ERROR = 'ERROR',

  /** Request has not been initialized. */
  INIT_REQUIRED = 'INIT_REQUIRED',

  /** Request is loading. */
  LOADING = 'LOADING',

  /** An error occurred that should not have happened. */
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

/**
 * Common properties for result types.
 */
type BaseResult<STATUS extends ResultStatus> = {

  /** Status/type of result. */
  status: STATUS;

  /** User-friendly error message that can be displayed in UI. */
  message: string;
};

/**
 * Result that occurs when data has been successfully loaded.
 *
 * @template DATA Type/structure of data returned.
 */
export type DataLoadResult<DATA> = BaseResult<ResultStatus.DATA_LOAD> & {

  /** Data that was requested and has successfully been loaded. */
  data: DATA;
};

/**
 * Result that occurs when data cannot be loaded.
 *
 * @template Error Type/structure of the error.
 */
export type ErrorResult<ERROR = any> = BaseResult<ResultStatus.ERROR> & {

  /** Error that occurred when attempting to load data. */
  error: ERROR;
};

/**
 * Result that occurs when the request hasn't been initialized.
 */
export type InitRequiredResult = BaseResult<ResultStatus.INIT_REQUIRED>;

/**
 * Result that occurs when the request is loading.
 */
export type LoadingResult = BaseResult<ResultStatus.LOADING>;

/**
 * Result that occurs when there is an error that shouldn't have been possible.
 */
export type UnexpectedErrorResult = BaseResult<ResultStatus.UNEXPECTED_ERROR> & {

  /** Error that occurred when attempting to load data. */
  error: any;
};
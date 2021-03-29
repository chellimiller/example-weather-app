export enum ResultStatus {
  DATA_LOAD = 'DATA_LOAD',
  ERROR = 'ERROR',
  INIT_REQUIRED = 'INIT_REQUIRED',
  LOADING = 'LOADING',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
}

type BaseResult<STATUS extends ResultStatus> = {
  status: STATUS;
  message: string;
};

export type DataLoadResult<DATA> = BaseResult<ResultStatus.DATA_LOAD> & {
  data: DATA;
};

export type ErrorResult<ERROR = any> = BaseResult<ResultStatus.ERROR> & {
  error: ERROR;
};

export type InitRequiredResult = BaseResult<ResultStatus.INIT_REQUIRED>;

export type LoadingResult = BaseResult<ResultStatus.LOADING>;

export type UnexpectedErrorResult = BaseResult<ResultStatus.UNEXPECTED_ERROR> & {
  error: any;
};
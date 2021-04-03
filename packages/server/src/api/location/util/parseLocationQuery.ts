import { Request } from 'express';
import { Result, ServerError, ServerErrorCode, LocationQuery } from '../../../types';
import parseCityQuery from './parseCityQuery';
import parseZipcodeQuery from './parseZipcodeQuery';

export default function parseLocationQuery(request: Request): Result<LocationQuery, ServerError> {
  const locationQuery = parseCityQuery(request);
  if (locationQuery.data) return locationQuery;

  const zipcodeQuery = parseZipcodeQuery(request);
  if (zipcodeQuery.data) return zipcodeQuery;

  return {
    error: {
      code: ServerErrorCode.API_LOCATION_QUERY_000,
      data: { ...locationQuery.error.data, ...zipcodeQuery.error.data },
    }
  }
}
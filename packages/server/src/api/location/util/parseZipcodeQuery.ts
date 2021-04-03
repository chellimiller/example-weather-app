import { Request } from 'express';
import { Result, ServerError, ServerErrorCode, LocationQueryType, ZipcodeLocationQuery } from '../../../types';

export default function parseZipcodeQuery(request: Request): Result<ZipcodeLocationQuery, ServerError> {
  const zipQuery = request.query.zip;

  if (typeof zipQuery !== 'string' && !Array.isArray(zipQuery)) {
    return {
      error: {
        code: ServerErrorCode.API_LOCATION_QUERY_000,
        data: { q: zipQuery },
      }
    }
  }

  if (typeof zipQuery === 'string') {
    return {
      data: {
        type: LocationQueryType.ZIP_CODE,
        zipcode: zipQuery,
      }
    }
  }

  // Technically, state might be the country code
  // Doesn't matter, we'll just put it pack into an array anyway.
  const [zipcode, country] = zipQuery;

  if (!country) {
    return {
      data: {
        type: LocationQueryType.ZIP_CODE,
        // @todo #6 This is bad
        zipcode: `${zipcode}`,
      }
    }
  }

  return {
    data: {
      type: LocationQueryType.ZIP_CODE,
      // @todo #6 This is bad
      zipcode: `${zipcode}`,
      country: `${country}`,
    }
  }
}
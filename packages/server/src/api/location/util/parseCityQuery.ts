import { Request } from "express";
import { Result, CityLocationQuery, ServerError, ServerErrorCode, LocationQueryType } from "../../../types";

export default function parseCityQuery(request: Request): Result<CityLocationQuery, ServerError> {
  const qQuery = request.query.q;

  if (typeof qQuery !== 'string' && !Array.isArray(qQuery)) {
    return {
      error: {
        code: ServerErrorCode.API_LOCATION_QUERY_000,
        data: { q: qQuery },
      }
    }
  }

  if (typeof qQuery === 'string') {
    return {
      data: {
        type: LocationQueryType.CITY,
        city: qQuery,
      }
    }
  }

  // Technically, state might be the country code
  // Doesn't matter, we'll just put it pack into an array anyway.
  const [city, state, country] = qQuery;

  if (!state) {
    return {
      data: {
        type: LocationQueryType.CITY,
        // @todo #6 This is bad
        city: `${city}`,
      }
    }
  }

  if (!country) {
    return {
      data: {
        type: LocationQueryType.CITY,
        // @todo #6 This is bad
        city: `${city}`,
        state: `${state}`,
      }
    }
  }

  return {
    data: {
      type: LocationQueryType.CITY,
      // @todo #6 This is bad
      city: `${city}`,
      state: `${state}`,
      country: `${country}`,
    }
  }
}
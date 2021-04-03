
import createLogger from '../../../logger';
import { City, ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { DirectGeocodingCity } from './types';
import validateDirectGeocodingCity from './validateDirectGeocodingCity';

const log = createLogger('mapDirectGeocodingCity');

export default function mapDirectGeocodingCity(unvalidated: object): Result<City[], ObjectValidationError> {
  if (!Array.isArray(unvalidated)) {
    return {
      error: {
        code: ServerErrorCode.VALIDATION_003,
        data: {
          message: `data is expected to be an array`,
          value: unvalidated,
        },
      }
    }
  }

  const data: City[] = (unvalidated || []) as City[];

  for (let i = 0; i < data.length; i++) {
    const city = validateDirectGeocodingCity(data[i], i);
    if (city.error) return city;
  }

  return { data };
}
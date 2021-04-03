import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { DirectGeocodingCity } from './types';

export default function validateDirectGeocodingCity(unvalidated: object, index: number = Number.NaN): Result<DirectGeocodingCity, ObjectValidationError> {

  const createInvalidTypeResult = (property: keyof DirectGeocodingCity, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'data${Number.isNaN(index) ? '' : `[${index}]`}.${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      },
    }
  });

  const {
    name,
    lat,
    lon,
    state = '',
    country,
  }: DirectGeocodingCity = unvalidated as DirectGeocodingCity;

  if (typeof name !== 'string') createInvalidTypeResult('name', 'string');
  if (typeof state !== 'string') createInvalidTypeResult('state', 'string');
  if (typeof country !== 'string') createInvalidTypeResult('country', 'string');
  if (typeof lat !== 'number') createInvalidTypeResult('lat', 'number');
  if (typeof lon !== 'number') createInvalidTypeResult('lon', 'number');

  if (!state) {
    return {
      data: { name, lat, lon, country },
    };
  }

  return {
    data: { name, lat, lon, country, state },
  };
}
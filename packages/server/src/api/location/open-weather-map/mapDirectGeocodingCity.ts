import createLogger from '../../../logger';
import { City, ObjectValidationError, Result } from '../../../types';
import validateDirectGeocodingCity from './validateDirectGeocodingCity';

const log = createLogger('mapDirectGeocodingCityList');

export default function mapDirectGeocodingCity(unvalidated: object, index: number = Number.NaN): Result<City, ObjectValidationError> {
  log.debug('Validating data');
  const validated = validateDirectGeocodingCity(unvalidated, index);
  log.debug('Data validated');
  if (validated.error) return validated;

  const { name, country, state, lat, lon } = validated.data;

  return { data: { name, country, state, lat, lon } };
}

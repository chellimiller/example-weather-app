import { ObjectValidationError, Result, ServerErrorCode } from '../../../types';
import { OneCallWeatherCondition } from './types';

export default function validateOneCallWeatherCondition(unvalidated: object, prefix: string): Result<OneCallWeatherCondition, ObjectValidationError> {

  const createInvalidTypeResult = (property: keyof OneCallWeatherCondition, expectedType: string) => ({
    error: {
      code: ServerErrorCode.VALIDATION_003,
      data: {
        message: `'${prefix}.${property}' is expected have type '${expectedType}'`,
        value: unvalidated,
      },
    }
  });

  const data: OneCallWeatherCondition = unvalidated as OneCallWeatherCondition;

  if (typeof data.id !== 'number') createInvalidTypeResult('id', 'number');
  if (typeof data.main !== 'string') createInvalidTypeResult('main', 'string');
  if (typeof data.description !== 'string') createInvalidTypeResult('description', 'string');

  return { data };
}